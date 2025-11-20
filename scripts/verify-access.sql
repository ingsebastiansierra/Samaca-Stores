-- =====================================================
-- VERIFICAR ACCESO DEL USUARIO A SU TIENDA
-- =====================================================

-- 1. Ver información del usuario y su tienda
SELECT 
  u.id as user_id,
  u.email,
  s.id as store_id,
  s.name as store_name,
  s.slug,
  s.status
FROM auth.users u
LEFT JOIN stores s ON s.user_id = u.id
WHERE u.email = 'vegasebastian073@gmail.com';

-- 2. Verificar políticas RLS en stores
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
AND tablename = 'stores'
ORDER BY policyname;

-- 3. Verificar que RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Habilitado"
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'stores';

-- 4. Probar query directa (simular lo que hace el dashboard)
-- Nota: Esto solo funciona si ejecutas como el usuario autenticado
SELECT 
  id,
  name,
  slug,
  status,
  user_id
FROM stores
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'vegasebastian073@gmail.com'
);

-- =====================================================
-- Si la query anterior no devuelve resultados,
-- el problema es con las políticas RLS
-- =====================================================
