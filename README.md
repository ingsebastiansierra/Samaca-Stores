# Samacá Store

Plataforma de comercio electrónico moderna para tiendas locales en Samacá, Boyacá.

## 🚀 Características

- **Multi-tienda**: Soporte para múltiples tiendas en una sola plataforma
- **Catálogo de productos**: Navegación y búsqueda de productos
- **Sistema de cotizaciones**: Los clientes pueden solicitar cotizaciones vía WhatsApp
- **Panel de administración**: Gestión completa de productos, categorías y pedidos
- **Autenticación**: Sistema de login para clientes y administradores
- **Tema claro**: Interfaz moderna con diseño limpio y profesional
- **Responsive**: Optimizado para dispositivos móviles y desktop

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Notificaciones**: React Hot Toast

## 📦 Instalación

1. Clona el repositorio
```bash
git clone [url-del-repo]
cd samaca-store
```

2. Instala las dependencias
```bash
npm install
```

3. Configura las variables de entorno
Crea un archivo `.env.local` con:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. Ejecuta el servidor de desarrollo
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
samaca-store/
├── app/                    # Páginas y rutas de Next.js
│   ├── admin/             # Panel de administración
│   ├── auth/              # Autenticación
│   ├── carrito/           # Carrito de compras
│   ├── catalogo/          # Catálogo de productos
│   └── producto/          # Detalles de producto
├── components/            # Componentes reutilizables
│   ├── admin/            # Componentes del admin
│   ├── auth/             # Componentes de autenticación
│   ├── cart/             # Componentes del carrito
│   └── ui/               # Componentes UI base
├── lib/                  # Utilidades y configuración
│   ├── hooks/           # Custom hooks
│   ├── store/           # Estado global (Zustand)
│   └── supabase/        # Cliente de Supabase
└── scripts/             # Scripts SQL para la base de datos
```

## 🗄️ Base de Datos

### Scripts Disponibles

- `create-storage-bucket.sql`: Crea el bucket de almacenamiento para imágenes
- `setup-supabase-storage.sql`: Configura las políticas de storage
- `seed-multiple-stores.sql`: Datos de ejemplo para múltiples tiendas
- `update-product-images.sql`: Actualiza las URLs de imágenes de productos
- `update-custom-products.sql`: Actualiza productos específicos

### Ejecutar Scripts

1. Ve a tu proyecto en Supabase
2. Abre el SQL Editor
3. Copia y pega el contenido del script
4. Ejecuta el script

## 🔐 Roles de Usuario

### Cliente
- Navegar catálogo
- Agregar productos al carrito
- Solicitar cotizaciones vía WhatsApp
- Ver historial de cotizaciones

### Administrador
- Gestionar productos
- Gestionar categorías
- Ver estadísticas
- Configurar tienda

## 🎨 Tema y Diseño

La aplicación utiliza un tema claro con:
- Fondo blanco principal
- Acentos en azul cielo (sky-600)
- Tipografía Inter y Orbitron
- Animaciones suaves con Framer Motion

## 📱 Características Principales

### Para Clientes
- **Catálogo**: Búsqueda y filtrado de productos
- **Carrito**: Gestión de productos agrupados por tienda
- **Cotizaciones**: Solicitud directa por WhatsApp
- **Perfil**: Historial de cotizaciones

### Para Administradores
- **Dashboard**: Estadísticas de ventas y productos
- **Productos**: CRUD completo de productos
- **Categorías**: Gestión de categorías
- **Configuración**: Ajustes de la tienda

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otros Servicios

La aplicación es compatible con cualquier servicio que soporte Next.js:
- Netlify
- Railway
- AWS Amplify

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Contacto

Para soporte o consultas, contacta al equipo de desarrollo.
