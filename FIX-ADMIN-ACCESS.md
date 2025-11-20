# 🔧 Solución: Admin no muestra productos

## 🔍 Problema Identificado

Las políticas RLS (Row Level Security) de Supabase están configuradas incorrectamente. Tienes **dos políticas duplicadas** que solo permiten ver productos activos:

1. `"Products are viewable by everyone"` - solo `is_active = true`
2. `"Productos activos son públicos"` - solo `is_active = true`

**Resultado:** El admin no puede ver productos inactivos ni gestionar su inventario completo.

## ✅ Solución

Ejecuta el script de corrección en Supabase SQL Editor:

### Opción 1: Script Completo (Recomendado)

```bash
# Abre Supabase Dashboard
# Ve a: SQL Editor
# Copia y ejecuta: scripts/fix-all-admin-access.sql
```

Este script corrige:
- ✅ Políticas de productos (ver todos, no solo activos)
- ✅ Políticas de categorías (necesarias para el JOIN)
- ✅ Políticas de órdenes (para el dashboard)

### Opción 2: Paso a Paso (Si hay errores)

Si el script completo da error, usa:

```bash
# Ejecuta bloque por bloque: scripts/fix-admin-step-by-step.sql
```

Este script tiene 5 pasos claramente separados que puedes ejecutar uno por uno.

## 📋 Pasos Detallados

### 1. Abrir Supabase Dashboard

```
https://supabase.com/dashboard/project/bkzfuprwdntoegkuemkw
```

### 2. Ir a SQL Editor

- Click en "SQL Editor" en el menú lateral
- Click en "New query"

### 3. Ejecutar el Script

- Copia todo el contenido de `scripts/fix-all-admin-access.sql`
- Pégalo en el editor
- Click en "Run" o presiona `Ctrl + Enter`

### 4. Verificar Resultados

El script mostrará al final:

```
✅ Políticas aplicadas para PRODUCTS
✅ Políticas aplicadas para CATEGORIES  
✅ Políticas aplicadas para ORDERS
✅ Conteo de recursos accesibles
```

### 5. Refrescar la Aplicación

- Vuelve a tu aplicación: `http://localhost:3000/admin/products`
- Refresca la página (`F5` o `Ctrl + R`)
- Deberías ver todos tus productos ahora

## 🔍 Diagnóstico (Opcional)

Si quieres verificar el estado actual antes de aplicar la solución:

```sql
-- Ejecuta en Supabase SQL Editor
-- Ver archivo: scripts/debug-products.sql
```

Este script te mostrará:
- Usuarios registrados
- Tiendas y sus dueños
- Productos y sus relaciones
- Políticas RLS actuales

## 🎯 Qué Hace la Corrección

### Antes (❌ Problema)

```sql
-- Solo productos activos
USING (is_active = true)
```

### Después (✅ Solución)

```sql
-- Público: solo productos activos
CREATE POLICY "public_view_active_products"
USING (is_active = true AND store_id IN (...));

-- Dueño: TODOS los productos (activos e inactivos)
CREATE POLICY "owner_view_all_products"
USING (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()));
```

## 🔐 Seguridad Mantenida

Las nuevas políticas mantienen la seguridad:

- ✅ Público solo ve productos activos de tiendas activas
- ✅ Dueño ve TODOS sus productos (para gestión)
- ✅ Staff ve productos de su tienda asignada
- ✅ Cada usuario solo ve sus propios recursos

## 🆘 Si Aún No Funciona

### Verificar Sesión

1. Cierra sesión en `/admin`
2. Vuelve a iniciar sesión
3. Verifica que estés autenticado correctamente

### Verificar Relación Usuario-Tienda

Ejecuta en Supabase SQL Editor:

```sql
-- Ver tu usuario y tienda
SELECT 
  u.email,
  s.id as store_id,
  s.name as store_name
FROM auth.users u
LEFT JOIN stores s ON s.user_id = u.id
WHERE u.email = 'TU_EMAIL_AQUI';
```

Si no aparece una tienda, ejecuta:

```sql
-- Ver archivo: scripts/link-admin-user.sql
```

### Limpiar Caché

```bash
# En tu terminal
cd samaca-store
rm -rf .next
npm run dev
```

## 📞 Soporte

Si después de estos pasos aún no funciona, proporciona:

1. Resultado del script `debug-products.sql`
2. Email del usuario admin
3. Captura de pantalla del error en consola del navegador (F12)
