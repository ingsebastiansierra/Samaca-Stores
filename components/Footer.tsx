import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Samacá Store</h3>
            <p className="text-sm">
              Tu tienda de confianza en Samacá, Boyacá. Ropa, zapatos y accesorios de calidad.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/promociones" className="hover:text-white transition-colors">Promociones</Link></li>
              <li><Link href="/carrito" className="hover:text-white transition-colors">Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Samacá, Boyacá
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +57 300 123 4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@samacastore.com
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Samacá Store. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
