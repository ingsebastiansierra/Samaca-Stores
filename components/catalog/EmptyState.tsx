'use client';

import { motion } from 'framer-motion';
import { Filter, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  type?: 'no-results' | 'no-products' | 'no-filters';
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function EmptyState({ 
  type = 'no-results', 
  onClearFilters,
  hasActiveFilters = false 
}: EmptyStateProps) {
  const content = {
    'no-results': {
      icon: Search,
      title: 'No encontramos productos',
      description: hasActiveFilters 
        ? 'Intenta ajustar los filtros o la búsqueda para ver más resultados.'
        : 'No hay productos que coincidan con tu búsqueda.',
      action: hasActiveFilters ? 'Limpiar filtros' : null
    },
    'no-products': {
      icon: Package,
      title: 'Aún no hay productos',
      description: 'Estamos trabajando para traerte los mejores productos. Vuelve pronto.',
      action: null
    },
    'no-filters': {
      icon: Filter,
      title: 'Selecciona tus preferencias',
      description: 'Usa los filtros para encontrar exactamente lo que buscas.',
      action: null
    }
  };

  const { icon: Icon, title, description, action } = content[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 bg-white rounded-3xl border-2 border-gray-200 shadow-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6"
      >
        <Icon className="w-10 h-10 text-gray-400" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">{description}</p>
      
      {action && onClearFilters && (
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="mx-auto"
        >
          {action}
        </Button>
      )}
    </motion.div>
  );
}
