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

    items.forEach((item: any) => {
      const storeId = item.product.store_id;
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

      const quotationData = {
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
      const { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .insert(quotationData)
        .select()
        .single();

      if (quotationError) {
        console.error('Error creating quotation:', quotationError);
        throw quotationError;
      }

      // Registrar evento de creación
      await supabase.from('quotation_events').insert({
        quotation_id: quotation.id,
        event_type: 'created',
        created_by: user.id,
        event_data: {
          items_count: storeItems.length,
          total: subtotal,
        },
      });

      quotations.push(quotation);
    }

    return NextResponse.json({
      success: true,
      quotations,
      message: `Se ${quotations.length === 1 ? 'creó 1 cotización' : `crearon ${quotations.length} cotizaciones`}`,
    });
  } catch (error) {
    console.error('Error in quotations/create:', error);
    return NextResponse.json(
      {
        error: 'Error al crear cotizaciones',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
