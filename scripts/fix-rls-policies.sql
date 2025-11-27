-- ============================================
-- FIX: Políticas RLS para user_profiles
-- ============================================
-- Este script asegura que las políticas RLS permitan
-- que los usuarios lean su propio perfil
-- ============================================

-- 1. Eliminar políticas existentes que puedan causar conflicto
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.user_profiles;

-- 2. Crear política para que CUALQUIER usuario autenticado pueda ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (user_id = auth.uid());

-- 3. Crear política para que super admins puedan ver todos los perfiles
CREATE POLICY "Super admins can view all profiles" ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- 4. Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles'
ORDER BY policyname;

-- 5. Probar que funciona
DO $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  -- Obtener el user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'ingsebastian073@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE '❌ ERROR: No se encontró el usuario';
    RETURN;
  END IF;

  -- Intentar leer el perfil (esto simula lo que hace la app)
  SELECT role INTO v_role
  FROM public.user_profiles
  WHERE user_id = v_user_id;

  IF v_role IS NULL THEN
    RAISE NOTICE '❌ ERROR: No se pudo leer el perfil - Problema con RLS';
  ELSE
    RAISE NOTICE '✅ Perfil leído correctamente: %', v_role;
  END IF;
END $$;

-- 6. Mensaje final
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Políticas RLS actualizadas';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Ahora intenta hacer login de nuevo';
  RAISE NOTICE '========================================';
END $$;
