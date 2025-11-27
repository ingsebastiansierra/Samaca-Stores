# 🚀 Sistema de Super Administrador - Samacá Store

## 🎯 Descripción

Sistema completo de super administración para la plataforma Samacá Store. Permite el control total de todas las tiendas, usuarios, productos, ventas y estadísticas desde un único panel centralizado.

## ✨ Características Principales

### 🏪 Gestión de Tiendas
- ✅ Ver todas las tiendas con estadísticas en tiempo real
- ✅ Crear nuevas tiendas con su administrador
- ✅ Cambiar estado (activa/inactiva/cerrada)
- ✅ Ver detalles completos (productos, pedidos, inventario)
- ✅ Eliminar tiendas
- ✅ Importar productos masivamente desde Excel/CSV

### 👥 Gestión de Usuarios
- ✅ Ver todos los usuarios registrados
- ✅ Cambiar roles dinámicamente (user, store_admin, super_admin)
- ✅ Ver información de perfil completa
- ✅ Estadísticas por rol

### 📊 Analytics Global
- ✅ Dashboard con métricas clave
- ✅ Gráficos de ventas por mes
- ✅ Distribución de usuarios por rol
- ✅ Top 5 tiendas por ventas
- ✅ Ingresos totales de la plataforma

### 📝 Auditoría y Logs
- ✅ Registro completo de todas las acciones
- ✅ Tracking de cambios en tiempo real
- ✅ Detalles de cada operación
- ✅ Filtrado por tipo de entidad

### 📥 Importación de Datos
- ✅ Subir productos desde Excel/CSV
- ✅ Validación automática de datos
- ✅ Vista previa antes de importar
- ✅ Reporte de errores detallado
- ✅ Plantilla descargable

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Supabase** - Base de datos y autenticación
- **Tailwind CSS** - Estilos
- **Chart.js** - Gráficos
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos

## 📦 Instalación

### 1. Configurar Base de Datos

```bash
# 1. Ve a Supabase Dashboard
# 2. SQL Editor
# 3. Ejecuta el archivo: supabase/migrations/20241127_super_admin.sql
```

### 2. Crear Usuario Super Admin

```bash
# 1. En Supabase: Authentication > Users > Add user
# Email: ingsebastian073@gmail.com
# Password: [tu contraseña]
# Auto Confirm: ✅

# 2. Copia el UUID del usuario

# 3. En SQL Editor, ejecuta:
INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
VALUES (
  'TU_UUID_AQUI',
  'ingsebastian073@gmail.com',
  'Sebastian Sierra Pineda',
  'super_admin',
  'Ingeniero de Sistemas'
);
```

### 3. Iniciar Aplicación

```bash
npm install
npm run dev
```

### 4. Acceder al Panel

```
URL: http://localhost:3000
Login: ingsebastian073@gmail.com
Redirige a: /super-admin/dashboard
```

## 📁 Estructura del Proyecto

```
├── app/super-admin/              # Rutas del super admin
│   ├── dashboard/                # Dashboard principal
│   ├── stores/                   # Gestión de tiendas
│   ├── users/                    # Gestión de usuarios
│   ├── analytics/                # Analytics y gráficos
│   ├── activity/                 # Logs de actividad
│   └── settings/                 # Configuración
│
├── components/super-admin/       # Componentes del panel
│   ├── SuperAdminNav.tsx         # Navegación
│   ├── StoresList.tsx            # Lista de tiendas
│   ├── UsersList.tsx             # Lista de usuarios
│   ├── AnalyticsCharts.tsx       # Gráficos
│   └── ImportProductsForm.tsx    # Importar productos
│
├── lib/
│   ├── auth/roles.ts             # Sistema de roles
│   ├── actions/super-admin.ts    # Server actions
│   └── types/database.types.ts   # Tipos de BD
│
├── supabase/migrations/          # Migraciones SQL
├── scripts/                      # Scripts útiles
└── public/templates/             # Plantillas CSV
```

## 🔐 Sistema de Roles

### Super Admin
- Acceso total a la plataforma
- Gestión de todas las tiendas
- Gestión de usuarios y roles
- Analytics globales
- Logs de auditoría

### Store Admin
- Gestión de su tienda
- Productos e inventario
- Pedidos y cotizaciones
- Estadísticas de su tienda

### User
- Navegación de productos
- Realizar pedidos
- Ver su historial

## 📊 Base de Datos

### Tablas Principales

#### user_profiles
```sql
- id: UUID
- user_id: UUID (FK auth.users)
- email: TEXT
- full_name: TEXT
- role: TEXT (super_admin, store_admin, user)
- profession: TEXT
- phone: TEXT
- preferred_stores: UUID[]
```

#### stores
```sql
- id: UUID
- user_id: UUID
- name: TEXT
- status: TEXT (active, inactive, closed)
- total_sales: DECIMAL
- total_orders: INTEGER
- ... (más campos)
```

#### activity_logs
```sql
- id: UUID
- user_id: UUID
- store_id: UUID
- action: TEXT
- entity_type: TEXT
- entity_id: UUID
- details: JSONB
- created_at: TIMESTAMPTZ
```

#### store_stats
```sql
- id: UUID
- store_id: UUID
- total_products: INTEGER
- total_orders: INTEGER
- total_revenue: DECIMAL
- avg_order_value: DECIMAL
- ... (más campos)
```

## 🎨 Rutas del Panel

| Ruta | Descripción |
|------|-------------|
| `/super-admin/dashboard` | Dashboard principal con métricas |
| `/super-admin/stores` | Lista de todas las tiendas |
| `/super-admin/stores/new` | Crear nueva tienda |
| `/super-admin/stores/[id]` | Detalles de tienda |
| `/super-admin/stores/[id]/import` | Importar productos |
| `/super-admin/users` | Gestión de usuarios |
| `/super-admin/analytics` | Analytics con gráficos |
| `/super-admin/activity` | Logs de actividad |
| `/super-admin/settings` | Configuración |

## 📥 Importación de Productos

### Formato CSV Requerido

```csv
name,description,price,category,stock,images
Producto 1,Descripción del producto,25000,Categoría,50,url_imagen
```

### Campos

- **name** (requerido): Nombre del producto
- **description** (opcional): Descripción
- **price** (requerido): Precio en números
- **category** (requerido): Categoría
- **stock** (requerido): Cantidad en inventario
- **images** (opcional): URL de la imagen

### Plantilla

Descarga la plantilla de ejemplo: `public/templates/productos-plantilla.csv`

## 🔒 Seguridad

### Middleware
- Protege todas las rutas `/super-admin/*`
- Verifica autenticación
- Verifica rol super_admin
- Redirige si no tiene permisos

### Row Level Security (RLS)
- Políticas en todas las tablas
- Super admins pueden ver todo
- Store admins solo su tienda
- Users solo sus datos

### Auditoría
- Todas las acciones se registran
- Logs con detalles completos
- Tracking de cambios
- Timestamps precisos

## 📈 Métricas Disponibles

### Dashboard
- 💰 Ingresos totales
- 🏪 Tiendas activas
- 📦 Total de productos
- 🛒 Total de pedidos
- 👥 Total de usuarios

### Por Tienda
- 💵 Ventas totales
- 📊 Número de pedidos
- 📦 Productos en inventario
- 👤 Clientes únicos
- 💳 Ticket promedio

### Analytics
- 📈 Ventas por mes (últimos 6 meses)
- 🥧 Distribución de usuarios por rol
- 🏆 Top 5 tiendas por ventas
- 📊 Comparativas y tendencias

## 🐛 Solución de Problemas

### Error: "No tienes permisos"
```sql
-- Verifica tu rol
SELECT * FROM user_profiles WHERE user_id = auth.uid();
-- Debe mostrar role = 'super_admin'
```

### Error: "Tabla no existe"
```bash
# Ejecuta la migración completa
# supabase/migrations/20241127_super_admin.sql
```

### No aparecen estadísticas
```sql
-- Fuerza actualización de stats
SELECT update_store_stats();
```

## 📚 Documentación Adicional

- **INICIO_RAPIDO_SUPER_ADMIN.md** - Guía de inicio rápido (3 pasos)
- **SUPER_ADMIN_SETUP.md** - Guía completa de instalación
- **RESUMEN_SUPER_ADMIN.md** - Resumen ejecutivo del sistema

## 🎯 Usuario Super Admin

**Email:** ingsebastian073@gmail.com  
**Nombre:** Sebastian Sierra Pineda  
**Rol:** Super Administrador  
**Profesión:** Ingeniero de Sistemas

## 🚀 Próximas Mejoras

- [ ] Exportar reportes en PDF
- [ ] Notificaciones en tiempo real
- [ ] Dashboard personalizable
- [ ] Filtros avanzados
- [ ] Comparativas entre tiendas
- [ ] Predicciones con IA

## 📞 Soporte

Para cualquier duda o problema:
- Email: ingsebastian073@gmail.com
- Revisa los logs de actividad
- Consulta la documentación

## 📄 Licencia

Propiedad de Samacá Store - Todos los derechos reservados

---

**¡Disfruta del control total de tu plataforma! 🚀**
