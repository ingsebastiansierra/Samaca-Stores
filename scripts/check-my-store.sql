-- =====================================================
-- Verificar tu tienda y crear productos para ella
-- =====================================================

-- PASO 1: Ver todas las tiendas y sus usuarios
SELECT 
  '1. TODAS LAS TIENDAS' as paso,
  s.id as store_id,
  s.name as store_name,
  s.slug,
  u.id as user_id,
  u.email as user_email,
  (SELECT COUNT(*) FROM products WHERE store_id = s.id) as productos_count
FROM stores s
LEFT JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at;

-- PASO 2: Ver productos por tienda
SELECT 
  '2. PRODUCTOS POR TIENDA' as paso,
  s.name as tienda,
  p.id as product_id,
  p.name as product_name,
  p.price,
  p.stock,
  p.is_active
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
ORDER BY s.name, p.created_at DESC;

-- PASO 3: Identificar tu store_id específico
-- Reemplaza 'TU_EMAIL_AQUI' con tu email real
SELECT 
  '3. TU TIENDA' as paso,
  s.id as tu_store_id,
  s.name as tu_store_name,
  u.email as tu_email,
  (SELECT COUNT(*) FROM products WHERE store_id = s.id) as tus_productos
FROM stores s
JOIN auth.users u ON s.user_id = u.id
WHERE s.id = 'de3bfbdd-4f31-4e49-9a83-048a124aff04'; -- Tu store_id del debug

-- PASO 4: Ver si ya tienes productos
SELECT 
  '4. PRODUCTOS EN TU TIENDA' as paso,
  p.*
FROM products p
WHERE p.store_id = 'de3bfbdd-4f31-4e49-9a83-048a124aff04'
ORDER BY p.created_at DESC;
