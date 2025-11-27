# 🔧 Solución: Login de Super Admin

## ✅ Problema Resuelto

Ahora cuando inicies sesión con `ingsebastian073@gmail.com`, el sistema:

1. ✅ Verifica tu rol en la base de datos
2. ✅ Te redirige automáticamente a `/super-admin/dashboard`
3. ✅ Te muestra el menú de super administrador (diferente al de admin de tienda)

## 🚀 Pasos para Configurar (IMPORTANTE)

### Paso 1: Ejecutar la Migración SQL

**Ve a Supabase Dashboard:**
1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (menú izquierdo)
4. Copia TODO el contenido del archivo: `supabase/migrations/20241127_super_admin.sql`
5. Pégalo en el editor
6. Click en **Run** (botón verde)
7. Deberías ver: "Success. No rows returned"

### Paso 2: Crear tu Perfil de Super Admin

**Opción A: Script Automático (Recomendado)**

1. En el mismo SQL Editor de Supabase
2. Copia TODO el contenido de: `scripts/setup-super-admin-completo.sql`
3. Pégalo en el editor
4. Click en **Run**
5. Verás mensajes de confirmación

**Opción B: Manual**

1. Ve a **Authentication** → **Users** en Supabase
2. Busca tu usuario: `ingsebastian073@gmail.com`
3. Copia el UUID (algo como: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
4. Ve a **SQL Editor**
5. Ejecuta este SQL (reemplaza el UUID):

```sql
INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
VALUES (
  'TU_UUID_AQUI',
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

### Paso 3: Verificar que Funcionó

Ejecuta este SQL para verificar:

```sql
SELECT 
  up.email,
  up.full_name,
  up.role,
  up.profession
FROM public.user_profiles up
WHERE up.email = 'ingsebastian073@gmail.com';
```

Deberías ver:
- email: `ingsebastian073@gmail.com`
- full_name: `Sebastian Sierra Pineda`
- role: `super_admin` ← **ESTO ES LO IMPORTANTE**
- profession: `Ingeniero de Sistemas`

### Paso 4: Probar el Login

1. Asegúrate de que tu app esté corriendo: `npm run dev`
2. Ve a: http://localhost:3000
3. Click en "Iniciar Sesión"
4. Ingresa:
   - Email: `ingsebastian073@gmail.com`
   - Password: [tu contraseña]
5. Click en "Iniciar Sesión"

**¿Qué debería pasar?**
- ✅ Verás el mensaje "¡Bienvenido!"
- ✅ Serás redirigido a `/super-admin/dashboard`
- ✅ Verás el menú de super admin (con opciones: Dashboard, Tiendas, Usuarios, Analytics, Actividad, Configuración)
- ✅ NO verás el menú de admin de tienda

## 🔍 Si No Funciona

### Problema 1: Te redirige a la página de usuario normal

**Causa:** Tu perfil no tiene el rol `super_admin`

**Solución:**
```sql
-- Verifica tu rol
SELECT role FROM public.user_profiles WHERE email = 'ingsebastian073@gmail.com';

-- Si no es 'super_admin', actualízalo
UPDATE public.user_profiles 
SET role = 'super_admin' 
WHERE email = 'ingsebastian073@gmail.com';
```

### Problema 2: Error "tabla user_profiles no existe"

**Causa:** No ejecutaste la migración SQL

**Solución:**
1. Ve a `supabase/migrations/20241127_super_admin.sql`
2. Copia TODO el contenido
3. Ejecútalo en Supabase SQL Editor

### Problema 3: Error "usuario no encontrado"

**Causa:** No existe tu usuario en `user_profiles`

**Solución:**
1. Obtén tu UUID:
```sql
SELECT id FROM auth.users WHERE email = 'ingsebastian073@gmail.com';
```

2. Crea tu perfil:
```sql
INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
VALUES (
  'TU_UUID_AQUI',
  'ingsebastian073@gmail.com',
  'Sebastian Sierra Pineda',
  'super_admin',
  'Ingeniero de Sistemas'
);
```

### Problema 4: Te redirige a `/admin/dashboard` en lugar de `/super-admin/dashboard`

**Causa:** El rol no está configurado correctamente

**Solución:**
```sql
-- Forzar actualización del rol
UPDATE public.user_profiles 
SET role = 'super_admin', updated_at = NOW()
WHERE email = 'ingsebastian073@gmail.com';

-- Verificar
SELECT * FROM public.user_profiles WHERE email = 'ingsebastian073@gmail.com';
```

Luego:
1. Cierra sesión
2. Limpia las cookies del navegador (Ctrl+Shift+Delete)
3. Vuelve a iniciar sesión

## 📊 Diferencias entre los Menús

### Menú de Usuario Normal
- Inicio
- Productos
- Carrito
- Mi Cuenta

### Menú de Admin de Tienda
- Dashboard
- Productos
- Categorías
- Pedidos
- Cotizaciones
- Estadísticas
- Configuración

### Menú de Super Admin (TU MENÚ)
- 🚀 Super Admin (título)
- Dashboard (métricas globales)
- Tiendas (todas las tiendas)
- Usuarios (todos los usuarios)
- Analytics (gráficos globales)
- Actividad (logs de auditoría)
- Configuración

## ✅ Checklist Final

- [ ] Ejecuté la migración SQL completa
- [ ] Creé mi perfil en user_profiles
- [ ] Mi rol es 'super_admin'
- [ ] Reinicié el servidor (npm run dev)
- [ ] Limpié las cookies del navegador
- [ ] Inicié sesión con ingsebastian073@gmail.com
- [ ] Fui redirigido a /super-admin/dashboard
- [ ] Veo el menú de super admin

## 🎉 ¡Listo!

Si completaste todos los pasos, ahora deberías tener acceso completo al panel de super administrador.

**¿Necesitas ayuda?**
- Revisa los logs de la consola del navegador (F12)
- Verifica los logs del servidor
- Ejecuta el script de verificación: `scripts/verificar-super-admin.sql`

---

**¡Disfruta de tu poder absoluto sobre la plataforma! 🚀**
