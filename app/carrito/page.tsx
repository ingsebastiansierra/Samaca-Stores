'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks/useCart';
import { GroupedCart } from '@/components/cart/GroupedCart';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CarritoPage() {
  const router = useRouter();
  const { items } = useCart();

  function handleCheckout() {
    if (items.length === 0) return;
    router.push('/carrito/checkout');
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl min-h-screen pt-28">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link href="/catalogo">
          <Button variant="ghost" size="sm" className="mb-4 text-gray-700 hover:text-sky-600 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Seguir comprando
          </Button>
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Tu Carrito</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Revisa tus productos antes de cotizar
        </p>
      </div>

      {/* Cart */}
      <GroupedCart onCheckout={handleCheckout} />
    </div>
  );
}
