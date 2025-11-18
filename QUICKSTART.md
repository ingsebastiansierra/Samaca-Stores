# 🚀 Inicio Rápido - Samacá Store

## ⚡ Empezar en 5 minutos

### 1. Instalar dependencias (ya hecho)
```bash
npm install
```

### 2. Configurar Supabase

**Opción A: Usar datos de prueba (sin Supabase)**
- El proyecto ya funciona con datos mock
- Puedes ver la UI y funcionalidades sin configurar nada

**Opción B: Configurar Supabase completo**
1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a SQL Editor y ejecuta `supabase/schema.sql`
4. Copia tus credenciales a `.env.local`

### 3. Ejecutar el proyecto
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🎯 Páginas para probar

- **/** - Página de inicio con hero section
- **/catalogo** - Ver productos (con datos mock)
- **/promociones** - Sistema de promociones innovador
  - Prueba el "Dado de la Suerte"
  - Ve el Happy Hour (activo 4pm-6pm)
- **/carrito** - Agrega productos y ve el carrito
- **/checkout** - Simula un pedido
- **/admin/login** - Panel administrativo

## 📱 Probar WhatsApp

1. Edita `.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
```

2. Haz clic en:
   - Botón flotante verde (esquina inferior derecha)
   - "Consultar" en cualquier producto
   - "Confirmar Pedido" en checkout

## 🎨 Personalizar

### Cambiar nombre de la tienda
Edita `components/Navbar.tsx` línea 35:
```typescript
Samacá Store → Tu Nombre
```

### Cambiar colores
Edita `tailwind.config.ts`:
```typescript
primary: {
  600: '#TU_COLOR',
}
```

### Agregar productos
Edita `app/catalogo/page.tsx` línea 12:
```typescript
const mockProducts: Product[] = [
  // Agrega tus productos aquí
]
```

## ✨ Características destacadas

### 1. Sistema de Tickets
Cada pedido genera un ticket único:
```
SAMACA-RP-20251116-4821
```

### 2. Promociones Dinámicas
- 🎲 Dado de la Suerte: Descuento aleatorio
- ⏰ Happy Hour: Descuentos por horario
- 🎁 Combos y ofertas especiales

### 3. Integración WhatsApp
- Botón flotante siempre visible
- Mensajes pre-formateados
- Envío automático de pedidos

### 4. UI Ultra Moderna
- Animaciones suaves con Framer Motion
- Modo oscuro completo
- Diseño responsive perfecto
- Optimización de imágenes Next.js

## 🔧 Comandos útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linter
npm run lint
```

## 📦 Estructura rápida

```
app/
├── page.tsx              # Inicio
├── catalogo/             # Productos
├── promociones/          # Ofertas
├── carrito/              # Carrito
├── checkout/             # Pago
└── admin/                # Panel admin

components/
├── ui/                   # Componentes base
├── Navbar.tsx            # Navegación
├── ProductCard.tsx       # Tarjeta de producto
└── WhatsAppButton.tsx    # Botón flotante

lib/
├── supabase/             # Cliente DB
├── store/                # Estado (Zustand)
└── utils/                # Utilidades
```

## 🎯 Próximos pasos

1. **Agregar productos reales**
   - Sube imágenes a Supabase Storage
   - Actualiza la base de datos

2. **Configurar WhatsApp Business**
   - Obtén tu número de WhatsApp
   - Actualiza `.env.local`

3. **Personalizar diseño**
   - Logo de tu tienda
   - Colores de marca
   - Información de contacto

4. **Desplegar a producción**
   - Push a GitHub
   - Deploy en Vercel (gratis)
   - Configura dominio personalizado

## 🆘 Problemas comunes

**Error: Cannot find module**
```bash
rm -rf node_modules .next
npm install
```

**Puerto 3000 ocupado**
```bash
npm run dev -- -p 3001
```

**Cambios no se reflejan**
- Reinicia el servidor (Ctrl+C, npm run dev)
- Limpia caché del navegador (Ctrl+Shift+R)

## 📞 Soporte

- Lee `README.md` para documentación completa
- Revisa `SETUP.md` para configuración detallada
- Consulta la consola del navegador (F12) para errores

---

**¡Listo para vender! 🎉**

Tu tienda está configurada y funcionando. Ahora personalízala y empieza a vender.
