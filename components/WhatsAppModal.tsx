'use client'

import { useState } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface WhatsAppModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [message, setMessage] = useState('')
  const phone = '573123106507'
  const phoneFormatted = '+57 312 310 6507'

  const openWhatsApp = () => {
    if (!message.trim()) {
      toast.error('Por favor escribe un mensaje')
      return
    }

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    toast.success('Abriendo WhatsApp...')
    setMessage('')
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      openWhatsApp()
    }
  }

  const quickMessages = [
    '¡Hola! Me gustaría obtener más información sobre sus productos',
    'Quiero hacer una cotización',
    'Tengo una pregunta sobre un pedido',
    '¿Cuáles son sus horarios de atención?'
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed left-1/2 top-[25%] md:top-[20%] -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[70vh] md:max-h-[75vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 bg-[#25D366] text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold">Chat de WhatsApp</h2>
                  <p className="text-xs md:text-sm text-white/90">{phoneFormatted}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
              {/* Quick Messages */}
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Mensajes rápidos:
                </p>
                <div className="space-y-2">
                  {quickMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(msg)}
                      className="w-full text-left p-2.5 md:p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Tu mensaje:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Presiona Enter para enviar
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <Button
                size="lg"
                onClick={openWhatsApp}
                disabled={!message.trim()}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                Enviar por WhatsApp
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
