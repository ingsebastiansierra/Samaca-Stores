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

  // Header - Logo y tÃ­tulo
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('COTIZACIÃ“N', 105, 20, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(data.storeName, 105, 28, { align: 'center' })

  if (data.storePhone) {
    doc.setFontSize(10)
    doc.text(`Tel: ${data.storePhone}`, 105, 34, { align: 'center' })
  }

  yPos = 50

  // InformaciÃ³n de la cotizaciÃ³n
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')

  // Columna izquierda
  doc.text('COTIZACIÃ“N:', 20, yPos)
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
  doc.text('VÃLIDA POR:', 20, yPos + 12)
  doc.setFont('helvetica', 'normal')
  doc.text(`${data.validUntil} dÃ­as`, 55, yPos + 12)

  // Columna derecha - Datos del cliente
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE:', 120, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(data.customerName, 145, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('TELÃ‰FONO:', 120, yPos + 6)
  doc.setFont('helvetica', 'normal')
  doc.text(data.customerPhone, 145, yPos + 6)

  if (data.customerCity) {
    doc.setFont('helvetica', 'bold')
    doc.text('CIUDAD:', 120, yPos + 12)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customerCity, 145, yPos + 12)
  }

  yPos += 25

  // LÃ­nea separadora
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
      `${item.name}\n${details.join(' â€¢ ')}`,
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

  // Obtener posiciÃ³n Y despuÃ©s de la tabla
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
    'Gracias por su preferencia. Esta cotizaciÃ³n es vÃ¡lida por el tiempo indicado.',
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

export interface CatalogPDFData {
  storeName: string
  storePhone?: string
  categories: {
    name: string
    items: {
      name: string
      price: number
      image?: string
      description?: string
    }[]
  }[]
  title?: string
  subtitle?: string
}

// Función auxiliar para obtener imagen en Base64
async function getImageData(url: string): Promise<string | null> {
  if (!url) return null
  try {
    const response = await fetch(url, { mode: 'cors' })
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn('Error cargando imagen para PDF:', url, error)
    return null
  }
}

export async function generateCatalogPDF(data: CatalogPDFData): Promise<jsPDF> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  // Paleta de colores elegante en blanco y negro
  const black: [number, number, number] = [0, 0, 0]
  const darkGray: [number, number, number] = [40, 40, 40]
  const mediumGray: [number, number, number] = [120, 120, 120]
  const lightGray: [number, number, number] = [240, 240, 240]
  const white: [number, number, number] = [255, 255, 255]

  // ========== PORTADA MINIMALISTA ==========
  doc.setFillColor(...white)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Líneas decorativas superiores
  doc.setDrawColor(...black)
  doc.setLineWidth(2)
  doc.line(20, 40, pageWidth - 20, 40)
  doc.setLineWidth(0.5)
  doc.line(20, 45, pageWidth - 20, 45)

  // Nombre de la tienda en grande
  doc.setTextColor(...black)
  doc.setFontSize(48)
  doc.setFont('helvetica', 'bold')
  const storeNameLines = doc.splitTextToSize(data.storeName.toUpperCase(), pageWidth - 60)
  let yPos = 90
  storeNameLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPos, { align: 'center' })
    yPos += 20
  })

  // Subtítulo elegante
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...mediumGray)
  doc.text(data.title || 'CATÁLOGO DE PRODUCTOS', pageWidth / 2, yPos + 15, { align: 'center' })

  if (data.subtitle) {
    doc.setFontSize(11)
    doc.setTextColor(...mediumGray)
    doc.text(data.subtitle, pageWidth / 2, yPos + 28, { align: 'center' })
  }

  // Líneas decorativas inferiores
  doc.setDrawColor(...black)
  doc.setLineWidth(0.5)
  doc.line(20, pageHeight - 60, pageWidth - 20, pageHeight - 60)
  doc.setLineWidth(2)
  doc.line(20, pageHeight - 55, pageWidth - 20, pageHeight - 55)

  // Información de contacto en portada
  if (data.storePhone) {
    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'normal')
    doc.text(`PEDIDOS: ${data.storePhone}`, pageWidth / 2, pageHeight - 35, { align: 'center' })
  }

  doc.setFontSize(9)
  doc.setTextColor(...mediumGray)
  doc.text(new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }), pageWidth / 2, pageHeight - 25, { align: 'center' })

  // ========== ÍNDICE ELEGANTE ==========
  doc.addPage()
  doc.setFillColor(...white)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Header minimalista
  doc.setDrawColor(...black)
  doc.setLineWidth(0.3)
  doc.line(20, 25, pageWidth - 20, 25)

  doc.setTextColor(...black)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('ÍNDICE', 30, 45)

  // Línea debajo del título
  doc.setLineWidth(1.5)
  doc.line(30, 50, 80, 50)

  let indexY = 75
  doc.setFontSize(12)

  data.categories.forEach((category, idx) => {
    // Número de categoría
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...black)
    doc.text(`${String(idx + 1).padStart(2, '0')}`, 35, indexY)

    // Nombre de categoría
    doc.setFont('helvetica', 'normal')
    doc.text(category.name.toUpperCase(), 55, indexY)

    // Cantidad de productos (alineado a la derecha)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...mediumGray)
    doc.text(`${category.items.length} ${category.items.length === 1 ? 'producto' : 'productos'}`,
      pageWidth - 35, indexY, { align: 'right' })

    // Línea decorativa sutil
    doc.setDrawColor(...lightGray)
    doc.line(55, indexY + 3, pageWidth - 35, indexY + 3)

    indexY += 15
  })

  // Pre-cargar todas las imágenes
  const categoriesWithImages = await Promise.all(
    data.categories.map(async (category) => {
      const itemsWithImages = await Promise.all(
        category.items.map(async (item) => {
          let base64Image = null
          if (item.image) {
            base64Image = await getImageData(item.image)
          }
          return { ...item, base64Image }
        })
      )
      return { ...category, items: itemsWithImages }
    })
  )

  // ========== PÁGINAS DE PRODUCTOS ==========
  const margin = 15
  const colWidth = (pageWidth - (margin * 3)) / 2
  const rowHeight = 110
  const headerHeight = 70

  for (const category of categoriesWithImages) {
    doc.addPage()
    doc.setFillColor(...white)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Header de categoría elegante
    doc.setDrawColor(...black)
    doc.setLineWidth(0.3)
    doc.line(20, 25, pageWidth - 20, 25)

    // Bloque negro con nombre de categoría
    doc.setFillColor(...black)
    doc.rect(20, 35, pageWidth - 40, 25, 'F')

    doc.setTextColor(...white)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(category.name.toUpperCase(), pageWidth / 2, 52, { align: 'center' })

    let currentItemInPage = 0
    yPos = headerHeight

    for (let i = 0; i < category.items.length; i++) {
      const item = category.items[i]

      const col = currentItemInPage % 2
      const row = Math.floor(currentItemInPage / 2)

      const x = margin + (col * (colWidth + margin))
      const y = yPos + (row * (rowHeight + 10))

      // Verificar si necesitamos nueva página
      if (y + rowHeight > pageHeight - 20) {
        doc.addPage()
        doc.setFillColor(...white)
        doc.rect(0, 0, pageWidth, pageHeight, 'F')

        // Mini header en páginas siguientes
        doc.setDrawColor(...black)
        doc.setLineWidth(0.3)
        doc.line(20, 20, pageWidth - 20, 20)
        doc.setTextColor(...black)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(category.name.toUpperCase(), pageWidth / 2, 30, { align: 'center' })
        doc.line(20, 35, pageWidth - 20, 35)

        currentItemInPage = 0
        yPos = 50
        continue
      }

      // Marco del producto (solo borde)
      doc.setDrawColor(...black)
      doc.setLineWidth(0.5)
      doc.setFillColor(...white)
      doc.rect(x, y, colWidth, rowHeight, 'S')

      // Imagen del producto
      const imgHeight = rowHeight - 40
      if (item.base64Image) {
        try {
          // Fondo blanco para la imagen
          doc.setFillColor(...white)
          doc.rect(x + 2, y + 2, colWidth - 4, imgHeight, 'F')
          doc.addImage(item.base64Image, 'JPEG', x + 2, y + 2, colWidth - 4, imgHeight, undefined, 'FAST')
        } catch (e) {
          // Placeholder minimalista
          doc.setFillColor(...lightGray)
          doc.rect(x + 2, y + 2, colWidth - 4, imgHeight, 'F')
          doc.setTextColor(...mediumGray)
          doc.setFontSize(8)
          doc.setFont('helvetica', 'normal')
          doc.text('SIN IMAGEN', x + (colWidth / 2), y + (imgHeight / 2), { align: 'center' })
        }
      } else {
        doc.setFillColor(...lightGray)
        doc.rect(x + 2, y + 2, colWidth - 4, imgHeight, 'F')
        doc.setTextColor(...mediumGray)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text('SIN IMAGEN', x + (colWidth / 2), y + (imgHeight / 2), { align: 'center' })
      }

      // Separador horizontal
      doc.setDrawColor(...black)
      doc.setLineWidth(0.3)
      doc.line(x, y + imgHeight + 2, x + colWidth, y + imgHeight + 2)

      // Nombre del producto (elegante y compacto)
      doc.setTextColor(...black)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      const splitName = doc.splitTextToSize(item.name, colWidth - 10)
      const nameLines = splitName.slice(0, 2)
      doc.text(nameLines, x + 5, y + imgHeight + 12)

      // Precio destacado
      doc.setTextColor(...black)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text(`$${item.price.toLocaleString('es-CO')}`, x + colWidth - 5, y + rowHeight - 8, { align: 'right' })

      currentItemInPage++
    }
  }

  // ========== PÁGINA FINAL ELEGANTE ==========
  doc.addPage()
  doc.setFillColor(...black)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Líneas decorativas blancas
  doc.setDrawColor(...white)
  doc.setLineWidth(2)
  doc.line(30, 80, pageWidth - 30, 80)
  doc.setLineWidth(0.5)
  doc.line(30, 85, pageWidth - 30, 85)

  doc.setTextColor(...white)
  doc.setFontSize(36)
  doc.setFont('helvetica', 'bold')
  doc.text('GRACIAS', pageWidth / 2, 120, { align: 'center' })

  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text('POR PREFERIRNOS', pageWidth / 2, 140, { align: 'center' })

  // Líneas decorativas
  doc.setDrawColor(...white)
  doc.setLineWidth(0.5)
  doc.line(30, 155, pageWidth - 30, 155)
  doc.setLineWidth(2)
  doc.line(30, 160, pageWidth - 30, 160)

  if (data.storePhone) {
    doc.setFontSize(11)
    doc.setTextColor(...mediumGray)
    doc.text('REALIZA TU PEDIDO', pageWidth / 2, 185, { align: 'center' })

    doc.setFontSize(22)
    doc.setTextColor(...white)
    doc.setFont('helvetica', 'bold')
    doc.text(data.storePhone, pageWidth / 2, 205, { align: 'center' })
  }

  // Footer minimalista
  doc.setFontSize(9)
  doc.setTextColor(...mediumGray)
  doc.setFont('helvetica', 'normal')
  doc.text(data.storeName.toUpperCase(), pageWidth / 2, pageHeight - 25, { align: 'center' })

  return doc
}
