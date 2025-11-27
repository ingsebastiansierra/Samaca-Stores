-- ============================================
-- FIX SIMPLE: Deshabilitar RLS temporalmente
-- ============================================

-- Opción 1: Deshabilitar RLS completamente (MÁS SIMPLE)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Verificar
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';

-- Probar que funciona
DO $$
DECLARE
  v_user_id UUID := '959b6a5a-0087-4f10-9496-f1db2c906d9e';
  v_role TEXT;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PROBANDO LECTURA SIN RLS';
  RAISE NOTICE '========================================';

  SELECT role INTO v_role
  FROM public.user_profiles
  WHERE user_id = v_user_id;

  IF v_role IS NULL THEN
    RAISE NOTICE '❌ ERROR: No se pudo leer el perfil';
  ELSE
    RAISE NOTICE '✅ Perfil leído correctamente';
    RAISE NOTICE '✅ Rol: %', v_role;
    RAISE NOTICE '✅✅✅ AHORA LA APP DEBERÍA FUNCIONAR';
  END IF;
  RAISE NOTICE '========================================';
END $$;
