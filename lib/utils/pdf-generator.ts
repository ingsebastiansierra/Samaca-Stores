import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface QuotationItem {
  name: string
  originalPrice: number
  adjustedPrice: number
  quantity: number
  size?: string
  color?: string
  discount: number
}

interface QuotationPDFData {
  ticket: string
  storeName: string
  storePhone?: string
  storeAddress?: string
  customerName: string
  customerPhone: string
  customerCity?: string
  items: QuotationItem[]
  notes?: string
  validUntil: number
  createdAt: Date
}

export function generateQuotationPDF(data: QuotationPDFData): jsPDF {
  const doc = new jsPDF()
  
  // Colores
  const primaryColor: [number, number, number] = [2, 132, 199] // Sky-600
  const darkColor: [number, number, number] = [31, 41, 55] // Gray-800
  const lightGray: [number, number, number] = [243, 244, 246] // Gray-100
  
  let yPos = 20

  // Header - Logo y título
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('COTIZACIÓN', 105, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(data.storeName, 105, 28, { align: 'center' })
  
  if (data.storePhone) {
    doc.setFontSize(10)
    doc.text(`Tel: ${data.storePhone}`, 105, 34, { align: 'center' })
  }

  yPos = 50

  // Información de la cotización
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  
  // Columna izquierda
  doc.text('COTIZACIÓN:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(data.ticket, 55, yPos)
  
  doc.setFont('helvetica', 'bold')
  doc.text('FECHA:', 20, yPos + 6)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(data.createdAt).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }), 55, yPos + 6)
  
  doc.setFont('helvetica', 'bold')
  doc.text('VÁLIDA POR:', 20, yPos + 12)
  doc.setFont('helvetica', 'normal')
  doc.text(`${data.validUntil} días`, 55, yPos + 12)

  // Columna derecha - Datos del cliente
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE:', 120, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(data.customerName, 145, yPos)
  
  doc.setFont('helvetica', 'bold')
  doc.text('TELÉFONO:', 120, yPos + 6)
  doc.setFont('helvetica', 'normal')
  doc.text(data.customerPhone, 145, yPos + 6)
  
  if (data.customerCity) {
    doc.setFont('helvetica', 'bold')
    doc.text('CIUDAD:', 120, yPos + 12)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customerCity, 145, yPos + 12)
  }

  yPos += 25

  // Línea separadora
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.5)
  doc.line(20, yPos, 190, yPos)

  yPos += 10

  // Tabla de productos
  const tableData = data.items.map((item, index) => {
    const details = []
    if (item.size) details.push(`Talla: ${item.size}`)
    if (item.color) details.push(`Color: ${item.color}`)
    
    return [
      (index + 1).toString(),
      `${item.name}\n${details.join(' • ')}`,
      item.quantity.toString(),
      item.discount > 0 
        ? `$${item.originalPrice.toLocaleString('es-CO')}\n(-${item.discount}%)`
        : `$${item.originalPrice.toLocaleString('es-CO')}`,
      `$${item.adjustedPrice.toLocaleString('es-CO')}`,
      `$${(item.adjustedPrice * item.quantity).toLocaleString('es-CO')}`
    ]
  })

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Producto', 'Cant.', 'Precio Unit.', 'Precio Final', 'Subtotal']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkColor
    },
    alternateRowStyles: {
      fillColor: lightGray
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 60 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 35, halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  })

  // Calcular totales
  const originalTotal = data.items.reduce((sum, item) => 
    sum + (item.originalPrice * item.quantity), 0
  )
  const adjustedTotal = data.items.reduce((sum, item) => 
    sum + (item.adjustedPrice * item.quantity), 0
  )
  const totalDiscount = originalTotal - adjustedTotal
  const hasDiscount = totalDiscount > 0

  // Obtener posición Y después de la tabla
  yPos = (doc as any).lastAutoTable.finalY + 10

  // Totales
  const totalsX = 130
  doc.setFontSize(10)

  if (hasDiscount) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...darkColor)
    doc.text('Subtotal:', totalsX, yPos)
    doc.text(`$${originalTotal.toLocaleString('es-CO')}`, 190, yPos, { align: 'right' })
    
    yPos += 6
    doc.setTextColor(34, 197, 94) // Green-600
    doc.text(`Descuento (${Math.round((totalDiscount / originalTotal) * 100)}%):`, totalsX, yPos)
    doc.text(`-$${totalDiscount.toLocaleString('es-CO')}`, 190, yPos, { align: 'right' })
    
    yPos += 2
    doc.setDrawColor(...primaryColor)
    doc.line(totalsX, yPos, 190, yPos)
    yPos += 6
  }

  // Total final
  doc.setFillColor(...primaryColor)
  doc.rect(totalsX - 5, yPos - 5, 65, 10, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('TOTAL:', totalsX, yPos)
  doc.text(`$${adjustedTotal.toLocaleString('es-CO')}`, 190, yPos, { align: 'right' })

  // Notas
  if (data.notes) {
    yPos += 15
    doc.setFillColor(...lightGray)
    doc.rect(20, yPos - 5, 170, 20, 'F')
    
    doc.setTextColor(...darkColor)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('NOTAS:', 25, yPos)
    
    doc.setFont('helvetica', 'normal')
    const splitNotes = doc.splitTextToSize(data.notes, 160)
    doc.text(splitNotes, 25, yPos + 5)
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128) // Gray-500
  doc.setFont('helvetica', 'italic')
  doc.text(
    'Gracias por su preferencia. Esta cotización es válida por el tiempo indicado.',
    105,
    pageHeight - 20,
    { align: 'center' }
  )
  
  doc.setFont('helvetica', 'normal')
  doc.text(
    `Generado el ${new Date().toLocaleString('es-CO')}`,
    105,
    pageHeight - 15,
    { align: 'center' }
  )

  return doc
}
