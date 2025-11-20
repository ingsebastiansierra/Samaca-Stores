-- Ver el detalle completo de todas las tiendas
SELECT 
  s.id as store_id,
  s.name as store_name,
  s.slug as store_slug,
  s.user_id as owner_user_id,
  u.email as owner_email,
  s.status,
  s.created_at,
  (SELECT COUNT(*) FROM products WHERE store_id = s.id) as productos
FROM stores s
LEFT JOIN auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- Ver todos los usuarios
SELECT 
  id as user_id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;
