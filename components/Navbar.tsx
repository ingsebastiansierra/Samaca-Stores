'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Store, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/hooks/useCart';
import { UserMenu } from './auth/UserMenu';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);

  const { getItemCount } = useCart();
  const totalItems = mounted ? getItemCount() : 0;

  const pathname = usePathname();
  const isStorePage = pathname === '/tiendas';
  const isStoreDetail = pathname.startsWith('/tienda/');

  const navBackgroundClass =
    isStorePage || isStoreDetail
      ? 'bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg'
      : scrolled
        ? 'bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg'
        : 'bg-transparent';

  // Clase dinámica para el color del texto
  const textColorClass = (isStorePage || isStoreDetail || scrolled)
    ? 'text-gray-900'
    : 'text-white';

  const textHoverClass = (isStorePage || isStoreDetail || scrolled)
    ? 'hover:text-sky-600'
    : 'hover:text-sky-400';

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Ropa', slug: 'ropa' },
    { name: 'Jeans', slug: 'jeans' },
    { name: 'Camisetas', slug: 'camisetas' },
    { name: 'Accesorios', slug: 'accesorios' },
    { name: 'Personajes', slug: 'personajes' },
  ];

  const navLinks = [
    { href: '/', label: 'Inicio' },
    {
      label: 'Hombre',
      hasDropdown: true,
      categories: categories.map(cat => ({
        ...cat,
        href: `/catalogo?genero=hombre&categoria=${cat.slug}`
      }))
    },
    {
      label: 'Mujer',
      hasDropdown: true,
      categories: categories.map(cat => ({
        ...cat,
        href: `/catalogo?genero=mujer&categoria=${cat.slug}`
      }))
    },
    { href: '/tiendas', label: 'Tiendas' },
    { href: '/promociones', label: 'Ofertas' },
  ];

  return (
    <nav className={`fixed top-2 sm:top-4 left-0 right-0 z-50 transition-all duration-300 px-2 sm:px-4 md:px-8`}>
      <div className={`max-w-7xl mx-auto transition-all duration-300 ${navBackgroundClass}`}>
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-600 border border-sky-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Store className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-lg sm:text-2xl font-display font-bold text-gray-900 tracking-wider group-hover:text-sky-600 transition-colors">
                  SAMACÁ
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.label)}
                  onMouseLeave={() => link.hasDropdown && setOpenDropdown(null)}
                >
                  {link.hasDropdown ? (
                    <>
                      <button className={`flex items-center gap-1 ${textColorClass} ${textHoverClass} transition-colors font-medium text-sm tracking-wide group`}>
                        {link.label}
                        <ChevronDown className="w-4 h-4" />
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-600 group-hover:w-full transition-all duration-300" />
                      </button>

                      <AnimatePresence>
                        {openDropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                          >
                            {link.categories?.map((category) => (
                              <Link
                                key={category.slug}
                                href={category.href}
                                className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors group"
                              >
                                <span className="font-medium text-sm">{category.name}</span>
                                <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href || '#'}
                      prefetch={true}
                      className={`relative ${textColorClass} ${textHoverClass} transition-colors font-medium text-sm tracking-wide group`}
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-600 group-hover:w-full transition-all duration-300" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/carrito" className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-sky-600/30 cursor-pointer"
                >
                  <ShoppingCart className={`w-5 h-5 sm:w-6 sm:h-6 ${textColorClass} ${textHoverClass.replace('hover:', 'group-hover:')} transition-colors`} />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-md">
                      {totalItems}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* User Menu */}
              <div className="hidden md:block">
                <UserMenu />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900"
              >
                {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl rounded-b-2xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setMobileOpenDropdown(mobileOpenDropdown === link.label ? null : link.label)}
                          className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-sky-600 transition-colors font-medium tracking-wide"
                        >
                          {link.label}
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenDropdown === link.label ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {mobileOpenDropdown === link.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-2 mt-2"
                            >
                              {link.categories?.map((category) => (
                                <Link
                                  key={category.slug}
                                  href={category.href}
                                  onClick={() => {
                                    setIsOpen(false);
                                    setMobileOpenDropdown(null);
                                  }}
                                  className="block py-2 text-sm text-gray-600 hover:text-sky-600 transition-colors"
                                >
                                  {category.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href || '#'}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-gray-700 hover:text-sky-600 transition-colors font-medium tracking-wide"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* User Menu for Mobile */}
                <div className="pt-3 border-t border-gray-200">
                  <UserMenu isMobile={true} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
