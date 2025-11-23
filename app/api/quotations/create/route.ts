import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado. Debes iniciar sesión para crear cotizaciones.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, customerData } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay productos en el carrito' },
        { status: 400 }
      );
    }

    if (!customerData?.name || !customerData?.phone) {
      return NextResponse.json(
        { error: 'Faltan datos del cliente (nombre y teléfono)' },
        { status: 400 }
      );
    }

    // Agrupar items por tienda
    const itemsByStore: Record<string, any[]> = {};
    const DEFAULT_STORE_ID = 'f00f661a-f20f-448e-aea6-87ab2301fd79'; // Moda Start ID
    let firstValidStoreId: string | null = null;

    // Encontrar el primer store_id válido
    for (const item of items) {
      if (item.product.store_id && item.product.store_id.length > 0) {
        firstValidStoreId = item.product.store_id;
        break;
      }
    }

    items.forEach((item: any) => {
      // Usar el store_id del producto, o el primero válido encontrado
      // Esto corrige productos antiguos en el carrito que no tenían store_id
      const storeId = item.product.store_id || firstValidStoreId;

      if (!storeId) {
        console.warn('Item without store_id and no fallback found:', item.product.name);
        // Si no hay store_id, no podemos procesar este item correctamente
        // Podríamos asignarlo a una tienda por defecto o saltarlo
        return;
      }

      if (!itemsByStore[storeId]) {
        itemsByStore[storeId] = [];
      }
      itemsByStore[storeId].push(item);
    });

    // Crear una cotización por cada tienda
    const quotations = [];

    for (const [storeId, storeItems] of Object.entries(itemsByStore)) {
      const subtotal = storeItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Generar ticket único: COT-TIMESTAMP-RANDOM
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const ticket = `COT-${timestamp}-${random}`;

      const quotationData = {
        ticket, // Added ticket field
        store_id: storeId,
        user_id: user.id,
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_email: user.email || customerData.email,
        customer_city: customerData.city || 'Samacá',
        items: storeItems.map((item) => ({
          product_id: item.product.id,
          name: item.product.name,
          size: item.size || null,
          color: item.color || null,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.product.price * item.quantity,
          image_url: item.product.images?.[0] || null,
        })),
        subtotal: subtotal,
        discount: 0,
        total: subtotal,
        status: 'pending',
        whatsapp_sent_at: null,
      };

      // Insertar cotización
      console.log('Inserting quotation:', JSON.stringify(quotationData, null, 2));

      const { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .insert(quotationData)
        .select()
        .single();

      if (quotationError) {
        console.error('Error creating quotation (DB Insert):', quotationError);
        throw new Error(`Database error: ${quotationError.message} (${quotationError.code})`);
      }

      console.log('Quotation created successfully:', quotation.id);

      // Registrar evento de creación
      const { error: eventError } = await supabase.from('quotation_events').insert({
        quotation_id: quotation.id,
        event_type: 'created',
        created_by: user.id,
        event_data: {
          items_count: storeItems.length,
          total: subtotal,
        },
      });

      if (eventError) {
        console.error('Error creating quotation event:', eventError);
      }

      quotations.push(quotation);
    }

    return NextResponse.json({
      success: true,
      quotations,
      message: `Se ${quotations.length === 1 ? 'creó 1 cotización' : `crearon ${quotations.length} cotizaciones`}`,
    });
  } catch (error: any) {
    console.error('CRITICAL ERROR in quotations/create:', error);
    return NextResponse.json(
      {
        error: 'Error al crear cotizaciones',
        details: error.message || 'Unknown error',
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
