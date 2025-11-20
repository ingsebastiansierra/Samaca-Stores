-- Ver todas las políticas actuales en products
SELECT 
  'PRODUCTS POLICIES' as info,
  policyname,
  cmd,
  roles,
  permissive,
  qual as using_clause,
  with_check
FROM pg_policies
WHERE tablename = 'products'
ORDER BY policyname;

-- Ver todas las políticas actuales en stores
SELECT 
  'STORES POLICIES' as info,
  policyname,
  cmd,
  roles,
  permissive,
  qual as using_clause,
  with_check
FROM pg_policies
WHERE tablename = 'stores'
ORDER BY policyname;

-- Verificar si hay políticas duplicadas
SELECT 
  'DUPLICATED POLICIES' as info,
  tablename,
  policyname,
  COUNT(*) as count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename, policyname
HAVING COUNT(*) > 1;
