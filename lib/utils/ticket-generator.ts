export function generateTicket(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  
  return `SAMACA-RP-${year}${month}${day}-${random}`
}

export function parseTicket(ticket: string) {
  const parts = ticket.split('-')
  if (parts.length !== 4) return null
  
  const datePart = parts[2]
  const year = datePart.substring(0, 4)
  const month = datePart.substring(4, 6)
  const day = datePart.substring(6, 8)
  
  return {
    prefix: parts[0],
    type: parts[1],
    date: `${year}-${month}-${day}`,
    number: parts[3]
  }
}
