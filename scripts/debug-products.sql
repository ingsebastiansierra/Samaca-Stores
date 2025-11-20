-- Script de diagnóstico para verificar productos y relaciones

-- 1. Verificar usuarios autenticados
SELECT 
  'Usuarios' as tabla,
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Verificar tiendas y sus relaciones con usuarios
SELECT 
  'Tiendas' as tabla,
  s.id,
  s.name,
  s.slug,
  s.user_id,
  u.email as user_email,
  s.created_at
FROM stores s
LEFT JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- 3. Verificar productos y sus relaciones
SELECT 
  'Productos' as tabla,
  p.id,
  p.name,
  p.price,
  p.stock,
  p.store_id,
  s.name as store_name,
  s.user_id as store_user_id,
  p.category_id,
  c.name as category_name,
  p.is_active,
  p.created_at
FROM products p
LEFT JOIN stores s ON p.store_id = s.id
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.created_at DESC;

-- 4. Verificar categorías
SELECT 
  'Categorías' as tabla,
  id,
  name,
  slug,
  store_id,
  created_at
FROM categories
ORDER BY created_at DESC;

-- 5. Contar registros por tabla
SELECT 'Total Usuarios' as metrica, COUNT(*) as cantidad FROM auth.users
UNION ALL
SELECT 'Total Tiendas', COUNT(*) FROM stores
UNION ALL
SELECT 'Total Productos', COUNT(*) FROM products
UNION ALL
SELECT 'Total Categorías', COUNT(*) FROM categories
UNION ALL
SELECT 'Productos Activos', COUNT(*) FROM products WHERE is_active = true
UNION ALL
SELECT 'Productos con Stock', COUNT(*) FROM products WHERE stock > 0;

-- 6. Verificar productos por tienda
SELECT 
  s.name as tienda,
  s.id as tienda_id,
  COUNT(p.id) as total_productos,
  COUNT(CASE WHEN p.is_active THEN 1 END) as productos_activos,
  SUM(p.stock) as stock_total
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.id, s.name
ORDER BY s.name;

-- 7. Verificar políticas RLS en products
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'products';
