-- =====================================================
-- Verificar productos y tiendas en la base de datos
-- =====================================================

-- 1. Ver tu usuario actual
SELECT 
  '1. TU USUARIO' as paso,
  auth.uid() as user_id,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as email;

-- 2. Ver tu tienda
SELECT 
  '2. TU TIENDA' as paso,
  id as store_id,
  name as store_name,
  slug,
  user_id,
  status
FROM stores
WHERE user_id = auth.uid();

-- 3. Ver TODAS las tiendas (para comparar)
SELECT 
  '3. TODAS LAS TIENDAS' as paso,
  s.id as store_id,
  s.name as store_name,
  s.slug,
  s.user_id,
  u.email as owner_email,
  s.status,
  (SELECT COUNT(*) FROM products WHERE store_id = s.id) as productos_count
FROM stores s
LEFT JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- 4. Ver TODOS los productos (sin filtro de usuario)
SELECT 
  '4. TODOS LOS PRODUCTOS' as paso,
  p.id,
  p.name,
  p.price,
  p.stock,
  p.is_active,
  p.store_id,
  s.name as store_name,
  s.user_id as store_owner_id,
  (SELECT email FROM auth.users WHERE id = s.user_id) as owner_email
FROM products p
LEFT JOIN stores s ON p.store_id = s.id
ORDER BY p.created_at DESC;

-- 5. Ver productos de tu tienda específicamente
SELECT 
  '5. PRODUCTOS DE TU TIENDA' as paso,
  COUNT(*) as total
FROM products
WHERE store_id IN (SELECT id FROM stores WHERE user_id = auth.uid());

-- 6. Verificar si hay productos huérfanos (sin tienda)
SELECT 
  '6. PRODUCTOS SIN TIENDA' as paso,
  COUNT(*) as total
FROM products
WHERE store_id IS NULL OR store_id NOT IN (SELECT id FROM stores);
