import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QuotationView } from '@/components/quotations/QuotationView'

interface PageProps {
    params: {
        ticket: string
    }
}

export default async function QuotationPage({ params }: PageProps) {
    const supabase = await createClient()

    // Obtener la cotización
    const { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .select(`
      *,
      stores (
        id,
        name,
        slug,
        phone,
        whatsapp,
        address,
        logo_url
      )
    `)
        .eq('ticket', params.ticket)
        .single()

    if (quotationError || !quotation) {
        notFound()
    }

    // Obtener la respuesta de la cotización (si existe)
    const { data: response } = await supabase
        .from('quotation_responses')
        .select('*')
        .eq('quotation_id', quotation.id)
        .maybeSingle()

    return (
        <QuotationView
            quotation={quotation}
            response={response}
        />
    )
}
