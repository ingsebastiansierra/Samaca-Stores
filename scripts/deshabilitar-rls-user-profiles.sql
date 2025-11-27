-- ============================================
-- DESHABILITAR RLS EN USER_PROFILES
-- ============================================
-- Los perfiles de usuario no contienen información sensible
-- y necesitan ser leídos por el servidor para verificar roles

ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Verificar
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';

-- Mensaje
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ RLS DESHABILITADO EN USER_PROFILES';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Ahora el servidor puede leer los perfiles';
  RAISE NOTICE 'Las demás tablas mantienen RLS activo';
  RAISE NOTICE '========================================';
END $$;
