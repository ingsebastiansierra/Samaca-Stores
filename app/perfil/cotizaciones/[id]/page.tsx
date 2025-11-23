'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import {
    ArrowLeft,
    Package,
    Store,
    Clock,
    CheckCircle,
    XCircle,
    MessageCircle,
    MapPin,
    Phone,
    User,
    Calendar
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface QuotationDetail {
    id: string;
    ticket: string;
    store_id: string;
    store_name: string;
    store_slug: string;
    store_whatsapp: string;
    store_address: string;
    store_city: string;
    items: any[];
    subtotal: number;
    total: number;
    status: string;
    created_at: string;
    customer_name: string;
    customer_phone: string;
    customer_city: string;
}

const STATUS_CONFIG = {
    pending: {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
    },
    contacted: {
        label: 'Respondida',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
    },
    negotiating: {
        label: 'En conversación',
        color: 'bg-blue-100 text-blue-800',
        icon: MessageCircle,
    },
    accepted: {
        label: 'Aceptada',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
    },
    converted: {
        label: 'Convertida en pedido',
        color: 'bg-purple-100 text-purple-800',
        icon: Package,
    },
    cancelled: {
        label: 'Cancelada',
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
    },
    expired: {
        label: 'Expirada',
        color: 'bg-gray-100 text-gray-800',
        icon: Clock,
    },
};

export default function QuotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [quotation, setQuotation] = useState<QuotationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        loadQuotation();
    }, [params.id]);

    async function loadQuotation() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

            const { data, error } = await supabase
                .from('quotations_with_store')
                .select('*')
                .eq('id', params.id)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            setQuotation(data);
        } catch (error) {
            console.error('Error loading quotation:', error);
            router.push('/perfil/cotizaciones');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 pt-24">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 h-64 bg-gray-200 rounded"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!quotation) return null;

    const statusConfig = STATUS_CONFIG[quotation.status as keyof typeof STATUS_CONFIG];
    const StatusIcon = statusConfig?.icon || Clock;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl pt-24">
            {/* Header */}
            <div className="mb-8">
                <Link href="/perfil/cotizaciones">
                    <Button variant="ghost" size="sm" className="mb-4 text-gray-700 hover:text-sky-600">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a mis cotizaciones
                    </Button>
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Cotización {quotation.ticket}
                            </h1>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig?.color}`}>
                                <StatusIcon className="h-4 w-4" />
                                {statusConfig?.label}
                            </span>
                        </div>
                        <p className="text-gray-600 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(quotation.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                        </p>
                    </div>

                    {quotation.store_whatsapp && (
                        <a
                            href={`https://wa.me/${quotation.store_whatsapp}?text=Hola, consulto por la cotización ${quotation.ticket}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button className="bg-green-600 hover:bg-green-700 w-full md:w-auto">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contactar Tienda
                            </Button>
                        </a>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Products */}
                    <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Productos Cotizados
                            </h2>
                        </div>
                        <div className="divide-y">
                            {quotation.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 flex gap-4">
                                    <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                        {item.image_url ? (
                                            <Image
                                                src={item.image_url}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <div className="mt-1 text-sm text-gray-500 space-y-1">
                                            {item.size && <p>Talla: {item.size}</p>}
                                            {item.color && <p>Color: {item.color}</p>}
                                            <p>Cantidad: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ${item.price.toLocaleString()} c/u
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total Estimado</span>
                            <span className="text-xl font-bold text-gray-900">
                                ${quotation.total.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Store Info */}
                    <div className="bg-white border rounded-lg p-6">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Store className="h-5 w-5" />
                            Información de la Tienda
                        </h2>
                        <div className="space-y-3">
                            <p className="font-medium text-lg">{quotation.store_name}</p>
                            {quotation.store_address && (
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{quotation.store_address}, {quotation.store_city}</span>
                                </div>
                            )}
                            <Link href={`/tienda/${quotation.store_slug}`}>
                                <Button variant="outline" className="w-full mt-4" size="sm">
                                    Ver Perfil de Tienda
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white border rounded-lg p-6">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Tus Datos
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-900">{quotation.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-900">{quotation.customer_phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-900">{quotation.customer_city}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
