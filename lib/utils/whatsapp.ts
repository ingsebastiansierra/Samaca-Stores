export function createWhatsAppLink(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  
  // Limpiar el mensaje de caracteres especiales
  const cleanMessage = message
    .replace(/\n/g, '%0A') // Saltos de línea
    .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
    .trim()
  
  // Codificar el mensaje
  const encodedMessage = encodeURIComponent(cleanMessage)
  
  // Usar wa.me que es más confiable
  return `https://wa.me/${phone}?text=${encodedMessage}`
}

export function createOrderMessage(order: {
  ticket: string
  productName: string
  size?: string
  quantity: number
  total: number
}): string {
  // Mensaje simple sin caracteres especiales
  let message = `Hola, quiero confirmar este pedido:\n\n`
  message += `Ticket: ${order.ticket}\n`
  message += `Producto: ${order.productName}\n`
  if (order.size) {
    message += `Talla: ${order.size}\n`
  }
  message += `Cantidad: ${order.quantity}\n`
  message += `Precio total: $${order.total.toLocaleString('es-CO')}\n\n`
  message += `Gracias!`
  
  return message
}

export function createProductInquiry(productName: string): string {
  return `Hola, me interesa el producto: ${productName}\n\nPodrias darme mas informacion?`
}
