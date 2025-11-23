'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Store, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  Eye,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Quotation {
  id: string;
  ticket: string;
  store_id: string;
  store_name: string;
  store_slug: string;
  store_whatsapp: string;
  items: any[];
  total: number;
  status: string;
  created_at: string;
  whatsapp_sent_at: string | null;
  store_responded_at: string | null;
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

export default function MisCotizacionesPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const supabase = createClient();

  useEffect(() => {
    loadQuotations();
  }, []);

  async function loadQuotations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('quotations_with_store')
        .select('*')
        .eq('user_id', user.id)
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
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const stats = {
    total: quotations.length,
    pending: quotations.filter(q => q.status === 'pending').length,
    responded: quotations.filter(q => q.status === 'contacted' || q.status === 'negotiating').length,
    converted: quotations.filter(q => q.status === 'converted').length,
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Cotizaciones</h1>
        <p className="text-gray-600">
          Seguimiento de todas tus cotizaciones y su estado
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
          <p className="text-sm text-yellow-700">Pendientes</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-900">{stats.responded}</p>
          <p className="text-sm text-green-700">Respondidas</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-purple-900">{stats.converted}</p>
          <p className="text-sm text-purple-700">Convertidas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todas ({quotations.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pendientes ({stats.pending})
        </Button>
        <Button
          variant={filter === 'contacted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('contacted')}
        >
          Respondidas ({stats.responded})
        </Button>
        <Button
          variant={filter === 'converted' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('converted')}
        >
          Convertidas ({stats.converted})
        </Button>
      </div>

      {/* Quotations List */}
      {filteredQuotations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No hay cotizaciones
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {filter === 'all' 
              ? 'Aún no has creado ninguna cotización'
              : `No hay cotizaciones con estado "${STATUS_CONFIG[filter as keyof typeof STATUS_CONFIG]?.label}"`
            }
          </p>
          <Link href="/catalogo">
            <Button className="mt-4">
              Explorar Catálogo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotations.map((quotation) => {
            const statusConfig = STATUS_CONFIG[quotation.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = statusConfig?.icon || Clock;

            return (
              <div
                key={quotation.id}
                className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-gray-600" />
                      <h3 className="font-bold text-lg">{quotation.ticket}</h3>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(quotation.ticket);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Store className="h-4 w-4" />
                      <span>{quotation.store_name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${quotation.total.toLocaleString()}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig?.label}
                    </span>
                  </div>
                </div>

                {/* Products Preview */}
                <div className="mb-4 text-sm text-gray-600">
                  <p className="font-medium mb-1">Productos:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {quotation.items.slice(0, 3).map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.name} {item.size && `(${item.size})`} x{item.quantity}
                      </li>
                    ))}
                    {quotation.items.length > 3 && (
                      <li className="text-gray-500">
                        +{quotation.items.length - 3} más...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="mb-4 text-xs text-gray-500 space-y-1">
                  <p>
                    📅 Creada {formatDistanceToNow(new Date(quotation.created_at), { 
                      addSuffix: true,
                      locale: es 
                    })}
                  </p>
                  {quotation.whatsapp_sent_at && (
                    <p>
                      📱 WhatsApp enviado {formatDistanceToNow(new Date(quotation.whatsapp_sent_at), { 
                        addSuffix: true,
                        locale: es 
                      })}
                    </p>
                  )}
                  {quotation.store_responded_at && (
                    <p>
                      💬 Tienda respondió {formatDistanceToNow(new Date(quotation.store_responded_at), { 
                        addSuffix: true,
                        locale: es 
                      })}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/perfil/cotizaciones/${quotation.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </Link>
                  
                  {quotation.store_whatsapp && (
                    <a
                      href={`https://wa.me/${quotation.store_whatsapp}?text=Hola, consulto por la cotización ${quotation.ticket}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
