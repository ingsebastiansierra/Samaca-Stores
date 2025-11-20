'use client'

import { calculatePasswordStrength } from '@/lib/validations/auth'
import { CheckCircle, XCircle } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  password: string
  showSuggestions?: boolean
}

export function PasswordStrengthIndicator({ 
  password, 
  showSuggestions = true 
}: PasswordStrengthIndicatorProps) {
  if (!password) return null

  const { score, label, color, suggestions } = calculatePasswordStrength(password)
  const percentage = (score / 6) * 100

  return (
    <div className="space-y-2">
      {/* Barra de progreso */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">Fortaleza de la contraseña:</span>
          <span className={`font-bold ${
            score <= 2 ? 'text-red-600' :
            score <= 3 ? 'text-orange-600' :
            score <= 4 ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {label}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
              <XCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}

      {/* Requisitos cumplidos */}
      {showSuggestions && suggestions.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          <span>¡Contraseña segura!</span>
        </div>
      )}
    </div>
  )
}
