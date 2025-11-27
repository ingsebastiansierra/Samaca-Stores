# 🚀 Configuración del Super Administrador

Este documento explica cómo configurar el sistema de super administrador para la plataforma Samacá Store.

## 📋 Características del Super Admin

El super administrador tiene acceso completo a:

- ✅ **Dashboard Global**: Monitoreo de todas las tiendas, ventas, productos y usuarios
- ✅ **Gestión de Tiendas**: Crear, editar, activar/desactivar y eliminar tiendas
- ✅ **Gestión de Usuarios**: Ver todos los usuarios y cambiar sus roles
- ✅ **Analytics**: Estadísticas globales con gráficos y reportes
- ✅ **Logs de Actividad**: Monitoreo de todas las acciones en la plataforma
- ✅ **Importación de Datos**: Cargar productos desde Excel
- ✅ **Control Total**: Acceso a inventarios, pedidos, cotizaciones de todas las tiendas

## 🔧 Instalación

### Paso 1: Ejecutar las Migraciones de Base de Datos

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia y pega el contenido del archivo `supabase/migrations/20241127_super_admin.sql`
5. Haz clic en **Run** para ejecutar la migración

Esto creará:
- Tabla `user_profiles` con roles (super_admin, store_admin, user)
- Tabla `activity_logs` para registrar todas las acciones
- Tabla `store_stats` para estadísticas agregadas
- Políticas de seguridad RLS
- Triggers automáticos

### Paso 2: Crear tu Usuario Super Admin

1. En Supabase Dashboard, ve a **Authentication > Users**
2. Haz clic en **Add user** y crea un usuario con:
   - Email: `ingsebastian073@gmail.com`
   - Password: [tu contraseña segura]
   - Marca "Auto Confirm User"

3. Copia el UUID del usuario que acabas de crear

4. Ve a **SQL Editor** y ejecuta:

```sql
-- Obtener el UUID del usuario
SELECT id, email FROM auth.users WHERE email = 'ingsebastian073@gmail.com';


-- Insertar el perfil de super admin (reemplaza el UUID)
INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
VALUES (
  '959b6a5a-0087-4f10-9496-f1db2c906d9e',
  'ingsebastian073@gmail.com',
  'Sebastian Sierra Pineda',
  'super_admin',
  'Ingeniero de Sistemas'
)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  full_name = 'Sebastian Sierra Pineda',
  profession = 'Ingeniero de Sistemas';
```

5. Verifica que se creó correctamente:

```sql
SELECT * FROM public.user_profiles WHERE email = 'ingsebastian073@gmail.com';
```

### Paso 3: Actualizar las Dependencias (si es necesario)

Si no tienes instalado `chart.js` y `react-chartjs-2`, ejecuta:

```bash
npm install chart.js react-chartjs-2
```

### Paso 4: Reiniciar el Servidor de Desarrollo

```bash
npm run dev
```

## 🎯 Acceso al Panel de Super Admin

1. Ve a tu aplicación: http://localhost:3000
2. Inicia sesión con: `ingsebastian073@gmail.com`
3. Serás redirigido automáticamente a: `/super-admin/dashboard`

## 📱 Rutas del Super Admin

- `/super-admin/dashboard` - Dashboard principal con estadísticas globales
- `/super-admin/stores` - Gestión de todas las tiendas
- `/super-admin/stores/new` - Crear nueva tienda
- `/super-admin/stores/[id]` - Detalles de una tienda específica
- `/super-admin/users` - Gestión de usuarios y roles
- `/super-admin/analytics` - Analytics con gráficos
- `/super-admin/activity` - Logs de actividad
- `/super-admin/settings` - Configuración del super admin

## 🔐 Seguridad

El middleware protege automáticamente todas las rutas `/super-admin/*`:

1. Verifica que el usuario esté autenticado
2. Verifica que el usuario tenga rol `super_admin`
3. Si no cumple, redirige a la página principal

## 🎨 Funcionalidades Principales

### 1. Dashboard Global
- Resumen de ingresos totales
- Tiendas activas vs totales
- Pedidos y productos totales
- Top 5 tiendas por ventas
- Distribución de usuarios por rol

### 2. Gestión de Tiendas
- Ver todas las tiendas con sus estadísticas
- Crear nuevas tiendas con su administrador
- Cambiar estado (activa/inactiva/cerrada)
- Ver detalles completos de cada tienda
- Eliminar tiendas

### 3. Gestión de Usuarios
- Ver todos los usuarios registrados
- Cambiar roles (user, store_admin, super_admin)
- Ver información de perfil
- Filtrar por rol

### 4. Analytics
- Gráficos de ventas por mes
- Distribución de usuarios por rol
- Top tiendas con barras de progreso
- Métricas clave

### 5. Logs de Actividad
- Registro de todas las acciones
- Filtrado por tipo de entidad
- Detalles de cada acción
- Timestamps precisos

## 📊 Agregar Más Super Admins

Para agregar más super administradores:

```sql
-- Primero crea el usuario en Authentication
-- Luego ejecuta:
INSERT INTO public.user_profiles (user_id, email, full_name, role)
VALUES (
  'UUID_DEL_NUEVO_USUARIO',
  'nuevo@admin.com',
  'Nombre Completo',
  'super_admin'
);
```

## 🔄 Migrar Admins de Tienda Existentes

Si ya tienes admins de tienda, crea sus perfiles:

```sql
-- Para cada admin de tienda existente
INSERT INTO public.user_profiles (user_id, email, full_name, role)
SELECT 
  user_id,
  email,
  name as full_name,
  'store_admin' as role
FROM stores
WHERE user_id IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET role = 'store_admin';
```

## 🐛 Solución de Problemas

### Error: "No tienes permisos"
- Verifica que tu usuario tenga rol `super_admin` en la tabla `user_profiles`
- Ejecuta: `SELECT * FROM user_profiles WHERE user_id = auth.uid();`

### Error: "Tabla no existe"
- Asegúrate de haber ejecutado la migración SQL completa
- Verifica en Supabase > Table Editor que existan las tablas

### No se muestran estadísticas
- Las estadísticas se calculan automáticamente con triggers
- Puedes forzar la actualización ejecutando:
```sql
SELECT update_store_stats();
```

## 📝 Notas Importantes

1. **Backup**: Siempre haz backup de tu base de datos antes de ejecutar migraciones
2. **Producción**: Cambia las contraseñas por defecto en producción
3. **Roles**: Solo otorga rol `super_admin` a personas de confianza
4. **Logs**: Los logs de actividad se guardan automáticamente para auditoría

## 🎉 ¡Listo!

Ahora tienes acceso completo como super administrador. Puedes:
- Monitorear todas las tiendas
- Ver estadísticas globales
- Gestionar usuarios y roles
- Crear y administrar tiendas
- Ver logs de actividad
- Importar datos desde Excel

¡Disfruta de tu poder absoluto sobre la plataforma! 🚀
