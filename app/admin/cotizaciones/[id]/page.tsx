'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import {
    ArrowLeft,
    Package,
    User,
    Phone,
    MapPin,
    MessageCircle,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function AdminQuotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [quotation, setQuotation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [converting, setConverting] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        loadQuotation();
    }, []);

    async function loadQuotation() {
        try {
            const { data, error } = await supabase
                .from('quotations')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) throw error;
            setQuotation(data);
        } catch (error) {
            console.error('Error loading quotation:', error);
            toast.error('Error al cargar la cotización');
        } finally {
            setLoading(false);
        }
    }

    async function handleCloseSale() {
        if (!confirm('¿Estás seguro de cerrar esta venta? Se creará un pedido oficial y se registrará el ingreso.')) {
            return;
        }

        try {
            setConverting(true);
            const response = await fetch('/api/quotations/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quotationId: quotation.id }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Error al convertir venta');

            toast.success('¡Venta cerrada exitosamente! 🎉');
            loadQuotation(); // Recargar datos
        } catch (error: any) {
            console.error('Error closing sale:', error);
            toast.error(error.message);
        } finally {
            setConverting(false);
        }
    }

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div>;
    }

    if (!quotation) return <div className="p-8">Cotización no encontrada</div>;

    const isConverted = quotation.status === 'converted';

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/cotizaciones">
                    <Button variant="ghost" size="sm" className="mb-4 text-gray-600">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al listado
                    </Button>
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Cotización {quotation.ticket}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${isConverted ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {isConverted ? 'Venta Cerrada' : 'Pendiente'}
                            </span>
                        </div>
                        <p className="text-gray-500">
                            Creada el {format(new Date(quotation.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <a
                            href={`https://wa.me/${quotation.customer_phone}?text=Hola ${quotation.customer_name}, te escribo sobre tu cotización ${quotation.ticket}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                WhatsApp Cliente
                            </Button>
                        </a>

                        {!isConverted && (
                            <Button
                                onClick={handleCloseSale}
                                disabled={converting}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {converting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Cerrar Venta
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Products */}
                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Productos ({quotation.items.length})
                            </h2>
                        </div>
                        <div className="divide-y">
                            {quotation.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 flex gap-4">
                                    <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                        {item.image_url ? (
                                            <Image
                                                src={item.image_url}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <Package className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <div className="text-sm text-gray-500">
                                            {item.size && <span>Talla: {item.size} • </span>}
                                            {item.color && <span>Color: {item.color}</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.quantity} x ${item.price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total Venta</span>
                            <span className="text-xl font-bold text-green-700">
                                ${quotation.total.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Datos del Cliente
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Nombre</label>
                                <p className="text-gray-900 font-medium">{quotation.customer_name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Teléfono</label>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <p className="text-gray-900">{quotation.customer_phone}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Ciudad</label>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <p className="text-gray-900">{quotation.customer_city || 'No especificada'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sale Status */}
                    {isConverted && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <h2 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Venta Registrada
                            </h2>
                            <p className="text-sm text-purple-800">
                                Esta cotización ya fue convertida en un pedido oficial. Los ingresos han sido sumados a tu tienda.
                            </p>
                            {quotation.converted_to_order_id && (
                                <Link href={`/admin/pedidos/${quotation.converted_to_order_id}`}>
                                    <Button variant="link" className="text-purple-700 p-0 h-auto mt-2">
                                        Ver Pedido &rarr;
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
