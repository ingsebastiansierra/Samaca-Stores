'use client'

import Image from 'next/image'
import { CheckCircle, Clock, Package, MapPin, Phone } from 'lucide-react'
import { formatPhoneForWhatsApp } from '@/lib/utils/phone'

interface QuotationViewProps {
    quotation: any
    response: any
}

export function QuotationView({ quotation, response }: QuotationViewProps) {
    const items = response?.items || quotation.items
    const total = response?.adjusted_total || quotation.total
    const hasDiscount = response && response.total_discount > 0

    const isExpired = response && new Date(response.valid_until_date) < new Date()

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header con logo de la tienda */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        {quotation.stores?.logo_url && (
                            <div className="relative w-20 h-20">
                                <Image
                                    src={quotation.stores.logo_url}
                                    alt={quotation.stores.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <div className="text-right">
                            <h1 className="text-2xl font-bold text-gray-900">{quotation.stores?.name}</h1>
                            <p className="text-sm text-gray-500">Cotización #{quotation.ticket}</p>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center gap-2 mt-4">
                        {response ? (
                            isExpired ? (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                                    <Clock className="w-5 h-5" />
                                    <span className="font-medium">Cotización Expirada</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Cotización Respondida</span>
                                </div>
                            )
                        ) : (
                            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">Pendiente de Respuesta</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Información del cliente */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Información del Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Nombre</p>
                            <p className="font-medium text-gray-900">{quotation.customer_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium text-gray-900">{quotation.customer_phone}</p>
                        </div>
                        {quotation.customer_city && (
                            <div>
                                <p className="text-sm text-gray-500">Ciudad</p>
                                <p className="font-medium text-gray-900">{quotation.customer_city}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-500">Fecha de Solicitud</p>
                            <p className="font-medium text-gray-900">
                                {new Date(quotation.created_at).toLocaleDateString('es-CO', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Productos */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Productos Cotizados
                    </h2>
                    <div className="space-y-4">
                        {items.map((item: any, index: number) => (
                            <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                {item.image_url && (
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {item.size && <span>Talla: {item.size}</span>}
                                        {item.color && <span className="ml-3">Color: {item.color}</span>}
                                        <span className="ml-3">Cantidad: {item.quantity}</span>
                                    </div>
                                    <div className="mt-2">
                                        {response && item.discount > 0 ? (
                                            <div>
                                                <span className="text-sm text-gray-500 line-through">
                                                    ${item.originalPrice?.toLocaleString()}
                                                </span>
                                                <span className="ml-2 text-lg font-bold text-green-600">
                                                    ${item.adjustedPrice?.toLocaleString()}
                                                </span>
                                                <span className="ml-2 text-sm text-green-600 font-medium">
                                                    ({item.discount}% OFF)
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-lg font-bold text-gray-900">
                                                ${item.price?.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Subtotal</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        ${((response ? item.adjustedPrice : item.price) * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white mb-6">
                    {hasDiscount && (
                        <div className="mb-4 pb-4 border-b border-white/20">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Subtotal Original:</span>
                                <span>${response.original_total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-300">
                                <span>Descuento ({response.discount_percentage}%):</span>
                                <span>-${response.total_discount.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">Total:</span>
                        <span className="text-3xl font-bold">${total.toLocaleString()}</span>
                    </div>
                    {response && !isExpired && (
                        <p className="text-sm text-white/80 mt-2">
                            Válida hasta: {new Date(response.valid_until_date).toLocaleDateString('es-CO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    )}
                </div>

                {/* Notas */}
                {response?.notes && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Notas de la Tienda:</h3>
                        <p className="text-gray-700">{response.notes}</p>
                    </div>
                )}

                {/* Información de contacto */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Contacto</h2>
                    <div className="space-y-3">
                        {quotation.stores?.whatsapp && (
                            <a
                                href={`https://wa.me/${formatPhoneForWhatsApp(quotation.stores.whatsapp)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-green-600 hover:text-green-700"
                            >
                                <Phone className="w-5 h-5" />
                                <span className="font-medium">WhatsApp: {quotation.stores.whatsapp}</span>
                            </a>
                        )}
                        {quotation.stores?.address && (
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-5 h-5" />
                                <span>{quotation.stores.address}</span>
                            </div>
                        )}
                    </div>

                    {response && !isExpired && (
                        <a
                            href={`https://wa.me/${formatPhoneForWhatsApp(quotation.stores?.whatsapp || '')}?text=${encodeURIComponent(`Hola! Quiero proceder con la cotización ${quotation.ticket}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                            Proceder con la Compra
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
