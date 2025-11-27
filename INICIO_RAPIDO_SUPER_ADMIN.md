# ⚡ Inicio Rápido - Super Administrador

## 🚀 3 Pasos para Activar tu Super Admin

### Paso 1: Ejecutar Migración SQL (5 minutos)

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Click en **SQL Editor** (menú izquierdo)
4. Copia TODO el contenido de `supabase/migrations/20241127_super_admin.sql`
5. Pégalo en el editor y click **Run**
6. ✅ Verás "Success. No rows returned"

### Paso 2: Crear tu Usuario (2 minutos)

1. En Supabase, ve a **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Completa:
   - Email: `ingsebastian073@gmail.com`
   - Password: [tu contraseña segura]
   - ✅ Marca "Auto Confirm User"
4. Click **Create user**
5. **COPIA EL UUID** que aparece (lo necesitas para el siguiente paso)

### Paso 3: Asignar Rol Super Admin (1 minuto)

1. Ve a **SQL Editor** nuevamente
2. Ejecuta este SQL (reemplaza el UUID):

```sql
-- Primero verifica tu UUID
SELECT id, email FROM auth.users WHERE email = 'ingsebastian073@gmail.com';

-- Luego inserta tu perfil (REEMPLAZA EL UUID)
INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
VALUES (
  'PEGA_AQUI_TU_UUID',
  'ingsebastian073@gmail.com',
  'Sebastian Sierra Pineda',
  'super_admin',
  'Ingeniero de Sistemas'
);

-- Verifica que funcionó
SELECT * FROM public.user_profiles WHERE email = 'ingsebastian073@gmail.com';
```

3. ✅ Deberías ver tu perfil con rol 'super_admin'

## 🎯 ¡Listo! Ahora Accede

1. Inicia tu app: `npm run dev`
2. Ve a: http://localhost:3000
3. Login con: `ingsebastian073@gmail.com`
4. Serás redirigido a: `/super-admin/dashboard`

## 🎨 ¿Qué Puedes Hacer Ahora?

### Crear tu Primera Tienda
1. Dashboard → Click "Nueva Tienda"
2. Completa el formulario
3. ✅ Se crea la tienda + su administrador automáticamente

### Importar Productos Masivamente
1. Ve a una tienda → Click "Importar Excel"
2. Descarga la plantilla: `public/templates/productos-plantilla.csv`
3. Edita el CSV con tus productos
4. Súbelo y ¡listo!

### Monitorear Todo
- **Dashboard**: Métricas globales
- **Tiendas**: Ver todas las tiendas y sus stats
- **Usuarios**: Gestionar roles
- **Analytics**: Gráficos de ventas
- **Actividad**: Logs de auditoría

## 🔥 Funciones Clave

### Cambiar Estado de Tienda
```
Stores → Selecciona estado → Automático
```

### Cambiar Rol de Usuario
```
Users → Selecciona rol en dropdown → Automático
```

### Ver Detalles de Tienda
```
Stores → Click "Ver Detalles" → Todo el info
```

## 📊 Plantilla CSV para Productos

Formato requerido:
```csv
name,description,price,category,stock,images
Producto 1,Descripción,25000,Categoría,50,url_imagen
```

Descarga la plantilla completa en: `public/templates/productos-plantilla.csv`

## ❓ Problemas Comunes

### "No tienes permisos"
→ Verifica que tu usuario tenga rol 'super_admin' en user_profiles

### "Tabla no existe"
→ Ejecuta la migración SQL completa

### No aparecen estadísticas
→ Las stats se calculan automáticamente, espera unos segundos

## 📱 Rutas Principales

- `/super-admin/dashboard` - Dashboard principal
- `/super-admin/stores` - Gestión de tiendas
- `/super-admin/stores/new` - Crear tienda
- `/super-admin/users` - Gestión de usuarios
- `/super-admin/analytics` - Analytics
- `/super-admin/activity` - Logs

## 🎉 ¡Eso es Todo!

Ya tienes el control total de la plataforma. 

**Documentación completa:** Ver `SUPER_ADMIN_SETUP.md`

**¡Disfruta tu poder! 🚀**
