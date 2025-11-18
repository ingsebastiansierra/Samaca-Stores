'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { WhatsAppModal } from './WhatsAppModal'

export function WhatsAppButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-colors group"
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chatea con nosotros
        </span>
      </motion.button>

      <WhatsAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Hola, me gustaría obtener más información sobre sus productos."
      />
    </>
  )
}
