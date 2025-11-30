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
    Loader2,
    FileEdit,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { QuotationResponseForm } from '@/components/admin/quotations/QuotationResponseForm';

export default function AdminQuotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [quotation, setQuotation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [converting, setConverting] = useState(false);
    const [showResponseForm, setShowResponseForm] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        loadQuotation();
    }, []);

    async function loadQuotation() {
        try {
            const { data, error } = await supabase
                .from('quotations')
                .select(`
                    *,
                    quotation_responses (
                        id,
                        items,
                        original_total,
                        adjusted_total,
                        total_discount,
                        discount_percentage,
                        notes,
                        valid_until_days,
                        valid_until_date,
                        created_at
                    )
                `)
                .eq('id', params.id)
                .single();

            if (error) throw error;

            // Ordenar respuestas por fecha descendente (la más reciente primero)
            if (data.quotation_responses && Array.isArray(data.quotation_responses)) {
                data.quotation_responses.sort((a: any, b: any) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
            }

            console.log('📊 Cotización cargada:', data);
            console.log('📋 Respuestas ordenadas:', data?.quotation_responses);

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
            console.log('Converting quotation:', quotation.id);

            const response = await fetch('/api/quotations/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quotationId: quotation.id }),
            });

            const data = await response.json();
            console.log('Conversion response:', data);

            if (!response.ok) throw new Error(data.error || 'Error al convertir venta');

            toast.success('¡Venta cerrada exitosamente! 🎉');

            // Esperar un momento antes de recargar para asegurar que la BD se actualizó
            await new Promise(resolve => setTimeout(resolve, 500));
            await loadQuotation(); // Recargar datos

            console.log('Quotation reloaded, new status:', quotation.status);
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

    // Normalizar respuestas a array (por si Supabase devuelve objeto único debido a restricción UNIQUE)
    const responses = Array.isArray(quotation.quotation_responses)
        ? quotation.quotation_responses
        : quotation.quotation_responses
            ? [quotation.quotation_responses]
            : [];

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto pt-20 md:pt-6">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <Link href="/admin/cotizaciones">
                    <Button variant="ghost" size="sm" className="mb-4 text-gray-600">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                </Link>

                <div className="flex flex-col gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                                Cotización {quotation.ticket}
                            </h1>
                            <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${isConverted ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {isConverted ? 'Venta Cerrada' : 'Pendiente'}
                            </span>
                        </div>
                        <p className="text-sm md:text-base text-gray-500">
                            Creada el {format(new Date(quotation.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                    </div>

                    {/* Botones - Stack en móvil, fila en desktop */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {!isConverted && (
                            <Button
                                onClick={() => setShowResponseForm(true)}
                                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white"
                            >
                                <FileEdit className="h-4 w-4 mr-2" />
                                Responder Cotización
                            </Button>
                        )}

                        <a
                            href={`https://wa.me/${quotation.customer_phone}?text=Hola ${quotation.customer_name}, te escribo sobre tu cotización ${quotation.ticket}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto"
                        >
                            <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                WhatsApp Simple
                            </Button>
                        </a>

                        {!isConverted && (
                            <Button
                                onClick={handleCloseSale}
                                disabled={converting}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
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

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Products */}
                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Productos ({quotation.items.length})
                            </h2>
                        </div>
                        <div className="divide-y">
                            {(responses && responses.length > 0
                                ? responses[0].items
                                : quotation.items
                            ).map((item: any, idx: number) => {
                                const hasResponse = responses && responses.length > 0
                                const hasDiscount = hasResponse && item.discount > 0

                                return (
                                    <div key={idx} className="p-4 flex gap-3 md:gap-4">
                                        <div className="relative h-14 w-14 md:h-16 md:w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
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
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">{item.name}</h3>
                                            <div className="text-xs md:text-sm text-gray-500">
                                                {item.size && <span>Talla: {item.size} • </span>}
                                                {item.color && <span>Color: {item.color}</span>}
                                            </div>
                                            {hasDiscount && (
                                                <div className="mt-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        {item.discount}% OFF
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            {hasDiscount ? (
                                                <>
                                                    <p className="text-xs text-gray-400 line-through">
                                                        ${(item.originalPrice * item.quantity).toLocaleString()}
                                                    </p>
                                                    <p className="font-bold text-green-600 text-sm md:text-base">
                                                        ${(item.adjustedPrice * item.quantity).toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.quantity} x ${item.adjustedPrice.toLocaleString()}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-medium text-gray-900 text-sm md:text-base">
                                                        ${((hasResponse ? item.adjustedPrice : item.price) * item.quantity).toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.quantity} x ${(hasResponse ? item.adjustedPrice : item.price).toLocaleString()}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="p-4 bg-gray-50 border-t">
                            {responses && responses.length > 0 ? (
                                <div className="space-y-2">
                                    {responses[0].total_discount > 0 && (
                                        <>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Subtotal Original:</span>
                                                <span className="text-gray-600">${responses[0].original_total.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-green-600">Descuento ({responses[0].discount_percentage}%):</span>
                                                <span className="text-green-600">-${responses[0].total_discount.toLocaleString()}</span>
                                            </div>
                                            <div className="border-t pt-2"></div>
                                        </>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Total Cotizado (Última Respuesta)</span>
                                        <span className="text-lg md:text-xl font-bold text-green-700">
                                            ${responses[0].adjusted_total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">Total Venta</span>
                                    <span className="text-lg md:text-xl font-bold text-green-700">
                                        ${quotation.total.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Historial de Respuestas Integrado */}
                        {responses && responses.length > 0 && (
                            <div className="border-t-4 border-green-50">
                                <div className="p-4 bg-green-50/50 border-b border-green-100">
                                    <h2 className="font-semibold text-green-900 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        Historial de Respuestas ({responses.length})
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {responses.map((response: any, idx: number) => (
                                        <div key={response.id} className="p-4 md:p-6 bg-white hover:bg-gray-50 transition-colors">
                                            {/* Header de la respuesta */}
                                            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                                                        #{responses.length - idx}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(response.created_at).toLocaleDateString('es-CO', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    <Clock className="h-3 w-3" />
                                                    <span>Vence: {new Date(response.valid_until_date).toLocaleDateString('es-CO')}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pl-0 md:pl-4 border-l-2 border-green-100">
                                                {/* Productos de esta respuesta */}
                                                <div className="space-y-2">
                                                    {response.items.map((item: any, itemIdx: number) => (
                                                        <div key={itemIdx} className="flex justify-between items-center text-sm">
                                                            <div className="flex-1">
                                                                <span className="font-medium text-gray-900">{item.quantity}x {item.name}</span>
                                                                {(item.size || item.color) && (
                                                                    <span className="text-gray-500 ml-2 text-xs">
                                                                        ({[item.size, item.color].filter(Boolean).join(' / ')})
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                {item.discount > 0 ? (
                                                                    <div className="flex flex-col items-end">
                                                                        <span className="text-xs text-gray-400 line-through">${(item.originalPrice * item.quantity).toLocaleString()}</span>
                                                                        <span className="font-bold text-green-600">${(item.adjustedPrice * item.quantity).toLocaleString()}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="font-medium text-gray-900">${(item.adjustedPrice * item.quantity).toLocaleString()}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Resumen de esta respuesta */}
                                                <div className="bg-gray-50 rounded p-3 text-sm flex justify-between items-center">
                                                    <span className="text-gray-600">Total Respuesta:</span>
                                                    <span className="font-bold text-green-700 text-lg">
                                                        ${response.adjusted_total.toLocaleString()}
                                                    </span>
                                                </div>

                                                {/* Notas */}
                                                {response.notes && (
                                                    <div className="text-sm text-blue-800 bg-blue-50 p-3 rounded border border-blue-100">
                                                        <span className="font-semibold">Nota:</span> {response.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white border rounded-lg p-4 md:p-6 shadow-sm">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Datos del Cliente
                        </h2>
                        <div className="space-y-3 md:space-y-4">
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
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 md:p-6">
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

            {/* Response Form Modal */}
            {showResponseForm && (
                <QuotationResponseForm
                    quotation={quotation}
                    onClose={() => setShowResponseForm(false)}
                    onSuccess={() => {
                        setShowResponseForm(false)
                        toast.success('Respuesta actualizada correctamente')
                        loadQuotation()
                        router.refresh()
                    }}
                />
            )}
        </div>
    );
}
