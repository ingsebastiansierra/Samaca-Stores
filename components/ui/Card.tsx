'use client'

import { HTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className = '', hover = true, children, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${hover ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
