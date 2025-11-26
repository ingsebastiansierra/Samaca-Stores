'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FilterOption {
  label: string;
  value: string;
  image?: string;
  count?: number;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  availableSizes?: string[];
  availableSubtypes?: FilterOption[];
  gender?: 'hombre' | 'mujer';
  productType?: string;
}

export interface FilterState {
  gender?: string;
  productType?: string;
  productSubtype?: string;
  size?: string;
  priceRange?: [number, number];
  colors?: string[];
  brands?: string[];
}

export function ProductFilters({
  onFilterChange,
  availableSizes = [],
  availableSubtypes = [],
  gender,
  productType
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    gender,
    productType
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['subtype', 'size'])
  );

  // Subtipos de jeans según género
  const jeanSubtypes: Record<string, FilterOption[]> = {
    mujer: [
      { label: 'Ver todo', value: 'ver-todo' },
      { label: 'Super tiro alto', value: 'super-tiro-alto' },
      { label: 'Baggy', value: 'baggy' },
      { label: 'Straight leg', value: 'straight-leg' },
      { label: 'Mom fit', value: 'mom-fit' },
      { label: "90's fit", value: '90s-fit' },
      { label: 'Boyfriend', value: 'boyfriend' },
      { label: 'Push up', value: 'push-up' },
      { label: 'Tendencia', value: 'tendencia' },
      { label: 'Skinny', value: 'skinny' },
      { label: 'Flare', value: 'flare' },
      { label: 'Wide leg', value: 'wide-leg' },
    ],
    hombre: [
      { label: 'Ver todo', value: 'ver-todo' },
      { label: 'Slim fit', value: 'slim-fit' },
      { label: 'Regular fit', value: 'regular-fit' },
      { label: 'Relaxed fit', value: 'relaxed-fit' },
      { label: 'Straight', value: 'straight' },
      { label: 'Skinny', value: 'skinny' },
      { label: 'Baggy', value: 'baggy' },
      { label: 'Carpenter', value: 'carpenter' },
    ]
  };

  const subtypes = availableSubtypes.length > 0
    ? availableSubtypes
    : (gender && productType === 'jeans' ? jeanSubtypes[gender] : []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters: FilterState = { gender, productType };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFilterCount = Object.keys(filters).filter(
    key => filters[key as keyof FilterState] && !['gender', 'productType'].includes(key)
  ).length;

  return (
    <div className="w-full">
      <FilterContent
        filters={filters}
        subtypes={subtypes}
        availableSizes={availableSizes}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
        isMobile={false}
      />
    </div>
  );
}

interface FilterContentProps {
  filters: FilterState;
  subtypes: FilterOption[];
  availableSizes: string[];
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
  updateFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  isMobile?: boolean;
}

function FilterContent({
  filters,
  subtypes,
  availableSizes,
  expandedSections,
  toggleSection,
  updateFilter,
  clearFilters,
  activeFilterCount,
  isMobile = false
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Header - Solo en desktop */}
      {!isMobile && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-sky-600 hover:text-sky-700 font-medium"
            >
              Limpiar todo
            </button>
          )}
        </div>
      )}

      {/* Limpiar filtros en móvil */}
      {isMobile && activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Limpiar todos los filtros
        </button>
      )}

      {/* Tipo de prenda (Subtipos) */}
      {subtypes.length > 0 && (
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection('subtype')}
            className="flex items-center justify-between w-full mb-4 group"
          >
            <span className="font-bold text-gray-900 text-base">Tipo de prenda</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.has('subtype') ? 'rotate-180' : ''
                }`}
            />
          </button>

          <AnimatePresence>
            {expandedSections.has('subtype') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-2 gap-2.5"
              >
                {subtypes.map((subtype) => (
                  <button
                    key={subtype.value}
                    onClick={() => updateFilter('productSubtype',
                      filters.productSubtype === subtype.value ? undefined : subtype.value
                    )}
                    className={`p-3.5 rounded-xl border-2 text-sm font-semibold transition-all ${filters.productSubtype === subtype.value
                      ? 'border-sky-600 bg-sky-600 text-white shadow-md scale-105'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {subtype.label}
                    {subtype.count && (
                      <span className="ml-1 text-xs opacity-70">
                        ({subtype.count})
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Tallas */}
      {availableSizes.length > 0 && (
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection('size')}
            className="flex items-center justify-between w-full mb-4 group"
          >
            <span className="font-bold text-gray-900 text-base">Talla</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform ${expandedSections.has('size') ? 'rotate-180' : ''
                }`}
            />
          </button>

          <AnimatePresence>
            {expandedSections.has('size') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-4 gap-2.5"
              >
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => updateFilter('size',
                      filters.size === size ? undefined : size
                    )}
                    className={`h-14 rounded-xl border-2 text-sm font-bold transition-all ${filters.size === size
                      ? 'border-sky-600 bg-sky-600 text-white shadow-md scale-105'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-700 mb-3">Filtros activos:</p>
          <div className="flex flex-wrap gap-2">
            {filters.productSubtype && (
              <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-medium flex items-center gap-2">
                {subtypes.find(s => s.value === filters.productSubtype)?.label}
                <button
                  onClick={() => updateFilter('productSubtype', undefined)}
                  className="hover:bg-sky-200 rounded-full p-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {filters.size && (
              <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-medium flex items-center gap-2">
                Talla {filters.size}
                <button
                  onClick={() => updateFilter('size', undefined)}
                  className="hover:bg-sky-200 rounded-full p-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
