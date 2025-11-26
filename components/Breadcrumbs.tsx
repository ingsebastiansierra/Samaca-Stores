'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { createContext, useContext, ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbContextType {
  customBreadcrumbs?: BreadcrumbItem[];
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({});

export function BreadcrumbProvider({ children, customBreadcrumbs }: { children: ReactNode; customBreadcrumbs?: BreadcrumbItem[] }) {
  return (
    <BreadcrumbContext.Provider value={{ customBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { customBreadcrumbs } = useContext(BreadcrumbContext);

  // No mostrar breadcrumbs en la página de inicio
  if (pathname === '/') return null;

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' }
    ];

    // Obtener parámetros de búsqueda
    const genero = searchParams.get('genero');
    const categoria = searchParams.get('categoria');

    // Mapeo de categorías
    const categoryMap: Record<string, string> = {
      'ropa': 'Ropa',
      'jeans': 'Jeans',
      'camisetas': 'Camisetas',
      'accesorios': 'Accesorios',
      'personajes': 'Personajes'
    };

    // Mapeo de géneros
    const genderMap: Record<string, string> = {
      'hombre': 'Hombre',
      'mujer': 'Mujer'
    };

    // Si hay breadcrumbs personalizados, usarlos
    if (customBreadcrumbs && customBreadcrumbs.length > 0) {
      return [...breadcrumbs, ...customBreadcrumbs];
    }

    // Rutas específicas
    if (pathname.startsWith('/catalogo')) {
      if (genero && genderMap[genero]) {
        breadcrumbs.push({
          label: genderMap[genero],
          href: `/catalogo?genero=${genero}`
        });

        if (categoria && categoryMap[categoria]) {
          breadcrumbs.push({
            label: `${categoryMap[categoria]} ${genderMap[genero].toLowerCase()}`,
            href: `/catalogo?genero=${genero}&categoria=${categoria}`
          });
        }
      } else {
        breadcrumbs.push({
          label: 'Productos',
          href: '/catalogo'
        });
      }
    } else if (pathname.startsWith('/producto/')) {
      breadcrumbs.push({
        label: 'Productos',
        href: '/catalogo'
      });
      // El nombre del producto se puede agregar dinámicamente
      const productName = searchParams.get('name');
      if (productName) {
        breadcrumbs.push({
          label: productName,
          href: pathname
        });
      }
    } else if (pathname.startsWith('/tienda/')) {
      breadcrumbs.push({
        label: 'Tiendas',
        href: '/tiendas'
      });
      const storeName = searchParams.get('name');
      if (storeName) {
        breadcrumbs.push({
          label: storeName,
          href: pathname
        });
      }
    } else if (pathname === '/tiendas') {
      breadcrumbs.push({
        label: 'Tiendas',
        href: '/tiendas'
      });
    } else if (pathname === '/carrito') {
      breadcrumbs.push({
        label: 'Carrito',
        href: '/carrito'
      });
    } else if (pathname === '/promociones') {
      breadcrumbs.push({
        label: 'Ofertas',
        href: '/promociones'
      });
    } else if (pathname.startsWith('/perfil')) {
      breadcrumbs.push({
        label: 'Mi Perfil',
        href: '/perfil'
      });
    } else if (pathname.startsWith('/checkout')) {
      breadcrumbs.push({
        label: 'Checkout',
        href: '/checkout'
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-[84px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <li key={`${crumb.href}-${index}`} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                )}
                
                {isLast ? (
                  <span className="text-gray-900 font-medium truncate max-w-[200px]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-1.5 group"
                  >
                    {index === 0 && <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    <span className="hover:underline">{crumb.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
