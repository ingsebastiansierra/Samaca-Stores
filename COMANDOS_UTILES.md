# 🛠️ Comandos Útiles - Super Administrador

Comandos SQL y operaciones comunes para el día a día.

## 👤 Gestión de Usuarios

### Crear Super Admin
```sql
-- 1. Obtener UUID del usuario
SELECT id, email FROM auth.users WHERE email = 'email@ejemplo.com';

-- 2. Crear perfil de super admin
INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
VALUES (
  'UUID_DEL_USUARIO',
  'email@ejemplo.com',
  'Nombre Completo',
  'super_admin',
  'Profesión'
);
```

### Cambiar Rol de Usuario
```sql
-- Cambiar a super admin
UPDATE public.user_profiles 
SET role = 'super_admin' 
WHERE email = 'email@ejemplo.com';

-- Cambiar a store admin
UPDATE public.user_profiles 
SET role = 'store_admin' 
WHERE email = 'email@ejemplo.com';

-- Cambiar a usuario normal
UPDATE public.user_profiles 
SET role = 'user' 
WHERE email = 'email@ejemplo.com';
```

### Ver Todos los Super Admins
```sql
SELECT 
  up.email,
  up.full_name,
  up.role,
  up.created_at
FROM public.user_profiles up
WHERE up.role = 'super_admin'
ORDER BY up.created_at DESC;
```

### Ver Usuarios por Rol
```sql
SELECT 
  role,
  COUNT(*) as total
FROM public.user_profiles
GROUP BY role
ORDER BY total DESC;
```

## 🏪 Gestión de Tiendas

### Ver Todas las Tiendas con Stats
```sql
SELECT 
  s.id,
  s.name,
  s.city,
  s.status,
  s.total_sales,
  s.total_orders,
  up.email as admin_email,
  up.full_name as admin_name
FROM public.stores s
LEFT JOIN public.user_profiles up ON s.user_id = up.user_id
ORDER BY s.total_sales DESC;
```

### Cambiar Estado de Tienda
```sql
-- Activar tienda
UPDATE public.stores 
SET status = 'active' 
WHERE id = 'UUID_TIENDA';

-- Desactivar tienda
UPDATE public.stores 
SET status = 'inactive' 
WHERE id = 'UUID_TIENDA';

-- Cerrar tienda
UPDATE public.stores 
SET status = 'closed' 
WHERE id = 'UUID_TIENDA';
```

### Ver Tiendas por Estado
```sql
SELECT 
  status,
  COUNT(*) as total,
  SUM(total_sales) as ventas_totales
FROM public.stores
GROUP BY status;
```

### Top Tiendas por Ventas
```sql
SELECT 
  s.name,
  s.city,
  s.total_sales,
  s.total_orders,
  ROUND(s.total_sales / NULLIF(s.total_orders, 0), 2) as ticket_promedio
FROM public.stores s
WHERE s.status = 'active'
ORDER BY s.total_sales DESC
LIMIT 10;
```

## 📊 Estadísticas

### Estadísticas Globales
```sql
SELECT 
  (SELECT COUNT(*) FROM public.stores) as total_tiendas,
  (SELECT COUNT(*) FROM public.stores WHERE status = 'active') as tiendas_activas,
  (SELECT COUNT(*) FROM public.user_profiles) as total_usuarios,
  (SELECT COUNT(*) FROM public.products) as total_productos,
  (SELECT COUNT(*) FROM public.orders) as total_pedidos,
  (SELECT COALESCE(SUM(total), 0) FROM public.orders) as ingresos_totales;
```

### Ventas por Mes (Últimos 6 meses)
```sql
SELECT 
  TO_CHAR(created_at, 'YYYY-MM') as mes,
  COUNT(*) as pedidos,
  SUM(total) as ventas
FROM public.orders
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY mes DESC;
```

### Productos Más Vendidos
```sql
SELECT 
  p.name,
  p.category,
  COUNT(o.id) as veces_vendido,
  SUM(p.price) as ingresos_generados
FROM public.products p
JOIN public.orders o ON o.items @> jsonb_build_array(jsonb_build_object('product_id', p.id))
GROUP BY p.id, p.name, p.category
ORDER BY veces_vendido DESC
LIMIT 20;
```

## 📝 Logs de Actividad

### Ver Actividad Reciente
```sql
SELECT 
  al.action,
  al.entity_type,
  al.details,
  up.email as usuario,
  s.name as tienda,
  al.created_at
FROM public.activity_logs al
LEFT JOIN public.user_profiles up ON al.user_id = up.user_id
LEFT JOIN public.stores s ON al.store_id = s.id
ORDER BY al.created_at DESC
LIMIT 50;
```

### Actividad por Usuario
```sql
SELECT 
  up.email,
  up.full_name,
  COUNT(*) as acciones_totales,
  MAX(al.created_at) as ultima_actividad
FROM public.activity_logs al
JOIN public.user_profiles up ON al.user_id = up.user_id
GROUP BY up.email, up.full_name
ORDER BY acciones_totales DESC;
```

### Actividad por Tienda
```sql
SELECT 
  s.name,
  COUNT(*) as acciones_totales,
  MAX(al.created_at) as ultima_actividad
FROM public.activity_logs al
JOIN public.stores s ON al.store_id = s.id
GROUP BY s.name
ORDER BY acciones_totales DESC;
```

## 🔄 Actualizar Estadísticas

### Forzar Actualización de Stats de Tienda
```sql
-- Para una tienda específica
INSERT INTO public.store_stats (store_id, total_orders, total_revenue, updated_at)
SELECT 
  'UUID_TIENDA',
  COUNT(*),
  COALESCE(SUM(total), 0),
  NOW()
FROM public.orders
WHERE store_id = 'UUID_TIENDA'
ON CONFLICT (store_id) 
DO UPDATE SET
  total_orders = EXCLUDED.total_orders,
  total_revenue = EXCLUDED.total_revenue,
  updated_at = NOW();
```

### Actualizar Stats de Todas las Tiendas
```sql
INSERT INTO public.store_stats (store_id, total_orders, total_revenue, updated_at)
SELECT 
  store_id,
  COUNT(*),
  COALESCE(SUM(total), 0),
  NOW()
FROM public.orders
WHERE store_id IS NOT NULL
GROUP BY store_id
ON CONFLICT (store_id) 
DO UPDATE SET
  total_orders = EXCLUDED.total_orders,
  total_revenue = EXCLUDED.total_revenue,
  updated_at = NOW();
```

### Actualizar Total de Productos por Tienda
```sql
UPDATE public.store_stats ss
SET total_products = (
  SELECT COUNT(*) 
  FROM public.products p 
  WHERE p.store_id = ss.store_id
),
updated_at = NOW();
```

## 🧹 Limpieza y Mantenimiento

### Limpiar Logs Antiguos (más de 6 meses)
```sql
DELETE FROM public.activity_logs
WHERE created_at < NOW() - INTERVAL '6 months';
```

### Ver Tiendas Inactivas (sin pedidos en 30 días)
```sql
SELECT 
  s.id,
  s.name,
  s.city,
  s.status,
  MAX(o.created_at) as ultimo_pedido
FROM public.stores s
LEFT JOIN public.orders o ON o.store_id = s.id
GROUP BY s.id, s.name, s.city, s.status
HAVING MAX(o.created_at) < NOW() - INTERVAL '30 days' 
   OR MAX(o.created_at) IS NULL
ORDER BY ultimo_pedido DESC NULLS LAST;
```

### Ver Productos Sin Stock
```sql
SELECT 
  p.name,
  p.category,
  p.stock,
  s.name as tienda
FROM public.products p
JOIN public.stores s ON p.store_id = s.id
WHERE p.stock = 0 OR p.status = 'out_of_stock'
ORDER BY s.name, p.category;
```

## 🔍 Consultas de Auditoría

### Cambios de Rol Recientes
```sql
SELECT 
  al.details->>'new_role' as nuevo_rol,
  up.email,
  up.full_name,
  al.created_at
FROM public.activity_logs al
JOIN public.user_profiles up ON al.entity_id::uuid = up.user_id
WHERE al.action = 'update_role'
ORDER BY al.created_at DESC
LIMIT 20;
```

### Tiendas Creadas Recientemente
```sql
SELECT 
  s.name,
  s.city,
  s.status,
  up.email as admin_email,
  s.created_at
FROM public.stores s
JOIN public.user_profiles up ON s.user_id = up.user_id
WHERE s.created_at >= NOW() - INTERVAL '30 days'
ORDER BY s.created_at DESC;
```

### Importaciones de Productos
```sql
SELECT 
  al.details->>'count' as productos_importados,
  s.name as tienda,
  up.email as usuario,
  al.created_at
FROM public.activity_logs al
JOIN public.stores s ON al.entity_id::uuid = s.id
LEFT JOIN public.user_profiles up ON al.user_id = up.user_id
WHERE al.action = 'import_products'
ORDER BY al.created_at DESC;
```

## 📊 Reportes

### Reporte de Ventas por Tienda (Mes Actual)
```sql
SELECT 
  s.name as tienda,
  COUNT(o.id) as pedidos,
  SUM(o.total) as ventas,
  ROUND(AVG(o.total), 2) as ticket_promedio
FROM public.stores s
LEFT JOIN public.orders o ON o.store_id = s.id 
  AND DATE_TRUNC('month', o.created_at) = DATE_TRUNC('month', NOW())
GROUP BY s.id, s.name
ORDER BY ventas DESC NULLS LAST;
```

### Reporte de Usuarios Activos
```sql
SELECT 
  up.role,
  COUNT(*) as total,
  COUNT(CASE WHEN al.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as activos_ultima_semana
FROM public.user_profiles up
LEFT JOIN public.activity_logs al ON al.user_id = up.user_id
GROUP BY up.role
ORDER BY total DESC;
```

## 🚨 Comandos de Emergencia

### Desactivar Todas las Tiendas
```sql
-- ⚠️ USAR CON PRECAUCIÓN
UPDATE public.stores 
SET status = 'inactive' 
WHERE status = 'active';
```

### Reactivar Todas las Tiendas
```sql
UPDATE public.stores 
SET status = 'active' 
WHERE status = 'inactive';
```

### Backup de Perfiles de Usuario
```sql
-- Crear tabla de backup
CREATE TABLE user_profiles_backup AS 
SELECT * FROM public.user_profiles;
```

### Restaurar desde Backup
```sql
-- ⚠️ USAR CON PRECAUCIÓN
TRUNCATE public.user_profiles;
INSERT INTO public.user_profiles 
SELECT * FROM user_profiles_backup;
```

## 💡 Tips

### Ver Tamaño de las Tablas
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Ver Índices de una Tabla
```sql
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'user_profiles'
  AND schemaname = 'public';
```

### Verificar Políticas RLS
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 📝 Notas

- Siempre haz backup antes de ejecutar comandos de modificación masiva
- Los comandos de emergencia deben usarse solo cuando sea necesario
- Verifica los resultados con SELECT antes de ejecutar UPDATE o DELETE
- Los logs de actividad son tu mejor amigo para auditoría

---

**¡Guarda este archivo para referencia rápida! 📌**
