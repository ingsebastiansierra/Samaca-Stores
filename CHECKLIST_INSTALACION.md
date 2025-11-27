# ✅ Checklist de Instalación - Super Administrador

Usa este checklist para asegurarte de que todo esté configurado correctamente.

## 📋 Pre-requisitos

- [ ] Tienes acceso a Supabase Dashboard
- [ ] Tienes el proyecto corriendo localmente
- [ ] Tienes Node.js y npm instalados

## 🗄️ Base de Datos

### Paso 1: Ejecutar Migración
- [ ] Abrí Supabase Dashboard
- [ ] Fui a SQL Editor
- [ ] Copié el contenido de `supabase/migrations/20241127_super_admin.sql`
- [ ] Lo pegué en el editor
- [ ] Hice click en "Run"
- [ ] Vi el mensaje "Success. No rows returned"

### Paso 2: Verificar Tablas Creadas
- [ ] Fui a Table Editor
- [ ] Veo la tabla `user_profiles`
- [ ] Veo la tabla `activity_logs`
- [ ] Veo la tabla `store_stats`

### Paso 3: Verificar Columnas en Stores
- [ ] Abrí la tabla `stores`
- [ ] Veo la columna `status`
- [ ] Veo la columna `total_sales`
- [ ] Veo la columna `total_orders`

## 👤 Usuario Super Admin

### Paso 4: Crear Usuario en Auth
- [ ] Fui a Authentication > Users
- [ ] Hice click en "Add user"
- [ ] Ingresé email: `ingsebastian073@gmail.com`
- [ ] Ingresé una contraseña segura
- [ ] Marqué "Auto Confirm User"
- [ ] Hice click en "Create user"
- [ ] Copié el UUID del usuario

### Paso 5: Asignar Rol Super Admin
- [ ] Fui a SQL Editor
- [ ] Ejecuté: `SELECT id, email FROM auth.users WHERE email = 'ingsebastian073@gmail.com';`
- [ ] Copié el UUID que apareció
- [ ] Ejecuté el INSERT con mi UUID:
```sql
INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
VALUES (
  'MI_UUID_AQUI',
  'ingsebastian073@gmail.com',
  'Sebastian Sierra Pineda',
  'super_admin',
  'Ingeniero de Sistemas'
);
```
- [ ] Vi el mensaje de éxito

### Paso 6: Verificar Perfil
- [ ] Ejecuté: `SELECT * FROM public.user_profiles WHERE email = 'ingsebastian073@gmail.com';`
- [ ] Veo mi perfil con role = 'super_admin'

## 🚀 Aplicación

### Paso 7: Iniciar Servidor
- [ ] Ejecuté `npm install` (si es necesario)
- [ ] Ejecuté `npm run dev`
- [ ] El servidor inició sin errores
- [ ] Puedo acceder a http://localhost:3000

### Paso 8: Probar Login
- [ ] Fui a http://localhost:3000
- [ ] Hice click en "Iniciar Sesión"
- [ ] Ingresé: `ingsebastian073@gmail.com`
- [ ] Ingresé mi contraseña
- [ ] Hice click en "Iniciar Sesión"
- [ ] Fui redirigido a `/super-admin/dashboard`

## 🎯 Verificar Funcionalidades

### Dashboard
- [ ] Veo las métricas globales
- [ ] Veo el top de tiendas
- [ ] Veo la distribución de usuarios
- [ ] Los números tienen sentido

### Tiendas
- [ ] Puedo acceder a `/super-admin/stores`
- [ ] Veo la lista de tiendas (si hay)
- [ ] Puedo hacer click en "Nueva Tienda"
- [ ] El formulario se carga correctamente

### Crear Tienda (Opcional)
- [ ] Llené el formulario de nueva tienda
- [ ] Hice click en "Crear Tienda"
- [ ] La tienda se creó exitosamente
- [ ] Veo la tienda en la lista

### Usuarios
- [ ] Puedo acceder a `/super-admin/users`
- [ ] Veo mi usuario en la lista
- [ ] Mi rol es "Super Admin"
- [ ] Puedo cambiar roles en el dropdown

### Analytics
- [ ] Puedo acceder a `/super-admin/analytics`
- [ ] Veo los gráficos (si hay datos)
- [ ] Las métricas se muestran correctamente

### Actividad
- [ ] Puedo acceder a `/super-admin/activity`
- [ ] Veo los logs de actividad
- [ ] Los logs tienen timestamps

### Importar Productos (Opcional)
- [ ] Fui a una tienda
- [ ] Hice click en "Importar Excel"
- [ ] Puedo descargar la plantilla
- [ ] Puedo subir un archivo CSV
- [ ] La validación funciona

## 🔒 Seguridad

### Verificar Protección de Rutas
- [ ] Cerré sesión
- [ ] Intenté acceder a `/super-admin/dashboard`
- [ ] Fui redirigido al login
- [ ] Esto confirma que el middleware funciona

### Verificar Permisos
- [ ] Inicié sesión como super admin
- [ ] Puedo acceder a todas las rutas de super admin
- [ ] Puedo ver todas las tiendas
- [ ] Puedo cambiar roles de usuarios

## 📊 Datos de Prueba (Opcional)

### Crear Tienda de Prueba
- [ ] Creé una tienda de prueba
- [ ] La tienda tiene productos
- [ ] La tienda tiene pedidos
- [ ] Las estadísticas se actualizan

### Importar Productos de Prueba
- [ ] Descargué la plantilla CSV
- [ ] Edité el CSV con productos de prueba
- [ ] Importé el CSV
- [ ] Los productos aparecen en la tienda

## ✅ Verificación Final

- [ ] Todas las rutas funcionan
- [ ] No hay errores en la consola
- [ ] Los gráficos se muestran correctamente
- [ ] Puedo crear, editar y eliminar tiendas
- [ ] Puedo cambiar roles de usuarios
- [ ] Los logs de actividad se registran
- [ ] Las estadísticas se actualizan automáticamente

## 🎉 ¡Completado!

Si marcaste todas las casillas, ¡felicidades! Tu sistema de super administrador está completamente configurado y funcionando.

## 📝 Notas

Fecha de instalación: _______________

Problemas encontrados:
- 
- 
- 

Soluciones aplicadas:
- 
- 
- 

## 🆘 Si algo no funciona

1. Revisa los logs de la consola
2. Verifica que la migración SQL se ejecutó completamente
3. Confirma que tu usuario tiene rol 'super_admin'
4. Revisa la documentación en `SUPER_ADMIN_SETUP.md`
5. Consulta `INICIO_RAPIDO_SUPER_ADMIN.md` para pasos detallados

## 📞 Contacto

Si necesitas ayuda: ingsebastian073@gmail.com

---

**¡Disfruta de tu nuevo sistema de super administración! 🚀**
