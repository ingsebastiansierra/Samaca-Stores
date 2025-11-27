'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

interface ProductsGridProps {
  searchQuery?: string;
  category?: string;
  filters?: any;
}

export function ProductsGrid({ searchQuery = '', category = 'todos', filters = {} }: ProductsGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, category, filters]);

  const loadProducts = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // Timeout de 10 segundos para evitar bloqueos
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 10000)
      );

      let query = supabase
        .from('products')
        .select(`
          *,
          stores (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true);

      // Filtro de búsqueda
      if (searchQuery && searchQuery.length >= 2) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      // Filtros de precio
      if (filters.minPrice) {
        query = query.gte('price', Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', Number(filters.maxPrice));
      }

      // Ordenamiento
      switch (filters.sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      query = query.limit(20);

      // Ejecutar con timeout
      const { data, error } = await Promise.race([
        query,
        timeoutPromise
      ]) as any;

      if (error) throw error;

      const formattedProducts = data?.map(item => ({
        ...item,
        store: Array.isArray(item.stores) ? item.stores[0] : item.stores,
      })) || [];

      setProducts(formattedProducts);
    } catch (error: any) {
      console.error('Error loading products:', error);
      // Si es timeout, mostrar productos vacíos pero no bloquear
      if (error.message === 'Timeout') {
        console.warn('⚠️ Timeout al cargar productos, mostrando vacío');
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">
          {searchQuery
            ? `No se encontraron productos para "${searchQuery}"`
            : 'No hay productos disponibles'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Contador de resultados */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {products.length}{' '}
          {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </p>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-6 place-items-center">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
