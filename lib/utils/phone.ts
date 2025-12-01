/**
 * Limpia y formatea un número de teléfono para WhatsApp
 * Elimina caracteres no numéricos y agrega código de país de Colombia (+57)
 * 
 * @param phone - Número de teléfono (puede tener espacios, guiones, etc.)
 * @returns Número limpio con código de país (ej: "573123106507")
 */
export function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  
  // Limpiar: solo dígitos
  let cleaned = phone.replace(/\D/g, '');
  
  // Si ya tiene código de país (57), no agregarlo de nuevo
  if (cleaned.startsWith('57') && cleaned.length >= 12) {
    return cleaned;
  }
  
  // Si empieza con 0, quitarlo (formato local colombiano)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // Agregar código de país de Colombia
  return `57${cleaned}`;
}

/**
 * Formatea un número para mostrar (con espacios)
 * @param phone - Número de teléfono
 * @returns Número formateado para lectura (ej: "312 310 6507")
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  // Si tiene código de país, quitarlo para mostrar
  let local = cleaned;
  if (cleaned.startsWith('57') && cleaned.length >= 12) {
    local = cleaned.substring(2);
  }
  
  // Formato: XXX XXX XXXX
  if (local.length === 10) {
    return `${local.substring(0, 3)} ${local.substring(3, 6)} ${local.substring(6)}`;
  }
  
  return local;
}
