'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks/useCart';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear, getTotal, getStoreGroups, updateQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    city: 'Samacá',
  });

  const supabase = createClient();
  const storeGroups = getStoreGroups();
  const storeCount = Object.keys(storeGroups).length;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  if (!mounted || checkingAuth) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  async function checkAuth() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Redirigir a login
      router.push(`/auth/login?returnTo=/carrito/checkout`);
      return;
    }

    setUser(user);

    // Pre-llenar datos si existen
    if (user.user_metadata?.full_name) {
      setCustomerData((prev) => ({
        ...prev,
        name: user.user_metadata.full_name,
      }));
    }

    setCheckingAuth(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!customerData.name || !customerData.phone) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/quotations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear cotizaciones');
      }

      // Limpiar carrito
      clear();

      // Redirigir a confirmación
      const quotationIds = data.quotations.map((q: any) => q.id).join(',');
      router.push(`/carrito/confirmacion?ids=${quotationIds}`);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error al crear cotizaciones');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">
            Agrega productos para poder cotizar
          </p>
          <Link href="/catalogo">
            <Button>Explorar Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-24">
      {/* Header */}
      <div className="mb-8">
        <Link href="/carrito">
          <Button variant="ghost" size="sm" className="mb-4 text-gray-700 hover:text-sky-600 hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al carrito
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Finalizar Cotización</h1>
        <p className="text-gray-600 mt-2">
          Completa tus datos para recibir la cotización
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Tus Datos</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">
                  Nombre Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, name: e.target.value })
                  }
                  placeholder="Juan Pérez"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">
                  Teléfono (WhatsApp) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, phone: e.target.value })
                  }
                  placeholder="312 310 6507"
                  required
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Las tiendas te contactarán por WhatsApp
                </p>
              </div>

              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={customerData.city}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, city: e.target.value })
                  }
                  placeholder="Samacá"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                📱 ¿Qué sucede después?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Se crearán {storeCount} {storeCount === 1 ? 'cotización' : 'cotizaciones'} separadas</li>
                <li>✅ Cada tienda recibirá solo sus productos</li>
                <li>✅ Te contactarán por WhatsApp</li>
                <li>✅ Podrás ver el estado en "Mis Cotizaciones"</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-sky-600 hover:bg-sky-700 text-white"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando cotizaciones...
                </>
              ) : (
                `Crear ${storeCount} ${storeCount === 1 ? 'Cotización' : 'Cotizaciones'}`
              )}
            </Button>
          </form>
        </div>

        {/* Resumen */}
        <div>
          <div className="bg-white border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumen</h2>

            {/* Por tienda */}
            <div className="space-y-4 mb-6">
              {Object.entries(storeGroups).map(([storeId, storeItems]) => {
                const store = storeItems[0].product.store;
                const storeTotal = storeItems.reduce(
                  (sum, item) => sum + item.product.price * item.quantity,
                  0
                );

                return (
                  <div key={storeId} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">{store?.name}</h3>
                    <div className="space-y-2">
                      {storeItems.map((item) => (
                        <div key={item.id} className="flex gap-3 text-sm py-2 border-b last:border-0">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded bg-gray-100">
                            {item.product.images?.[0] && (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <p className="font-medium truncate">
                                {item.product.name}
                              </p>
                              <p className="text-gray-600 text-xs">
                                {item.size && `Talla: ${item.size}`}
                                {item.size && item.color && ' • '}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 text-gray-700"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-medium text-gray-900 text-xs">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 text-gray-700"
                              >
                                +
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${(item.product.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${item.product.price.toLocaleString()} c/u
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between font-semibold">
                      <span>Subtotal</span>
                      <span>${storeTotal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">
                  ${getTotal().toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {storeCount} {storeCount === 1 ? 'cotización' : 'cotizaciones'} • {items.length} productos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
