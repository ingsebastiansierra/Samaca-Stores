-- =====================================================
-- TEST: Verificar acceso del admin a productos
-- =====================================================
-- Reemplaza 'tu-email@ejemplo.com' con tu email

-- 1. Verificar usuario y tienda
SELECT 
  '1. USUARIO Y TIENDA' as test,
  u.id as user_id,
  u.email,
  s.id as store_id,
  s.name as store_name,
  s.status as store_status
FROM auth.users u
LEFT JOIN stores s ON s.user_id = u.id
WHERE u.email = 'vegasebastian073@gmail.com'; -- ⚠️ CAMBIA ESTO

-- 2. Contar productos de la tienda (sin RLS)
SELECT 
  '2. PRODUCTOS EN LA TIENDA (sin RLS)' as test,
  COUNT(*) as total
FROM products
WHERE store_id IN (
  SELECT id FROM stores WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'vegasebastian073@gmail.com' -- ⚠️ CAMBIA ESTO
  )
);

-- 3. Ver políticas RLS activas en products
SELECT 
  '3. POLÍTICAS RLS EN PRODUCTS' as test,
  policyname,
  cmd,
  roles,
  CASE 
    WHEN qual IS NOT NULL THEN 'Tiene condición USING'
    ELSE 'Sin condición'
  END as tiene_condicion
FROM pg_policies
WHERE tablename = 'products'
ORDER BY cmd, policyname;

-- 4. Verificar RLS está habilitado
SELECT 
  '4. RLS HABILITADO' as test,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('products', 'categories', 'stores')
ORDER BY tablename;

-- 5. Simular la consulta del admin (como authenticated user)
-- Esta consulta simula lo que hace el admin
WITH user_store AS (
  SELECT id as store_id
  FROM stores
  WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'vegasebastian073@gmal.com' -- ⚠️ CAMBIA ESTO
  )
)
SELECT 
  '5. PRODUCTOS QUE VERÍA EL ADMIN' as test,
  p.id,
  p.name,
  p.price,
  p.stock,
  p.is_active,
  c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.store_id IN (SELECT store_id FROM user_store)
ORDER BY p.created_at DESC;

-- 6. Verificar que las categorías son accesibles
WITH user_store AS (
  SELECT id as store_id
  FROM stores
  WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'vegasebastian073@gmal.com' -- ⚠️ CAMBIA ESTO
  )
)
SELECT 
  '6. CATEGORÍAS ACCESIBLES' as test,
  c.id,
  c.name,
  c.is_active,
  c.store_id
FROM categories c
WHERE c.store_id IN (SELECT store_id FROM user_store);

-- 7. Verificar políticas de categories
SELECT 
  '7. POLÍTICAS RLS EN CATEGORIES' as test,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'categories'
ORDER BY cmd, policyname;
