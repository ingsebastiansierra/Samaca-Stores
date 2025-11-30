'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface QuickSaveButtonProps {
    quotation: any
    onSuccess?: () => void
}

export function QuickSaveButton({ quotation, onSuccess }: QuickSaveButtonProps) {
    const [saving, setSaving] = useState(false)

    const handleQuickSave = async (e: React.MouseEvent) => {
        e.preventDefault() // Evitar navegación si está dentro de un Link
        e.stopPropagation()

        if (!confirm('¿Guardar esta cotización con los precios actuales (sin descuentos)?')) {
            return
        }

        setSaving(true)
        try {
            const response = await fetch('/api/quotations/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quotationId: quotation.id,
                    items: quotation.items.map((item: any) => ({
                        name: item.name,
                        originalPrice: item.price,
                        adjustedPrice: item.price,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                        discount: 0
                    })),
                    notes: '',
                    validUntil: 7,
                    format: 'save'
                })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error)

            toast.success('Respuesta guardada exitosamente')
            if (onSuccess) onSuccess()
        } catch (error: any) {
            console.error('Error guardando respuesta:', error)
            toast.error(error.message || 'Error al guardar respuesta')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Button
            onClick={handleQuickSave}
            disabled={saving}
            size="sm"
            variant="outline"
            className="border-sky-600 text-sky-600 hover:bg-sky-50"
        >
            {saving ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
                <Save className="h-4 w-4 mr-1" />
            )}
            Guardar
        </Button>
    )
}
