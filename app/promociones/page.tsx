'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dice1, Clock, Sparkles, Package, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import toast from 'react-hot-toast'

export default function PromocionesPage() {
  const [diceDiscount, setDiceDiscount] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    setIsRolling(true)
    setTimeout(() => {
      const discount = Math.floor(Math.random() * 21) + 5 // 5% - 25%
      setDiceDiscount(discount)
      setIsRolling(false)
      toast.success(`¡Ganaste ${discount}% de descuento!`)
    }, 2000)
  }

  const currentHour = new Date().getHours()
  const isHappyHour = currentHour >= 16 && currentHour < 18

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
          🎁 Promociones Especiales
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Aprovecha nuestras ofertas exclusivas y ahorra en grande
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* El Dado de la Suerte */}
        <Card className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Dice1 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">🎲 El Dado de la Suerte</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Presiona el botón y obtén un descuento aleatorio entre 5% y 25%
          </p>
          
          {diceDiscount && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <div className="text-6xl font-bold text-primary-600 mb-2">
                {diceDiscount}%
              </div>
              <Badge variant="success" className="text-lg px-4 py-2">
                ¡Tu descuento!
              </Badge>
            </motion.div>
          )}

          <Button
            size="lg"
            onClick={rollDice}
            isLoading={isRolling}
            disabled={isRolling}
            className="w-full"
          >
            {isRolling ? 'Girando...' : diceDiscount ? 'Volver a Girar' : 'Girar el Dado'}
          </Button>
        </Card>

        {/* Happy Hour */}
        <Card className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">⏰ Happy Hour de Moda</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            De 4:00 PM a 6:00 PM - 15% de descuento en productos seleccionados
          </p>

          {isHappyHour ? (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Badge variant="success" className="text-lg px-4 py-2 mb-4">
                🔥 ¡ACTIVO AHORA!
              </Badge>
              <p className="text-primary-600 font-bold">
                15% OFF en productos seleccionados
              </p>
            </motion.div>
          ) : (
            <div>
              <Badge variant="warning" className="text-lg px-4 py-2 mb-4">
                Próximamente
              </Badge>
              <p className="text-gray-600 dark:text-gray-400">
                Vuelve entre 4:00 PM y 6:00 PM
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Otras Promociones */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center hover:shadow-xl transition-shadow">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-xl font-bold mb-2">Combo Outfit</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Compra 2 o más productos que combinen y obtén 10% de descuento
          </p>
          <Badge variant="info">Activo</Badge>
        </Card>

        <Card className="p-6 text-center hover:shadow-xl transition-shadow">
          <Package className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">⏳ Últimas Unidades</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Productos con stock limitado (≤3 unidades) con descuento especial
          </p>
          <Badge variant="danger">¡Apúrate!</Badge>
        </Card>

        <Card className="p-6 text-center hover:shadow-xl transition-shadow">
          <Star className="w-12 h-12 mx-auto mb-4 text-primary-500" />
          <h3 className="text-xl font-bold mb-2">Recomendado</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Producto destacado de la semana con precio especial
          </p>
          <Badge variant="success">Nuevo</Badge>
        </Card>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">¿Listo para ahorrar?</h2>
        <p className="text-xl mb-6 text-white/90">
          Explora nuestro catálogo y aprovecha estas increíbles ofertas
        </p>
        <Button size="lg" variant="secondary">
          Ver Catálogo Completo
        </Button>
      </div>
    </div>
  )
}
