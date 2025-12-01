import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quotationId, items, notes, validUntil, format } = body

    const supabase = await createClient()

    // Obtener la cotización
    const { data: quotation, error: quotationError } = await supabase
      .from('quotations')
      .select('*, stores(*)')
      .eq('id', quotationId)
      .single()

    if (quotationError || !quotation) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
    }

    // Calcular totales
    const originalTotal = items.reduce((sum: number, item: any) =>
      sum + (item.originalPrice * item.quantity), 0
    )
    const adjustedTotal = items.reduce((sum: number, item: any) =>
      sum + (item.adjustedPrice * item.quantity), 0
    )
    const totalDiscount = originalTotal - adjustedTotal
    const discountPercentage = Math.round((totalDiscount / originalTotal) * 100)

    // Calcular fecha de validez
    const validUntilDate = new Date()
    validUntilDate.setDate(validUntilDate.getDate() + validUntil)

    // Guardar la respuesta en la base de datos
    // Intentar guardar la respuesta
    // Primero intentamos INSERT (para crear historial si la BD lo permite)
    let savedResponse
    let saveError

    try {
      const { data, error } = await supabase
        .from('quotation_responses')
        .insert({
          quotation_id: quotationId,
          store_id: quotation.store_id,
          items: items,
          original_total: originalTotal,
          adjusted_total: adjustedTotal,
          total_discount: totalDiscount,
          discount_percentage: discountPercentage,
          notes: notes || null,
          valid_until_days: validUntil,
          valid_until_date: validUntilDate.toISOString(),
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single()

      savedResponse = data
      saveError = error
    } catch (e) {
      saveError = e
    }

    // Si falla el insert (probablemente por restricción UNIQUE), hacemos UPDATE
    if (saveError) {
      console.log('Insert falló, intentando Update...', (saveError as any)?.message || saveError)

      const { data, error } = await supabase
        .from('quotation_responses')
        .update({
          items: items,
          original_total: originalTotal,
          adjusted_total: adjustedTotal,
          total_discount: totalDiscount,
          discount_percentage: discountPercentage,
          notes: notes || null,
          valid_until_days: validUntil,
          valid_until_date: validUntilDate.toISOString(),
          created_at: new Date().toISOString() // Actualizamos fecha para que suba en el orden
        })
        .eq('quotation_id', quotationId)
        .select()
        .single()

      savedResponse = data
      saveError = error
    }

    if (saveError) {
      console.error('Error guardando respuesta (Insert y Update fallaron):', saveError)
      // No fallar fatalmente, intentar continuar
    }

    // Generar link para ver la cotización
    // En producción usará el dominio de Vercel automáticamente
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
      'http://localhost:3000'
    const quotationLink = `${baseUrl}/cotizacion/${quotation.ticket}`

    // Si solo es para guardar, actualizar estado y retornar
    if (format === 'save') {
      await supabase
        .from('quotations')
        .update({
          status: 'contacted',
          store_responded_at: new Date().toISOString(),
          admin_notes: notes || null
        })
        .eq('id', quotationId)

      return NextResponse.json({
        success: true,
        message: 'Respuesta guardada exitosamente',
        responseId: savedResponse?.id
      })
    }

    // Crear mensaje para WhatsApp
    if (format === 'whatsapp') {
      let message = `COTIZACION PERSONALIZADA\n\n`
      message += `Hola ${quotation.customer_name}!\n\n`
      message += `Gracias por tu interes. Te envio una cotizacion especial:\n\n`
      message += `Ticket: ${quotation.ticket}\n\n`
      message += `PRODUCTOS:\n`

      items.forEach((item: any, index: number) => {
        message += `\n${index + 1}. ${item.name}\n`
        if (item.size) message += `   Talla: ${item.size}\n`
        if (item.color) message += `   Color: ${item.color}\n`
        message += `   Cantidad: ${item.quantity}\n`

        if (item.discount > 0) {
          message += `   Precio original: $${item.originalPrice.toLocaleString()}\n`
          message += `   Precio con descuento: $${item.adjustedPrice.toLocaleString()}\n`
          message += `   Descuento: ${item.discount}%\n`
        } else {
          message += `   Precio: $${item.adjustedPrice.toLocaleString()}\n`
        }
        message += `   Subtotal: $${(item.adjustedPrice * item.quantity).toLocaleString()}\n`
      })

      message += `\n------------------------\n`

      if (totalDiscount > 0) {
        message += `Subtotal: $${originalTotal.toLocaleString()}\n`
        message += `Descuento (${discountPercentage}%): -$${totalDiscount.toLocaleString()}\n`
        message += `\nTOTAL: $${adjustedTotal.toLocaleString()}\n`
      } else {
        message += `\nTOTAL: $${adjustedTotal.toLocaleString()}\n`
      }

      if (notes) {
        message += `\nNota: ${notes}\n`
      }

      message += `\nOferta valida por ${validUntil} dias\n\n`
      message += `Ver cotizacion completa:\n${quotationLink}\n\n`
      message += `Te gustaria proceder con esta compra?`

      // Formatear el número de teléfono con código de país
      const { formatPhoneForWhatsApp } = await import('@/lib/utils/phone')
      const formattedPhone = formatPhoneForWhatsApp(quotation.customer_phone)
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`

      // Actualizar estado de la cotización
      await supabase
        .from('quotations')
        .update({
          status: 'contacted',
          store_responded_at: new Date().toISOString(),
          admin_notes: notes || null
        })
        .eq('id', quotationId)

      return NextResponse.json({ whatsappUrl })
    }

    // Generar PDF
    if (format === 'pdf') {
      // Importar dinámicamente para evitar problemas con SSR
      const { generateQuotationPDF } = await import('@/lib/utils/pdf-generator')

      const pdfData = {
        ticket: quotation.ticket,
        storeName: quotation.stores?.name || 'Samacá Store',
        storePhone: quotation.stores?.phone || quotation.stores?.whatsapp,
        storeAddress: quotation.stores?.address,
        customerName: quotation.customer_name,
        customerPhone: quotation.customer_phone,
        customerCity: quotation.customer_city,
        items: items.map((item: any) => ({
          name: item.name,
          originalPrice: item.originalPrice,
          adjustedPrice: item.adjustedPrice,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          discount: item.discount
        })),
        notes,
        validUntil,
        createdAt: new Date(quotation.created_at)
      }

      const pdf = generateQuotationPDF(pdfData)
      const pdfBase64 = pdf.output('datauristring')

      // Actualizar estado de la cotización
      await supabase
        .from('quotations')
        .update({
          status: 'contacted',
          store_responded_at: new Date().toISOString(),
          admin_notes: notes || null
        })
        .eq('id', quotationId)

      return NextResponse.json({
        pdfBase64,
        filename: `cotizacion-${quotation.ticket}.pdf`
      })
    }

    return NextResponse.json({ error: 'Formato no válido' }, { status: 400 })

  } catch (error: any) {
    console.error('Error responding to quotation:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
