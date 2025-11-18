'use client'

import { useState } from 'react'
import { X, Copy, ExternalLink, MessageCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface WhatsAppModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export function WhatsAppModal({ isOpen, onClose, message }: WhatsAppModalProps) {
  const phone = '3123106507'
  const phoneFormatted = '+57 312 310 6507'
  const whatsappUrl = `https://api.whatsapp.com/send?phone=57${phone}&text=${encodeURIComponent(message)}`

  const copyPhone = () => {
    navigator.clipboard.writeText(phone)
    toast.success('Número copiado al portapapeles')
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(message)
    toast.success('Mensaje copiado al portapapeles')
  }

  const openWhatsApp = () => {
    window.open(whatsappUrl, '_blank')
    toast.success('Abriendo WhatsApp...')
  }

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
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold">Contactar por WhatsApp</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Phone Number */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Número de WhatsApp
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-bold">{phoneFormatted}</span>
                  <button
                    onClick={copyPhone}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title="Copiar número"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                  Mensaje
                </label>
                <div className="relative">
                  <p className="text-sm whitespace-pre-wrap mb-2">{message}</p>
                  <button
                    onClick={copyMessage}
                    className="absolute top-0 right-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title="Copiar mensaje"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button
                  size="lg"
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Abrir WhatsApp
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={onClose}
                  className="w-full"
                >
                  Cerrar
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">💡 Instrucciones:</p>
                <ol className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>1. Haz clic en "Abrir WhatsApp"</li>
                  <li>2. Si no se abre, copia el número y mensaje</li>
                  <li>3. Abre WhatsApp manualmente y pega</li>
                </ol>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
