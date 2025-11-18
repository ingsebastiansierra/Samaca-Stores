'use client'

import { Button } from '@/components/ui/Button'
import { MessageCircle } from 'lucide-react'

export default function TestWhatsAppPage() {
  const testWhatsApp = () => {
    const phone = '573123106507'
    const message = 'Hola, esto es una prueba desde Samacá Store'
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    
    console.log('URL de WhatsApp:', url)
    console.log('Número:', phone)
    console.log('Mensaje:', message)
    
    window.open(url, '_blank')
  }

  const testWhatsAppDirect = () => {
    // Prueba directa sin mensaje
    const phone = '573123106507'
    const url = `https://wa.me/${phone}`
    
    console.log('URL directa:', url)
    window.open(url, '_blank')
  }

  const testWhatsAppAPI = () => {
    // Usando api.whatsapp.com
    const phone = '573123106507'
    const message = 'Hola desde Samacá Store'
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
    
    console.log('URL API:', url)
    window.open(url, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Prueba de WhatsApp</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold mb-4">Información de Configuración</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Número configurado:</strong> 573123106507</p>
          <p><strong>Formato:</strong> Código país (57) + Número (3123106507)</p>
          <p><strong>Variable de entorno:</strong> NEXT_PUBLIC_WHATSAPP_NUMBER</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-3">Prueba 1: wa.me con mensaje</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Abre WhatsApp con un mensaje pre-cargado
          </p>
          <Button onClick={testWhatsApp} size="lg" className="w-full">
            <MessageCircle className="w-5 h-5 mr-2" />
            Probar wa.me con mensaje
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-3">Prueba 2: wa.me directo</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Abre WhatsApp sin mensaje (solo el chat)
          </p>
          <Button onClick={testWhatsAppDirect} size="lg" variant="secondary" className="w-full">
            <MessageCircle className="w-5 h-5 mr-2" />
            Probar wa.me directo
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-3">Prueba 3: API de WhatsApp</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Usa api.whatsapp.com (alternativa)
          </p>
          <Button onClick={testWhatsAppAPI} size="lg" variant="outline" className="w-full">
            <MessageCircle className="w-5 h-5 mr-2" />
            Probar API WhatsApp
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2">📱 Qué esperar:</h3>
        <ul className="space-y-2 text-sm">
          <li>✅ En móvil: Debería abrir la app de WhatsApp</li>
          <li>✅ En desktop: Debería abrir WhatsApp Web o la app de escritorio</li>
          <li>✅ El chat debería abrirse con el número 3123106507</li>
          <li>✅ El mensaje debería estar pre-cargado (en pruebas 1 y 3)</li>
        </ul>
      </div>

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2">⚠️ Si no funciona:</h3>
        <ul className="space-y-2 text-sm">
          <li>1. Verifica que WhatsApp esté instalado</li>
          <li>2. Verifica que el número sea correcto (3123106507)</li>
          <li>3. Prueba desde un móvil con WhatsApp instalado</li>
          <li>4. Revisa la consola del navegador (F12) para ver la URL generada</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Presiona F12 para ver los logs en la consola
        </p>
      </div>
    </div>
  )
}
