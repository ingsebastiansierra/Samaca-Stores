import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Samacá Store',
        short_name: 'SamacáStore',
        description: 'Tu tienda de confianza en Samacá, Boyacá',
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#00f3ff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
