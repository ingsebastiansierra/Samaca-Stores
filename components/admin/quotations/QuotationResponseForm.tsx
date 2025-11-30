'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Plus, Minus, FileText, Send, Download, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface QuotationItem {
    name: string
    price: number
    quantity: number
    size?: string
    color?: string
    image_url?: string
}

interface QuotationResponseFormProps {
    quotation: {
        id: string
        ticket: string
        customer_name: string
        customer_phone: string
        items: QuotationItem[]
        total: number
    }
    onClose: () => void
    onSuccess: () => void
}

export function QuotationResponseForm({ quotation, onClose, onSuccess }: QuotationResponseFormProps) {
    const [items, setItems] = useState(
        quotation.items.map(item => ({
            ...item,
            originalPrice: item.price,
            adjustedPrice: item.price,
            discount: 0
        }))
    )
    const [notes, setNotes] = useState('')
    const [validUntil, setValidUntil] = useState(7) // días
    const [sending, setSending] = useState(false)

    const handlePriceChange = (index: number, newPrice: number) => {
        const newItems = [...items]
        const originalPrice = newItems[index].originalPrice
        newItems[index].adjustedPrice = newPrice
        newItems[index].discount = Math.round(((originalPrice - newPrice) / originalPrice) * 100)
        setItems(newItems)
    }

    const handleDiscountChange = (index: number, discount: number) => {
        const newItems = [...items]
        const originalPrice = newItems[index].originalPrice
        const newPrice = originalPrice * (1 - discount / 100)
        newItems[index].adjustedPrice = Math.round(newPrice)
        newItems[index].discount = discount
        setItems(newItems)
    }

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.adjustedPrice * item.quantity), 0)
    }

    const calculateTotalDiscount = () => {
        const originalTotal = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0)
        const adjustedTotal = calculateTotal()
        return originalTotal - adjustedTotal
    }

    const handleSendResponse = async (format: 'whatsapp' | 'pdf' | 'save') => {
        setSending(true)

        // Para WhatsApp, abrir ventana inmediatamente para evitar bloqueo de popup
        let whatsappWindow: Window | null = null
        if (format === 'whatsapp') {
            whatsappWindow = window.open('about:blank', '_blank')
        }

        // Para "save", solo guardar sin enviar
        if (format === 'save') {
            console.log('💾 Guardando respuesta sin enviar...')
        }

        try {
            console.log('📤 Enviando respuesta de cotización:', { format, quotationId: quotation.id })

            const response = await fetch('/api/quotations/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quotationId: quotation.id,
                    items: items.map(item => ({
                        name: item.name,
                        originalPrice: item.originalPrice,
                        adjustedPrice: item.adjustedPrice,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                        discount: item.discount
                    })),
                    notes,
                    validUntil,
                    format
                })
            })

            console.log('📥 Respuesta recibida:', response.status)

            const data = await response.json()
            console.log('📊 Datos:', data)

            if (!response.ok) {
                console.error('❌ Error en respuesta:', data.error)
                if (whatsappWindow) whatsappWindow.close()
                throw new Error(data.error)
            }

            if (format === 'save') {
                // Solo guardar, no enviar nada
                console.log('✅ Respuesta guardada exitosamente')
                toast.success('Respuesta guardada exitosamente')
            } else if (format === 'whatsapp') {
                console.log('📱 Abriendo WhatsApp:', data.whatsappUrl)
                if (data.whatsappUrl && whatsappWindow) {
                    whatsappWindow.location.href = data.whatsappUrl
                    toast.success('Abriendo WhatsApp...')
                } else {
                    if (whatsappWindow) whatsappWindow.close()
                    throw new Error('No se generó la URL de WhatsApp')
                }
            } else if (format === 'pdf') {
                // Descargar PDF
                console.log('📄 Descargando PDF:', data.filename)
                if (data.pdfBase64) {
                    const link = document.createElement('a')
                    link.href = data.pdfBase64
                    link.download = data.filename
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    toast.success('PDF generado exitosamente')
                } else {
                    throw new Error('No se generó el PDF')
                }
            }

            onSuccess()
        } catch (error: any) {
            console.error('❌ Error al enviar respuesta:', error)
            if (whatsappWindow) whatsappWindow.close()
            toast.error(error.message || 'Error al enviar respuesta')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full my-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Responder Cotización</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {quotation.ticket} - {quotation.customer_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {/* Products with Price Adjustment */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Ajustar Precios</h3>
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex gap-4 mb-3">
                                        {item.image_url && (
                                            <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-md overflow-hidden">
                                                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                {item.size && `Talla: ${item.size}`} {item.color && `• Color: ${item.color}`}
                                            </p>
                                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Precio Original
                                            </label>
                                            <input
                                                type="text"
                                                value={`$${item.originalPrice.toLocaleString()}`}
                                                disabled
                                                className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Descuento (%)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={item.discount}
                                                onChange={(e) => handleDiscountChange(index, Number(e.target.value))}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Precio Ajustado
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.adjustedPrice}
                                                onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                                                className="w-full px-3 py-2 border-2 border-sky-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-semibold"
                                            />
                                        </div>
                                    </div>

                                    {item.discount > 0 && (
                                        <div className="mt-2 text-sm text-green-600 font-medium">
                                            Ahorro: ${((item.originalPrice - item.adjustedPrice) * item.quantity).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-sky-50 rounded-lg p-4 border-2 border-sky-200">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal Original:</span>
                                <span className="font-medium">${quotation.total.toLocaleString()}</span>
                            </div>
                            {calculateTotalDiscount() > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Descuento Total:</span>
                                    <span className="font-medium">-${calculateTotalDiscount().toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-sky-700 pt-2 border-t border-sky-300">
                                <span>Total Cotización:</span>
                                <span>${calculateTotal().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Notas Adicionales (Opcional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="Ej: Oferta válida por tiempo limitado, incluye envío gratis..."
                        />
                    </div>

                    {/* Valid Until */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Válida por (días)
                        </label>
                        <select
                            value={validUntil}
                            onChange={(e) => setValidUntil(Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                            <option value={3}>3 días</option>
                            <option value={7}>7 días</option>
                            <option value={15}>15 días</option>
                            <option value={30}>30 días</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <div className="flex flex-col gap-3">
                        {/* Botón de Guardar Respuesta */}
                        <Button
                            onClick={() => handleSendResponse('save')}
                            disabled={sending}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white !h-12 font-semibold"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Guardar Respuesta
                        </Button>

                        {/* Botones de Envío */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={() => handleSendResponse('whatsapp')}
                                disabled={sending}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white !h-12 font-semibold"
                            >
                                <Send className="w-5 h-5 mr-2" />
                                Enviar por WhatsApp
                            </Button>
                            <Button
                                onClick={() => handleSendResponse('pdf')}
                                disabled={sending}
                                variant="outline"
                                className="flex-1 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 !h-12 font-semibold"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Generar PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
