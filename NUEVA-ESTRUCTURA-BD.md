# 🏪 Nueva Estructura de Base de Datos - Multi-Tienda

## 🎯 Concepto

Transformamos el sistema de **una sola tienda** a una **plataforma multi-tienda** donde:
- Múltiples locales pueden registrarse
- Cada local tiene su propio espacio
- Cada local gestiona sus categorías y productos
- Sistema centralizado pero datos separados por tienda

---

## 📊 Estructura de Tablas

### 1. **`stores`** (Locales/Tiendas) 🏪

**Propósito**: Información de cada local comercial

**Campos principales:**
- `id` - Identificador único
- `name` - Nombre del local ("Boutique María", "Zapatos El Rey")
- `slug` - URL amigable (`boutique-maria`)
- `owner_name` - Propietario
- `owner_email`, `owner_phone` - Contacto
- `address`, `city`, `department` - Ubicación
- `whatsapp`, `facebook`, `instagram` - Redes sociales
- `logo_url`, `banner_url` - Imágenes
- `primary_color` - Color de marca
- `status` - Estado (active, inactive, suspended)
- `subscription_plan` - Plan (free, basic, premium)

**Ejemplo de datos:**
```json
{
  "name": "Boutique María",
  "slug": "boutique-maria",
  "owner_name": "María González",
  "owner_phone": "3123106507",
  "city": "Samacá",
  "whatsapp": "573123106507",
  "primary_color": "#FF1493",
  "status": "active"
}
```

---

### 2. **`categories`** (Categorías por Tienda) 📂

**Propósito**: Cada tienda define sus propias categorías

**Campos principales:**
- `id` - Identificador único
- `store_id` - A qué tienda pertenece
- `name` - Nombre ("Ropa Mujer", "Zapatos Deportivos")
- `slug` - URL amigable
- `parent_id` - Categoría padre (para subcategorías)
- `is_active` - Si está visible
- `is_featured` - Si es destacada

**Ejemplo de jerarquía:**
```
Boutique María:
  ├── Ropa Mujer (parent_id: null)
  │   ├── Vestidos (parent_id: ropa-mujer)
  │   └── Blusas (parent_id: ropa-mujer)
  └── Accesorios (parent_id: null)
      ├── Bolsos (parent_id: accesorios)
      └── Joyería (parent_id: accesorios)
```

---

### 3. **`products`** (Productos por Categoría) 👕

**Propósito**: Productos de cada tienda en sus categorías

**Campos principales:**
- `id` - Identificador único
- `store_id` - A qué tienda pertenece
- `category_id` - A qué categoría pertenece
- `name` - Nombre del producto
- `price` - Precio
- `stock` - Cantidad disponible
- `images` - Array de imágenes
- `sizes`, `colors` - Variantes
- `sku`, `barcode` - Códigos
- `is_featured` - Si es destacado

**Relación:**
```
Store (Boutique María)
  └── Category (Vestidos)
      ├── Product (Vestido Floral)
      ├── Product (Vestido Negro)
      └── Product (Vestido Casual)
```

---

### 4. **`orders`** (Pedidos por Tienda) 🛒

**Propósito**: Pedidos realizados en cada tienda

**Campos principales:**
- `store_id` - A qué tienda pertenece
- `ticket` - Ticket único
- `customer_name`, `customer_phone` - Cliente
- `items` - Productos del pedido (JSONB)
- `total` - Total del pedido
- `status` - Estado del pedido
- `delivery_address` - Dirección de entrega

**Flujo de estados:**
```
pending → confirmed → preparing → ready → shipped → delivered
                                                  ↓
                                             cancelled
```

---

### 5. **`promotions`** (Promociones por Tienda) 🎁

**Propósito**: Cada tienda crea sus promociones

**Tipos soportados:**
- `lucky_dice` - Dado de la Suerte
- `happy_hour` - Happy Hour
- `combo` - Combos
- `coupon` - Cupones de descuento
- `flash_sale` - Ventas relámpago

---

### 6. **`inventory_logs`** (Historial de Inventario) 📊

**Propósito**: Auditoría de movimientos de stock

**Tipos de movimiento:**
- `entry` - Entrada de mercancía
- `exit` - Salida (venta)
- `adjustment` - Ajuste manual
- `return` - Devolución

---

### 7. **`store_staff`** (Personal de la Tienda) 👥

**Propósito**: Gestión de usuarios por tienda

**Roles:**
- `owner` - Propietario (acceso total)
- `admin` - Administrador
- `manager` - Gerente
- `staff` - Empleado

---

## 🔗 Relaciones entre Tablas

```
stores (1) ──┬── (N) categories
             │
             ├── (N) products
             │
             ├── (N) orders
             │
             ├── (N) promotions
             │
             ├── (N) inventory_logs
             │
             └── (N) store_staff

categories (1) ──── (N) products
           (1) ──── (N) categories (subcategorías)

products (1) ──── (N) inventory_logs
```

---

## 🎯 Ventajas de esta Estructura

### 1. **Multi-Tenancy** (Multi-Inquilino)
- Cada tienda tiene sus datos aislados
- Una tienda no puede ver datos de otra
- Escalable a cientos de tiendas

### 2. **Flexibilidad**
- Cada tienda define sus categorías
- Categorías jerárquicas (padre/hijo)
- Productos específicos por tienda

### 3. **Seguridad**
- Row Level Security (RLS)
- Permisos por rol
- Auditoría completa

### 4. **Escalabilidad**
- Índices optimizados
- Queries eficientes
- Preparado para crecimiento

---

## 📱 Casos de Uso

### Caso 1: Boutique María
```
Store: Boutique María
├── Categories:
│   ├── Ropa Mujer
│   ├── Ropa Niña
│   └── Accesorios
└── Products: 50 productos
```

### Caso 2: Zapatos El Rey
```
Store: Zapatos El Rey
├── Categories:
│   ├── Zapatos Hombre
│   ├── Zapatos Mujer
│   └── Zapatos Niños
└── Products: 80 productos
```

### Caso 3: Tienda Deportiva
```
Store: Sport Center
├── Categories:
│   ├── Ropa Deportiva
│   │   ├── Camisetas
│   │   └── Pantalones
│   └── Calzado
│       ├── Running
│       └── Fútbol
└── Products: 120 productos
```

---

## 🚀 Migración desde la BD Actual

### Opción 1: Migración Automática
```sql
-- Crear una tienda por defecto
INSERT INTO stores (name, slug, owner_name, owner_phone)
VALUES ('Samacá Store', 'samaca-store', 'Admin', '3123106507');

-- Crear categorías desde los productos existentes
INSERT INTO categories (store_id, name, slug)
SELECT 
  (SELECT id FROM stores LIMIT 1),
  DISTINCT category,
  category
FROM products;

-- Actualizar productos con store_id y category_id
-- (Script detallado disponible)
```

### Opción 2: Empezar de Cero
- Ejecutar el nuevo schema
- Agregar tiendas manualmente
- Importar productos por tienda

---

## 🎨 URLs del Sistema

### Estructura de URLs:
```
/                           → Página principal (lista de tiendas)
/tienda/boutique-maria      → Página de la tienda
/tienda/boutique-maria/ropa-mujer  → Categoría
/tienda/boutique-maria/producto/vestido-floral  → Producto
/tienda/boutique-maria/carrito  → Carrito
/tienda/boutique-maria/pedido/TICKET  → Seguimiento
```

---

## 💰 Modelo de Negocio

### Planes de Suscripción:

**Free** (Gratis)
- 1 tienda
- 50 productos
- Funcionalidades básicas

**Basic** ($20.000/mes)
- 1 tienda
- 200 productos
- Promociones ilimitadas
- Soporte prioritario

**Premium** ($50.000/mes)
- 1 tienda
- Productos ilimitados
- Múltiples usuarios
- Reportes avanzados
- Dominio personalizado

**Enterprise** (Personalizado)
- Múltiples tiendas
- Todo ilimitado
- API access
- Soporte 24/7

---

## ✅ Próximos Pasos

1. **Revisar el schema** (`schema-multistore.sql`)
2. **Decidir estrategia de migración**
3. **Actualizar el código frontend**
4. **Crear panel de registro de tiendas**
5. **Implementar sistema de suscripciones**

---

## 🤔 ¿Qué prefieres?

1. **Migrar la BD actual** a la nueva estructura
2. **Empezar de cero** con la nueva estructura
3. **Mantener ambas** (sistema antiguo + nuevo)

---

**¿Te gusta esta estructura? ¿Quieres que hagamos la migración?** 🚀
