-- ============================================
-- SCRIPT DE DIAGNÓSTICO - LOGIN SUPER ADMIN
-- ============================================
-- Ejecuta este script para diagnosticar problemas de login
-- ============================================

-- 1. Verificar que la tabla user_profiles existe
SELECT 
  'PASO 1: Verificar tabla user_profiles' as diagnostico,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'user_profiles'
    ) THEN '✅ La tabla existe'
    ELSE '❌ ERROR: La tabla NO existe - Ejecuta la migración'
  END as resultado;

-- 2. Verificar tu usuario en auth.users
SELECT 
  'PASO 2: Usuario en auth.users' as diagnostico,
  CASE 
    WHEN EXISTS (
      SELECT FROM auth.users 
      WHERE email = 'ingsebastian073@gmail.com'
    ) THEN '✅ Usuario existe en auth'
    ELSE '❌ ERROR: Usuario NO existe - Créalo en Authentication'
  END as resultado;

-- 3. Ver detalles de tu usuario
SELECT 
  'PASO 3: Detalles del usuario' as diagnostico,
  id as user_id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'ingsebastian073@gmail.com';

-- 4. Verificar tu perfil en user_profiles
SELECT 
  'PASO 4: Perfil en user_profiles' as diagnostico,
  CASE 
    WHEN EXISTS (
      SELECT FROM public.user_profiles 
      WHERE email = 'ingsebastian073@gmail.com'
    ) THEN '✅ Perfil existe'
    ELSE '❌ ERROR: Perfil NO existe - Ejecuta setup-super-admin-completo.sql'
  END as resultado;

-- 5. Ver detalles de tu perfil
SELECT 
  'PASO 5: Detalles del perfil' as diagnostico,
  user_id,
  email,
  full_name,
  role,
  profession,
  created_at
FROM public.user_profiles 
WHERE email = 'ingsebastian073@gmail.com';

-- 6. Verificar que el rol es super_admin
SELECT 
  'PASO 6: Verificar rol' as diagnostico,
  role,
  CASE 
    WHEN role = 'super_admin' THEN '✅ Rol correcto'
    ELSE '❌ ERROR: Rol incorrecto - Debe ser super_admin'
  END as resultado
FROM public.user_profiles 
WHERE email = 'ingsebastian073@gmail.com';

-- 7. Verificar políticas RLS
SELECT 
  'PASO 7: Políticas RLS' as diagnostico,
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles'
ORDER BY policyname;

-- 8. Probar consulta de rol (simular lo que hace la app)
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

  RAISE NOTICE '✅ User ID encontrado: %', v_user_id;

  -- Intentar obtener el rol
  SELECT role INTO v_role
  FROM public.user_profiles
  WHERE user_id = v_user_id;

  IF v_role IS NULL THEN
    RAISE NOTICE '❌ ERROR: No se encontró el rol';
  ELSE
    RAISE NOTICE '✅ Rol encontrado: %', v_role;
    
    IF v_role = 'super_admin' THEN
      RAISE NOTICE '✅✅✅ TODO CORRECTO - Deberías poder iniciar sesión';
    ELSE
      RAISE NOTICE '❌ ERROR: El rol no es super_admin, es: %', v_role;
    END IF;
  END IF;
END $$;

-- 9. Resumen final
SELECT 
  '========================================' as resumen,
  'RESUMEN FINAL' as titulo,
  '========================================' as separador;

SELECT 
  CASE 
    WHEN COUNT(*) > 0 AND MAX(role) = 'super_admin' 
    THEN '✅✅✅ TODO ESTÁ CONFIGURADO CORRECTAMENTE'
    ELSE '❌ HAY PROBLEMAS - Revisa los pasos anteriores'
  END as estado_final
FROM public.user_profiles 
WHERE email = 'ingsebastian073@gmail.com';

-- 10. Instrucciones si hay problemas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM public.user_profiles 
    WHERE email = 'ingsebastian073@gmail.com' 
    AND role = 'super_admin'
  ) THEN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SOLUCIÓN: Ejecuta este comando:';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'UPDATE public.user_profiles';
    RAISE NOTICE 'SET role = ''super_admin''';
    RAISE NOTICE 'WHERE email = ''ingsebastian073@gmail.com'';';
    RAISE NOTICE '========================================';
  END IF;
END $$;
