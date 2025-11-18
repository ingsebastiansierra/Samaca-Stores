'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function TestWAPage() {
  const [url, setUrl] = useState('')
  
  const testSimple = () => {
    const phone = '573123106507'
    const message = 'Hola desde Samaca Store'
    const generatedUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    
    setUrl(generatedUrl)
    console.log('URL generada:', generatedUrl)
    window.open(generatedUrl, '_blank')
  }

  const testWithBreaks = () => {
    const phone = '573123106507'
    const message = `Hola, quiero confirmar este pedido:

Ticket: SAMACA-RP-20251116-1234
Producto: Zapatos Nike
Talla: 38
Cantidad: 1
Precio: $150.000

Gracias!`
    
    const generatedUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    
    setUrl(generatedUrl)
    console.log('URL generada:', generatedUrl)
    window.open(generatedUrl, '_blank')
  }

  const testDirect = () => {
    const phone = '573123106507'
    const generatedUrl = `https://wa.me/${phone}`
    
    setUrl(generatedUrl)
    console.log('URL generada:', generatedUrl)
    window.open(generatedUrl, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Prueba WhatsApp</h1>
      
      <div className="space-y-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Prueba 1: Mensaje Simple</h2>
          <Button onClick={testSimple} size="lg" className="w-full">
            Probar Mensaje Simple
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Prueba 2: Mensaje con Saltos de Línea</h2>
          <Button onClick={testWithBreaks} size="lg" className="w-full">
            Probar Mensaje Completo
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Prueba 3: Sin Mensaje (Solo Chat)</h2>
          <Button onClick={testDirect} size="lg" variant="outline" className="w-full">
            Abrir Chat Directo
          </Button>
        </div>
      </div>

      {url && (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="font-bold mb-2">URL Generada:</h3>
          <p className="text-sm break-all font-mono">{url}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(url)
              alert('URL copiada!')
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copiar URL
          </button>
        </div>
      )}

      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
        <h3 className="font-bold mb-2">🔍 Qué verificar:</h3>
        <ol className="space-y-2 text-sm">
          <li>1. ¿Se abre WhatsApp?</li>
          <li>2. ¿Aparece el número 3123106507?</li>
          <li>3. ¿Aparece el mensaje en el campo de texto?</li>
          <li>4. Si no aparece el mensaje, copia la URL y pégala en el navegador</li>
        </ol>
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-bold mb-2">💡 Instrucciones:</h3>
        <p className="text-sm mb-2">
          Si el mensaje NO aparece en WhatsApp:
        </p>
        <ol className="space-y-1 text-sm">
          <li>1. Copia la URL generada (botón "Copiar URL")</li>
          <li>2. Pégala en una nueva pestaña del navegador</li>
          <li>3. Presiona Enter</li>
          <li>4. Debería abrir WhatsApp con el mensaje</li>
        </ol>
      </div>
    </div>
  )
}
