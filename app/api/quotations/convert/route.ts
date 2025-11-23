import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Verificar autenticación
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const body = await request.json();
        const { quotationId } = body;

        if (!quotationId) {
            return NextResponse.json({ error: 'Falta quotationId' }, { status: 400 });
        }

        // 2. Obtener la cotización
        const { data: quotation, error: fetchError } = await supabase
            .from('quotations')
            .select('*')
            .eq('id', quotationId)
            .single();

        if (fetchError || !quotation) {
            return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
        }

        if (quotation.status === 'converted') {
            return NextResponse.json({ error: 'Esta cotización ya fue convertida' }, { status: 400 });
        }

        // 3. Verificar que el usuario tenga permiso sobre la tienda de la cotización
        // (Simplificado: verificamos si es staff de esa tienda)
        const { data: isStaff } = await supabase
            .from('store_staff')
            .select('id')
            .eq('store_id', quotation.store_id)
            .eq('user_id', user.id)
            .single();

        // También permitir si es el dueño (en tabla stores)
        const { data: isOwner } = await supabase
            .from('stores')
            .select('id')
            .eq('id', quotation.store_id)
            .eq('user_id', user.id)
            .single();

        if (!isStaff && !isOwner) {
            return NextResponse.json({ error: 'No tienes permisos para esta tienda' }, { status: 403 });
        }

        // 4. Crear la Orden
        const orderData = {
            store_id: quotation.store_id,
            ticket: `ORD-${quotation.ticket.replace('COT-', '')}`, // Convertir ticket COT a ORD
            user_id: quotation.user_id,
            customer_name: quotation.customer_name,
            customer_phone: quotation.customer_phone,
            customer_email: quotation.customer_email,
            delivery_city: quotation.customer_city,
            items: quotation.items,
            subtotal: quotation.subtotal,
            discount: quotation.discount,
            total: quotation.total,
            status: 'confirmed', // Estado inicial de la orden
            payment_status: 'paid', // Asumimos pagado al cerrar venta manualmente
            paid_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
        };

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order:', orderError);
            throw new Error('Error al crear el pedido');
        }

        // 5. Actualizar la Cotización
        const { error: updateError } = await supabase
            .from('quotations')
            .update({
                status: 'converted',
                converted_to_order_id: order.id,
                updated_at: new Date().toISOString(),
            })
            .eq('id', quotationId);

        if (updateError) {
            console.error('Error updating quotation:', updateError);
            // Nota: La orden ya se creó, esto es un estado inconsistente menor.
            // En producción usaríamos una transacción SQL.
        }

        // 6. Registrar evento
        await supabase.from('quotation_events').insert({
            quotation_id: quotationId,
            event_type: 'converted',
            created_by: user.id,
            event_data: { order_id: order.id }
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            message: 'Venta cerrada exitosamente'
        });

    } catch (error: any) {
        console.error('Error in convert quotation:', error);
        return NextResponse.json(
            { error: error.message || 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
