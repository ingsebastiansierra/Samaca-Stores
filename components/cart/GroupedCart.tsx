'use client';

import { useMemo, useState, useEffect } from 'react';
import { useCart, type CartItem } from '@/lib/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Store, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface GroupedCartProps {
  onCheckout: () => void;
}

export function GroupedCart({ onCheckout }: GroupedCartProps) {
  const { items, removeItem, updateQuantity, getTotal, getStoreGroups } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const groupedByStore = getStoreGroups();
  const total = getTotal();
  const storeCount = Object.keys(groupedByStore).length;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Tu carrito está vacío</h3>
        <p className="mt-2 text-sm text-gray-600">
          Agrega productos para comenzar a cotizar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen superior */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-sky-900">
              Productos de <strong>{storeCount}</strong> {storeCount === 1 ? 'tienda' : 'tiendas'}
            </p>
            <p className="text-xs text-sky-700 mt-1">
              Se crearán {storeCount} {storeCount === 1 ? 'cotización' : 'cotizaciones'} separadas
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-sky-900">
              ${total.toLocaleString()}
            </p>
            <p className="text-xs text-sky-700">Total</p>
          </div>
        </div>
      </div>

      {/* Productos agrupados por tienda */}
      {Object.entries(groupedByStore).map(([storeId, storeItems]) => {
        const store = storeItems[0]?.product?.store;
        const storeTotal = storeItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        return (
          <div key={storeId} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Header de tienda */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <Store className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{store?.name || 'Tienda'}</h3>
                <p className="text-sm text-gray-600">
                  {storeItems.length} {storeItems.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ${storeTotal.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Subtotal</p>
              </div>
            </div>

            {/* Productos de esta tienda */}
            <div className="divide-y divide-gray-200">
              {storeItems.map((item) => (
                <div key={item.id} className="p-4 flex gap-4 bg-white hover:bg-gray-50 transition-colors">
                  {/* Imagen */}
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h4>

                    {/* Variantes */}
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
                      {item.size && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                          Talla: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                          Color: {item.color}
                        </span>
                      )}
                    </div>

                    {/* Precio y cantidad */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="h-7 w-7 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          ${item.product.price.toLocaleString()} c/u
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600 p-2 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Botón de cotizar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 shadow-lg">
        <Button
          onClick={onCheckout}
          className="w-full h-12 text-lg bg-sky-600 text-white hover:bg-sky-700"
          size="lg"
        >
          Cotizar Todo (${total.toLocaleString()})
        </Button>
        <p className="text-center text-xs text-gray-600 mt-2">
          Se crearán {storeCount} {storeCount === 1 ? 'cotización' : 'cotizaciones'} separadas por tienda
        </p>
      </div>
    </div>
  );
}
