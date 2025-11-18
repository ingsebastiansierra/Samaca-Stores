# 🛍️ Samacá Store - Sistema de E-commerce Ultra Rápido

Sistema web profesional para negocios de ropa, zapatos y accesorios en Samacá, Boyacá. Construido con Next.js 14 y Supabase.

## 🚀 Características Principales

- ⚡ **Ultra Rápido**: Next.js 14 con App Router y Server Components
- 🎨 **UI Moderna**: Diseño elegante con Tailwind CSS y Framer Motion
- 📱 **WhatsApp Integration**: Integración directa con WhatsApp Business
- 🎫 **Sistema de Tickets**: Generación automática de tickets únicos por pedido
- 📦 **Inventario en Tiempo Real**: Actualización automática con Supabase Realtime
- 🎁 **Promociones Dinámicas**: Sistema innovador de promociones (Dado de la Suerte, Happy Hour, etc.)
- 🌙 **Modo Oscuro**: Soporte completo para tema claro y oscuro
- 📊 **Dashboard Admin**: Panel administrativo completo

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Backend**: Supabase (Auth, PostgreSQL, Storage, Realtime)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd samaca-store
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Edita el archivo `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
NEXT_PUBLIC_BUSINESS_NAME=Samacá Store
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Configurar Supabase**

Ejecuta el script SQL en tu proyecto de Supabase:
```bash
# Copia el contenido de supabase/schema.sql
# y ejecútalo en el SQL Editor de Supabase
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
samaca-store/
├── app/                      # App Router de Next.js
│   ├── admin/               # Panel administrativo
│   ├── carrito/             # Carrito de compras
│   ├── catalogo/            # Catálogo de productos
│   ├── checkout/            # Proceso de pago
│   ├── pedido/              # Estado de pedidos
│   ├── promociones/         # Página de promociones
│   └── page.tsx             # Página de inicio
├── components/              # Componentes reutilizables
│   ├── ui/                  # Componentes UI base
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── WhatsAppButton.tsx
├── lib/                     # Utilidades y configuración
│   ├── supabase/           # Cliente de Supabase
│   ├── store/              # Estado global (Zustand)
│   ├── types/              # Tipos TypeScript
│   └── utils/              # Funciones auxiliares
└── supabase/               # Configuración de base de datos
    └── schema.sql          # Schema de PostgreSQL
```

## 🎯 Funcionalidades Principales

### 1. Catálogo Inteligente
- Listado de productos con fotos optimizadas
- Filtros avanzados (talla, color, precio, categoría)
- Búsqueda rápida con autosugest
- Actualización en tiempo real

### 2. Sistema de Tickets
Formato: `SAMACA-RP-[AAAA][MM][DD]-[4DIGITOS]`
- Ejemplo: `SAMACA-RP-20251116-4821`
- Seguimiento de pedidos
- Generación de QR (opcional)

### 3. Integración WhatsApp
- Botón flotante global
- Consultas por producto
- Envío automático de pedidos
- Mensajes pre-formateados

### 4. Promociones Innovadoras
- 🎲 **Dado de la Suerte**: Descuento aleatorio 5%-25%
- ⏰ **Happy Hour**: Descuentos por horario
- 🎁 **Combo Outfit**: Descuento por compra múltiple
- ⏳ **Últimas Unidades**: Productos con stock bajo
- ⭐ **Recomendado**: Producto destacado semanal

### 5. Dashboard Administrativo
- Gestión de productos (CRUD)
- Control de inventario
- Gestión de pedidos
- Reportes de ventas
- Configuración del negocio

## 🔐 Autenticación

El sistema usa Supabase Auth para el panel administrativo:

```typescript
// Ejemplo de login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@samacastore.com',
  password: 'tu_contraseña'
})
```

## 📱 Páginas Principales

- `/` - Inicio
- `/catalogo` - Catálogo de productos
- `/promociones` - Promociones especiales
- `/carrito` - Carrito de compras
- `/checkout` - Finalizar pedido
- `/pedido/[ticket]` - Estado del pedido
- `/admin/login` - Login administrativo
- `/admin/dashboard` - Panel de control
- `/admin/productos` - Gestión de productos
- `/admin/inventario` - Control de inventario
- `/admin/pedidos` - Gestión de pedidos

## 🎨 Personalización

### Colores
Edita `tailwind.config.ts` para cambiar los colores primarios:

```typescript
colors: {
  primary: {
    50: '#f0f9ff',
    // ... más tonos
    900: '#0c4a6e',
  },
}
```

### WhatsApp
Configura tu número en `.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Push tu código a GitHub
2. Importa el proyecto en Vercel
3. Configura las variables de entorno
4. Deploy automático

### Otras plataformas
- Netlify
- Railway
- AWS Amplify

## 📊 Base de Datos

El sistema usa PostgreSQL a través de Supabase con las siguientes tablas:

- `products` - Productos del catálogo
- `orders` - Pedidos de clientes
- `promotions` - Promociones activas
- `inventory_logs` - Historial de inventario

## 🤝 Contribuir

Este sistema está diseñado para ser vendido a comercios locales. Puedes:

1. Personalizar el diseño
2. Agregar nuevas funcionalidades
3. Adaptar para otros tipos de negocio
4. Mejorar el sistema de promociones

## 📄 Licencia

Proyecto privado para uso comercial.

## 📞 Soporte

Para soporte técnico o consultas sobre implementación, contacta al desarrollador.

---

**Desarrollado con ❤️ para comercios en Samacá, Boyacá**
