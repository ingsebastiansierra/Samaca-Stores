import CreateStoreForm from '@/components/super-admin/CreateStoreForm'

export default function NewStorePage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Tienda</h1>
                <p className="text-gray-600 mt-2">
                    Completa el formulario para crear una nueva tienda y su administrador
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <CreateStoreForm />
            </div>
        </div>
    )
}
