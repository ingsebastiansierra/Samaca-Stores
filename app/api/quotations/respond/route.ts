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
      message += `Te gustaria proceder con esta compra?`

      const whatsappUrl = `https://wa.me/${quotation.customer_phone}?text=${encodeURIComponent(message)}`

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
