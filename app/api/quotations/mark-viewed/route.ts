import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Verificar autenticación
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        // Obtener el store_id del usuario
        let storeId = null;
        const { data: store } = await supabase
            .from('stores')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (store) {
            storeId = store.id;
        } else {
            const { data: staff } = await supabase
                .from('store_staff')
                .select('store_id')
                .eq('user_id', user.id)
                .single();
            if (staff) storeId = staff.store_id;
        }

        if (!storeId) {
            return NextResponse.json({ error: 'No se encontró tienda' }, { status: 404 });
        }

        // Marcar todas las cotizaciones pendientes como vistas
        const { error: updateError } = await supabase
            .from('quotations')
            .update({ admin_viewed_at: new Date().toISOString() })
            .eq('store_id', storeId)
            .eq('status', 'pending')
            .is('admin_viewed_at', null);

        if (updateError) {
            console.error('Error marking notifications as viewed:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error in mark notifications viewed:', error);
        return NextResponse.json(
            { error: error.message || 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
