'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/Button'
import { generateTicket } from '@/lib/utils/ticket-generator'
import { createWhatsAppLink, createOrderMessage } from '@/lib/utils/whatsapp'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    setIsProcessing(true)

    try {
      const ticket = generateTicket()

      // Here you would save to Supabase
      // await createOrder({ ticket, ...formData, items, total: getTotalPrice() })

      // Create WhatsApp message
      const firstItem = items[0]
      const message = createOrderMessage({
        ticket,
        productName: items.length > 1
          ? `${firstItem.product.name} y ${items.length - 1} más`
          : firstItem.product.name,
        size: firstItem.size,
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        total: getTotalPrice()
      })

      // Open WhatsApp
      window.open(createWhatsAppLink(message), '_blank')

      // Clear cart and redirect
      clearCart()
      toast.success('¡Pedido creado exitosamente!')

      setTimeout(() => {
        router.push(`/pedido/${ticket}`)
      }, 1000)
    } catch (error) {
      toast.error('Error al procesar el pedido')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    router.push('/carrito')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Finalizar Pedido</h1>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">Información de Contacto</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 text-base"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 text-base"
                  placeholder="300 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 text-base"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-base font-semibold bg-sky-600 hover:bg-sky-700"
                isLoading={isProcessing}
              >
                Confirmar Pedido por WhatsApp
              </Button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">Resumen del Pedido</h2>

            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 whitespace-nowrap">
                    ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-lg sm:text-xl font-bold mb-4">
                <span>Total</span>
                <span className="text-sky-600">
                  ${getTotalPrice().toLocaleString('es-CO')}
                </span>
              </div>

              <div className="bg-sky-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-sky-800 dark:text-blue-300 leading-relaxed">
                  📱 Al confirmar, se abrirá WhatsApp con tu pedido pre-cargado.
                  Recibirás un ticket único para hacer seguimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
