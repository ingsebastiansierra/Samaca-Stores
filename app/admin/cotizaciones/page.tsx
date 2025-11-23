'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import {
    Package,
    Search,
    Clock,
    CheckCircle,
    MessageCircle,
    XCircle,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Definición de estados para mapeo visual
const STATUS_CONFIG = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    contacted: { label: 'Contactado', color: 'bg-blue-100 text-blue-800', icon: MessageCircle },
    negotiating: { label: 'Negociando', color: 'bg-blue-100 text-blue-800', icon: MessageCircle },
    accepted: { label: 'Aceptada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    converted: { label: 'Venta Cerrada', color: 'bg-purple-100 text-purple-800', icon: Package },
    cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircle },
    expired: { label: 'Expirada', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

export default function AdminQuotationsPage() {
    const [quotations, setQuotations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const supabase = createClient();

    useEffect(() => {
        loadQuotations();
    }, []);

    async function loadQuotations() {
        try {
            // Obtener la tienda del usuario actual
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Primero obtenemos el store_id del usuario (asumiendo que es staff/owner)
            const { data: staffData } = await supabase
                .from('store_staff')
                .select('store_id')
                .eq('user_id', user.id)
                .single();

            // Si no es staff, intentamos ver si es owner directo en la tabla stores
            let storeId = staffData?.store_id;

            if (!storeId) {
                const { data: storeData } = await supabase
                    .from('stores')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();
                storeId = storeData?.id;
            }

            if (!storeId) {
                console.error('No store found for user:', user.id);
                setLoading(false);
                return;
            }

            console.log('Loading quotations for store:', storeId);

            // Cargar cotizaciones de la tienda
            const { data, error } = await supabase
                .from('quotations')
                .select('*')
                .eq('store_id', storeId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setQuotations(data || []);
        } catch (error) {
            console.error('Error loading quotations:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredQuotations = quotations.filter(q => {
        const matchesSearch =
            q.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.ticket.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || q.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
                    <p className="text-gray-600">Administra las solicitudes de tus clientes</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por cliente o ticket..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="border rounded-md px-3 py-2 bg-white text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="contacted">Contactados</option>
                    <option value="converted">Ventas Cerradas</option>
                    <option value="cancelled">Canceladas</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Ticket</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    Cargando cotizaciones...
                                </td>
                            </tr>
                        ) : filteredQuotations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No se encontraron cotizaciones
                                </td>
                            </tr>
                        ) : (
                            filteredQuotations.map((quotation) => {
                                const status = STATUS_CONFIG[quotation.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={quotation.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {quotation.ticket}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{quotation.customer_name}</p>
                                                <p className="text-xs text-gray-500">{quotation.customer_phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {formatDistanceToNow(new Date(quotation.created_at), { addSuffix: true, locale: es })}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ${quotation.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/cotizaciones/${quotation.id}`}>
                                                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                                    Ver Detalle
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
