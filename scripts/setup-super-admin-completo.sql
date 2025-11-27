-- ============================================
-- SCRIPT COMPLETO DE CONFIGURACIÓN SUPER ADMIN
-- ============================================
-- Ejecuta este script COMPLETO en Supabase SQL Editor
-- ============================================

-- PASO 1: Verificar que las tablas existen
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
    RAISE EXCEPTION 'ERROR: La tabla user_profiles no existe. Ejecuta primero la migración 20241127_super_admin.sql';
  END IF;
  RAISE NOTICE 'OK: Tabla user_profiles existe';
END $$;

-- PASO 2: Buscar tu usuario
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'ingsebastian073@gmail.com';
BEGIN
  -- Buscar el usuario en auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'ERROR: No se encontró el usuario con email %. Créalo primero en Authentication > Users', v_email;
  END IF;

  RAISE NOTICE 'OK: Usuario encontrado con UUID: %', v_user_id;

  -- PASO 3: Crear o actualizar el perfil de super admin
  INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
  VALUES (
    v_user_id,
    v_email,
    'Sebastian Sierra Pineda',
    'super_admin',
    'Ingeniero de Sistemas'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    role = 'super_admin',
    full_name = 'Sebastian Sierra Pineda',
    profession = 'Ingeniero de Sistemas',
    updated_at = NOW();

  RAISE NOTICE 'OK: Perfil de super admin creado/actualizado correctamente';
END $$;

-- PASO 4: Verificar que todo está correcto
SELECT 
  'VERIFICACIÓN FINAL' as paso,
  up.email,
  up.full_name,
  up.role,
  up.profession,
  CASE 
    WHEN up.role = 'super_admin' THEN '✅ CORRECTO'
    ELSE '❌ ERROR: El rol no es super_admin'
  END as estado
FROM public.user_profiles up
WHERE up.email = 'ingsebastian073@gmail.com';

-- PASO 5: Mostrar instrucciones finales
DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE '✅ CONFIGURACIÓN COMPLETADA';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Ahora puedes:';
  RAISE NOTICE '1. Ir a tu aplicación: http://localhost:3000';
  RAISE NOTICE '2. Iniciar sesión con: ingsebastian073@gmail.com';
  RAISE NOTICE '3. Serás redirigido a: /super-admin/dashboard';
  RAISE NOTICE '============================================';
END $$;
