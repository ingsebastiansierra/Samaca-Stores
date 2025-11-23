import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-sky-600 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-4 tracking-wider">
              SAMACÁ <span className="text-sky-600">STORE</span>
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              El futuro de la moda en Samacá. Tecnología y estilo fusionados en una experiencia única.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4 tracking-wide">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogo" className="text-gray-600 hover:text-sky-600 transition-colors">Catálogo</Link></li>
              <li><Link href="/promociones" className="text-gray-600 hover:text-sky-600 transition-colors">Promociones</Link></li>
              <li><Link href="/carrito" className="text-gray-600 hover:text-sky-600 transition-colors">Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4 tracking-wide">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                <MapPin className="w-4 h-4 text-sky-600" />
                Samacá, Boyacá
              </li>
              <li className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                <Phone className="w-4 h-4 text-sky-600" />
                +57 300 123 4567
              </li>
              <li className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                <Mail className="w-4 h-4 text-sky-600" />
                info@samacastore.com
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4 tracking-wide">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-sky-600 hover:text-white transition-all duration-300 group">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-sky-600 hover:text-white transition-all duration-300 group">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-sm text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Samacá Store. Designed for the Future.</p>
        </div>
      </div>
    </footer>
  )
}
