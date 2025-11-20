import { z } from 'zod'

// Esquema de validación para registro
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  
  email: z
    .string()
    .email('Correo electrónico inválido')
    .toLowerCase(),
  
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(15, 'El teléfono es demasiado largo')
    .regex(/^[0-9+\s()-]+$/, 'Formato de teléfono inválido'),
  
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
  
  confirmPassword: z.string(),
  
  accountType: z.enum(['customer', 'store_admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Esquema para datos de tienda nueva
export const newStoreSchema = z.object({
  storeName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  
  storeDescription: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(500, 'La descripción es demasiado larga'),
  
  storeAddress: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección es demasiado larga'),
  
  storeCity: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad es demasiado larga'),
  
  storeWhatsapp: z
    .string()
    .min(10, 'El WhatsApp debe tener al menos 10 dígitos')
    .max(15, 'El WhatsApp es demasiado largo')
    .regex(/^[0-9+]+$/, 'Solo números y el símbolo +'),
  
  storeCategory: z.string(),
})

// Función para calcular fortaleza de contraseña
export function calculatePasswordStrength(password: string): {
  score: number
  label: string
  color: string
  suggestions: string[]
} {
  let score = 0
  const suggestions: string[] = []

  // Longitud
  if (password.length >= 8) score += 1
  else suggestions.push('Usa al menos 8 caracteres')
  
  if (password.length >= 12) score += 1
  else if (password.length >= 8) suggestions.push('Usa 12+ caracteres para mayor seguridad')

  // Minúsculas
  if (/[a-z]/.test(password)) score += 1
  else suggestions.push('Agrega letras minúsculas')

  // Mayúsculas
  if (/[A-Z]/.test(password)) score += 1
  else suggestions.push('Agrega letras mayúsculas')

  // Números
  if (/[0-9]/.test(password)) score += 1
  else suggestions.push('Agrega números')

  // Caracteres especiales
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else suggestions.push('Agrega caracteres especiales (!@#$%)')

  // Determinar label y color
  let label = ''
  let color = ''

  if (score <= 2) {
    label = 'Muy débil'
    color = 'bg-red-500'
  } else if (score <= 3) {
    label = 'Débil'
    color = 'bg-orange-500'
  } else if (score <= 4) {
    label = 'Media'
    color = 'bg-yellow-500'
  } else if (score <= 5) {
    label = 'Fuerte'
    color = 'bg-green-500'
  } else {
    label = 'Muy fuerte'
    color = 'bg-green-600'
  }

  return { score, label, color, suggestions }
}

// Validar email en tiempo real
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar teléfono en tiempo real
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9+\s()-]{10,15}$/
  return phoneRegex.test(phone)
}

// Esquema de validación para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Correo electrónico inválido')
    .toLowerCase(),
  
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
})

// Esquema de validación para recuperar contraseña
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Correo electrónico inválido')
    .toLowerCase(),
})

// Esquema de validación para restablecer contraseña
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
  
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})
