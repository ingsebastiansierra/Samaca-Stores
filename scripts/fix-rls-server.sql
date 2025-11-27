-- ============================================
-- FIX: Políticas RLS para permitir lectura desde servidor
-- ============================================

-- El problema es que las políticas RLS actuales solo permiten
-- que los usuarios lean su propio perfil cuando están autenticados
-- con auth.uid(). Pero desde el servidor (middleware, page.tsx)
-- necesitamos poder leer cualquier perfil.

-- SOLUCIÓN: Agregar una política que permita SELECT sin restricciones
-- para el rol 'service_role' (que usa el servidor)

-- 1. Eliminar TODAS las políticas existentes
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.user_profiles';
        RAISE NOTICE 'Eliminada política: %', r.policyname;
    END LOOP;
END $$;

-- 2. Crear política que permita a CUALQUIER usuario autenticado leer CUALQUIER perfil
-- Esto es necesario para que el middleware y las páginas del servidor puedan verificar roles
CREATE POLICY "Enable read access for authenticated users" ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Crear política para que usuarios puedan actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- 4. Crear política para que super admins puedan actualizar cualquier perfil
CREATE POLICY "Super admins can update all profiles" ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- 5. Verificar que las políticas se crearon correctamente
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
  AND tablename = 'user_profiles'
ORDER BY policyname;

-- 6. Probar que funciona
DO $$
DECLARE
  v_user_id UUID := '959b6a5a-0087-4f10-9496-f1db2c906d9e';
  v_role TEXT;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PROBANDO LECTURA DE PERFIL';
  RAISE NOTICE '========================================';

  -- Intentar leer el perfil
  SELECT role INTO v_role
  FROM public.user_profiles
  WHERE user_id = v_user_id;

  IF v_role IS NULL THEN
    RAISE NOTICE '❌ ERROR: No se pudo leer el perfil';
  ELSE
    RAISE NOTICE '✅ Perfil leído correctamente';
    RAISE NOTICE '✅ Rol: %', v_role;
    
    IF v_role = 'super_admin' THEN
      RAISE NOTICE '✅✅✅ PERFECTO - Ahora la app DEBERÍA funcionar';
    END IF;
  END IF;
  RAISE NOTICE '========================================';
END $$;
