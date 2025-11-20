-- =====================================================
-- Verificar TODOS los usuarios y sus tiendas
-- =====================================================

-- 1. Ver TODOS los usuarios registrados
SELECT 
  '1. TODOS LOS USUARIOS' as seccion,
  u.id as user_id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ No confirmado'
  END as estado
FROM auth.users u
ORDER BY u.created_at DESC;

-- 2. Ver TODAS las tiendas y sus dueños
SELECT 
  '2. TODAS LAS TIENDAS Y SUS DUEÑOS' as seccion,
  s.id as store_id,
  s.name as store_name,
  s.slug as store_slug,
  s.status as store_status,
  s.user_id as owner_user_id,
  u.email as owner_email,
  s.created_at as store_created_at
FROM stores s
LEFT JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- 3. Verificar vegasebastian073@gmail.com específicamente
SELECT 
  '3. USUARIO vegasebastian073@gmail.com' as seccion,
  u.id as user_id,
  u.email,
  s.id as store_id,
  s.name as store_name,
  s.slug as store_slug,
  (SELECT COUNT(*) FROM products WHERE store_id = s.id) as total_productos
FROM auth.users u
LEFT JOIN stores s ON s.user_id = u.id
WHERE u.email = 'vegasebastian073@gmail.com';

-- 4. Verificar el usuario con ID: 4e5e7cd0-410b-4e0f-926a-27d69782c380
SELECT 
  '4. USUARIO CON ID 4e5e7cd0-410b-4e0f-926a-27d69782c380' as seccion,
  u.id as user_id,
  u.email,
  s.id as store_id,
  s.name as store_name,
  s.slug as store_slug,
  (SELECT COUNT(*) FROM products WHERE store_id = s.id) as total_productos
FROM auth.users u
LEFT JOIN stores s ON s.user_id = u.id
WHERE u.id = '4e5e7cd0-410b-4e0f-926a-27d69782c380';

-- 5. Ver la tienda con ID: de3bfbdd-4f31-4e49-9a83-048a124aff04
SELECT 
  '5. TIENDA de3bfbdd-4f31-4e49-9a83-048a124aff04' as seccion,
  s.id as store_id,
  s.name as store_name,
  s.slug as store_slug,
  s.user_id as owner_user_id,
  u.email as owner_email,
  (SELECT COUNT(*) FROM products WHERE store_id = s.id) as total_productos
FROM stores s
LEFT JOIN auth.users u ON s.user_id = u.id
WHERE s.id = 'de3bfbdd-4f31-4e49-9a83-048a124aff04';

-- 6. Ver productos por tienda
SELECT 
  '6. PRODUCTOS POR TIENDA' as seccion,
  s.name as tienda,
  s.id as store_id,
  u.email as owner_email,
  COUNT(p.id) as total_productos,
  COUNT(CASE WHEN p.is_active THEN 1 END) as productos_activos
FROM stores s
LEFT JOIN auth.users u ON s.user_id = u.id
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.id, s.name, u.email
ORDER BY s.name;

-- 7. Verificar si hay usuarios sin tienda
SELECT 
  '7. USUARIOS SIN TIENDA' as seccion,
  u.id as user_id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN stores s ON s.user_id = u.id
WHERE s.id IS NULL
ORDER BY u.created_at DESC;

-- 8. Verificar si hay tiendas sin dueño
SELECT 
  '8. TIENDAS SIN DUEÑO' as seccion,
  s.id as store_id,
  s.name as store_name,
  s.user_id as user_id_invalido
FROM stores s
LEFT JOIN auth.users u ON s.user_id = u.id
WHERE u.id IS NULL;

-- RESUMEN FINAL
SELECT 
  'RESUMEN GENERAL' as seccion,
  (SELECT COUNT(*) FROM auth.users) as total_usuarios,
  (SELECT COUNT(*) FROM stores) as total_tiendas,
  (SELECT COUNT(*) FROM products) as total_productos,
  (SELECT COUNT(*) FROM auth.users WHERE id NOT IN (SELECT user_id FROM stores WHERE user_id IS NOT NULL)) as usuarios_sin_tienda;
