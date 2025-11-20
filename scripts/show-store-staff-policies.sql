-- Ver políticas de store_staff que causan recursión
SELECT 
  policyname,
  cmd,
  qual as using_clause,
  with_check
FROM pg_policies
WHERE tablename = 'store_staff'
ORDER BY policyname;
