'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle, Eye, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Quotation {
  id: string;
  ticket: string;
  store_id: string;
  store_name: string;
  store_slug: string;
  store_whatsapp: string;
  items: any[];
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  created_at: string;
}

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length > 0) {
      loadQuotations();
    }
  }, []);

  async function loadQuotations() {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('quotations_with_store')
        .select('*')
        .in('id', ids);

      if (error) throw error;

      setQuotations(data || []);
    } catch (error) {
      console.error('Error loading quotations:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateWhatsAppMessage(quotation: Quotation) {
    let message = `¡Hola! 👋 Soy ${quotation.customer_name}\n\n`;
    message += `Me interesa cotizar estos productos de ${quotation.store_name}:\n\n`;
    message += `📦 COTIZACIÓN ${quotation.ticket}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    quotation.items.forEach((item: any) => {
      message += `${item.name}\n`;
      if (item.size) message += `   Talla: ${item.size}`;
      if (item.color) message += ` | Color: ${item.color}`;
      if (item.size || item.color) message += '\n';
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: $${item.price.toLocaleString()} c/u\n`;
      message += `   Subtotal: $${item.subtotal.toLocaleString()}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 TOTAL: $${quotation.total.toLocaleString()}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📍 Entrega en: ${quotation.customer_city}\n`;
    message += `📱 Teléfono: ${quotation.customer_phone}\n\n`;
    message += `¿Podrías confirmar disponibilidad y forma de pago? 😊`;

    return encodeURIComponent(message);
  }

  async function handleWhatsAppClick(quotation: Quotation) {
    // Registrar que se envió WhatsApp
    const supabase = createClient();

    await supabase
      .from('quotations')
      .update({ whatsapp_sent_at: new Date().toISOString() })
      .eq('id', quotation.id);

    await supabase.from('quotation_events').insert({
      quotation_id: quotation.id,
      event_type: 'whatsapp_sent',
      event_data: { timestamp: new Date().toISOString() },
    });
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (quotations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">No se encontraron cotizaciones</h2>
          <Link href="/catalogo">
            <Button>Ir al Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">¡Cotizaciones Creadas!</h1>
        <p className="text-gray-600">
          Se {quotations.length === 1 ? 'creó' : 'crearon'}{' '}
          <strong>{quotations.length}</strong>{' '}
          {quotations.length === 1 ? 'cotización' : 'cotizaciones'} exitosamente
        </p>
      </div>

      {/* Quotations */}
      <div className="space-y-6 mb-8">
        {quotations.map((quotation, index) => (
          <div key={quotation.id} className="border rounded-lg p-6 bg-white">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-lg">{quotation.ticket}</h3>
                </div>
                <p className="text-gray-600">{quotation.store_name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${quotation.total.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {quotation.items.length} productos
                </p>
              </div>
            </div>

            {/* Products Preview */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Productos:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {quotation.items.slice(0, 3).map((item: any, idx: number) => (
                  <li key={idx}>
                    • {item.name}
                    {item.size && ` (${item.size})`} x{item.quantity}
                  </li>
                ))}
                {quotation.items.length > 3 && (
                  <li className="text-gray-500 italic">
                    +{quotation.items.length - 3} productos más...
                  </li>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <a
                href={`https://wa.me/57${quotation.store_whatsapp?.replace(/\D/g, '')}?text=${generateWhatsAppMessage(quotation)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleWhatsAppClick(quotation)}
                className="flex-1"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Abrir WhatsApp
                </Button>
              </a>

              <Link href={`/perfil/cotizaciones/${quotation.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">💡 Próximos pasos:</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Haz click en "Abrir WhatsApp" para cada tienda</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>El mensaje ya está listo, solo presiona enviar</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>Cada tienda te responderá por separado</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            <span>Puedes ver el estado en "Mis Cotizaciones"</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Link href="/perfil/cotizaciones">
          <Button variant="outline" size="lg">
            Ver Todas Mis Cotizaciones
          </Button>
        </Link>
        <Link href="/catalogo">
          <Button size="lg">Seguir Comprando</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <ConfirmacionContent />
    </Suspense>
  );
}
