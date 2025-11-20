# 🔐 Guía de Autenticación y Gestión de Tiendas

## Resumen del Sistema

Tu aplicación ahora tiene un sistema completo de autenticación que permite:

✅ **Registro de usuarios** con email y contraseña  
✅ **Inicio de sesión** seguro  
✅ **Recuperación de contraseña** por email  
✅ **Vinculación de tiendas** con administradores  
✅ **Gestión de personal** (owners, admins, managers, staff)  
✅ **Seguridad a nivel de base de datos** (RLS - Row Level Security)

---

## 📋 Pasos para Configurar

### 1. Ejecutar Scripts de Seguridad

En Supabase Dashboard > SQL Editor, ejecuta en orden:

```sql
-- 1. Políticas de seguridad (RLS)
-- Archivo: supabase/rls-policies.sql
```

Esto configurará:
- Permisos de lectura/escritura por tabla
- Acceso basado en roles
- Seguridad automática

### 2. Crear Usuarios para las Tiendas

**Opción A: Desde Supabase Dashboard (Recomendado)**

1. Ve a **Authentication > Users**
2. Click en **"Add user" > "Create new user"**
3. Crea un usuario para cada tienda:

```
Boutique Elegancia:
- Email: maria@boutiqueelegancia.com
- Password: (elige una segura, ej: Maria2024!)

Moda Urbana:
- Email: carlos@modaurbana.com
- Password: (elige una segura)

Todo a Buen Precio:
- Email: ana@todobuenprecio.com
- Password: (elige una segura)

Sport Zone:
- Email: pedro@sportzone.com
- Password: (elige una segura)

Pequeños Fashionistas:
- Email: laura@pequenosfashionistas.com
- Password: (elige una segura)
```

4. **Copia el UUID** de cada usuario creado

**Opción B: Desde la aplicación**

Los usuarios pueden registrarse directamente en:
- `http://localhost:3000/auth/register`

### 3. Vincular Tiendas con Usuarios

Después de crear los usuarios, vincula cada tienda con su usuario:

```sql
-- Reemplaza 'USER_UUID_AQUI' con el UUID real del usuario

UPDATE stores 
SET user_id = 'USER_UUID_AQUI'
WHERE slug = 'boutique-elegancia';

UPDATE stores 
SET user_id = 'USER_UUID_AQUI'
WHERE slug = 'moda-urbana';

-- Repite para cada tienda...
```

### 4. Verificar Vinculación

```sql
SELECT 
  name as tienda,
  owner_email,
  CASE 
    WHEN user_id IS NOT NULL THEN '✅ Vinculada'
    ELSE '❌ Sin vincular'
  END as estado
FROM stores
ORDER BY name;
```

---

## 🚀 Uso del Sistema

### Para Usuarios (Clientes)

**Registro:**
- URL: `/auth/register`
- Completa el formulario
- Confirma tu email
- Inicia sesión

**Login:**
- URL: `/auth/login`
- Ingresa email y contraseña
- Accede a tu cuenta

**Recuperar Contraseña:**
- URL: `/auth/forgot-password`
- Ingresa tu email
- Revisa tu correo
- Sigue el enlace para restablecer

### Para Administradores de Tiendas

**Login:**
1. Ve a `/auth/login`
2. Ingresa el email de tu tienda
3. Accede al dashboard: `/admin/dashboard`

**Gestionar Tienda:**
- Ver productos
- Crear/editar productos
- Ver pedidos
- Gestionar inventario
- Ver estadísticas

**Agregar Personal:**
```sql
-- Agregar un empleado a tu tienda
INSERT INTO store_staff (store_id, user_id, role)
VALUES (
  'STORE_UUID',
  'USER_UUID',
  'staff' -- o 'manager', 'admin'
);
```

---

## 🔒 Niveles de Acceso

### Owner (Dueño)
- Control total de la tienda
- Gestionar productos, pedidos, personal
- Ver estadísticas y reportes
- Configurar tienda

### Admin (Administrador)
- Gestionar productos y pedidos
- Ver estadísticas
- Agregar/remover staff
- No puede eliminar la tienda

### Manager (Gerente)
- Gestionar productos
- Ver y actualizar pedidos
- Ver estadísticas básicas

### Staff (Empleado)
- Ver productos
- Actualizar inventario
- Ver pedidos
- No puede crear/eliminar

---

## 🛡️ Seguridad Implementada

### Row Level Security (RLS)

**Tiendas:**
- ✅ Todos pueden ver tiendas activas
- ✅ Solo el dueño puede editar su tienda
- ✅ Solo usuarios autenticados pueden crear tiendas

**Productos:**
- ✅ Todos pueden ver productos activos
- ✅ Solo staff de la tienda puede crear/editar
- ✅ Solo owners/admins pueden eliminar

**Pedidos:**
- ✅ Usuarios ven solo sus pedidos
- ✅ Staff ve pedidos de su tienda
- ✅ Cualquiera puede crear pedidos (checkout)

**Categorías:**
- ✅ Todos pueden ver categorías activas
- ✅ Solo staff puede gestionar

---

## 🔧 Funciones Útiles

### Verificar si usuario es staff

```sql
SELECT is_store_staff('STORE_UUID');
```

### Obtener tiendas de un usuario

```sql
SELECT * FROM get_user_stores('USER_UUID');
```

### Ver personal de una tienda

```sql
SELECT 
  ss.role,
  u.email,
  ss.is_active
FROM store_staff ss
JOIN auth.users u ON ss.user_id = u.id
WHERE ss.store_id = 'STORE_UUID';
```

---

## 📧 Configuración de Email

Para que funcione la recuperación de contraseña:

1. Ve a **Authentication > Email Templates** en Supabase
2. Personaliza los templates:
   - Confirm signup
   - Reset password
   - Magic link

3. Configura SMTP (opcional):
   - Settings > Auth > SMTP Settings
   - Usa tu propio servidor de email

---

## 🧪 Probar el Sistema

### 1. Crear Usuario de Prueba

```bash
# Desde la app
http://localhost:3000/auth/register

# Datos de prueba:
- Nombre: Test User
- Email: test@example.com
- Password: Test123!
```

### 2. Crear Tienda de Prueba

```sql
INSERT INTO stores (
  name, slug, description,
  owner_name, owner_email, owner_phone,
  user_id, status
) VALUES (
  'Mi Tienda de Prueba',
  'mi-tienda-prueba',
  'Tienda de prueba para testing',
  'Test User',
  'test@example.com',
  '3001234567',
  'USER_UUID_AQUI',
  'active'
);
```

### 3. Iniciar Sesión

```bash
http://localhost:3000/auth/login

Email: test@example.com
Password: Test123!
```

---

## 🐛 Solución de Problemas

### Error: "Email not confirmed"
- Revisa tu bandeja de entrada
- Busca el email de confirmación de Supabase
- Click en el enlace de confirmación

### Error: "Invalid login credentials"
- Verifica email y contraseña
- Asegúrate de que el email esté confirmado
- Intenta recuperar contraseña

### Error: "User already registered"
- El email ya está en uso
- Usa otro email o recupera la contraseña

### No puedo ver mi tienda en el dashboard
- Verifica que `user_id` esté configurado en la tabla `stores`
- Ejecuta: `SELECT * FROM stores WHERE user_id = auth.uid()`

### No puedo editar productos
- Verifica que seas staff de la tienda
- Ejecuta: `SELECT * FROM store_staff WHERE user_id = auth.uid()`

---

## 📚 Próximos Pasos

1. ✅ **Ejecutar scripts de seguridad**
2. ✅ **Crear usuarios para tiendas**
3. ✅ **Vincular tiendas con usuarios**
4. ✅ **Probar login y recuperación de contraseña**
5. 🔄 **Crear panel de administración** (próximo paso)
6. 🔄 **Implementar gestión de productos**
7. 🔄 **Implementar gestión de pedidos**

---

## 💡 Tips

- **Contraseñas seguras**: Mínimo 8 caracteres, mayúsculas, minúsculas, números
- **Emails reales**: Usa emails reales para recibir notificaciones
- **Backup**: Haz backup de los UUIDs de usuarios importantes
- **Testing**: Prueba todo en desarrollo antes de producción
- **Logs**: Revisa los logs de Supabase para debugging

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs de Supabase Dashboard
2. Verifica las políticas RLS
3. Confirma que los UUIDs sean correctos
4. Revisa la consola del navegador para errores

---

¡Tu sistema de autenticación está listo! 🎉
