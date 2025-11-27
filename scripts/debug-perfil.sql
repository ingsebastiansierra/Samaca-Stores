-- ============================================
-- DEBUG: Verificar perfil de super admin
-- ============================================

-- 1. Ver TODOS los usuarios en auth.users
SELECT 
  '1. USUARIOS EN AUTH' as paso,
  id,
  email,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 2. Ver TODOS los perfiles en user_profiles
SELECT 
  '2. PERFILES EN USER_PROFILES' as paso,
  id,
  user_id,
  email,
  role,
  full_name
FROM public.user_profiles
ORDER BY created_at DESC;

-- 3. Buscar específicamente tu usuario
SELECT 
  '3. TU USUARIO' as paso,
  au.id as user_id,
  au.email,
  au.email_confirmed_at,
  up.id as profile_id,
  up.role,
  up.full_name
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.user_id
WHERE au.email = 'ingsebastian073@gmail.com';

-- 4. Verificar si el user_id coincide
DO $$
DECLARE
  v_auth_user_id UUID;
  v_profile_user_id UUID;
  v_role TEXT;
BEGIN
  -- Obtener user_id de auth.users
  SELECT id INTO v_auth_user_id
  FROM auth.users
  WHERE email = 'ingsebastian073@gmail.com';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'User ID en auth.users: %', v_auth_user_id;

  -- Obtener user_id de user_profiles
  SELECT user_id, role INTO v_profile_user_id, v_role
  FROM public.user_profiles
  WHERE email = 'ingsebastian073@gmail.com';

  RAISE NOTICE 'User ID en user_profiles: %', v_profile_user_id;
  RAISE NOTICE 'Rol en user_profiles: %', v_role;

  IF v_auth_user_id = v_profile_user_id THEN
    RAISE NOTICE '✅ Los UUIDs COINCIDEN';
  ELSE
    RAISE NOTICE '❌ ERROR: Los UUIDs NO COINCIDEN';
  END IF;

  IF v_role = 'super_admin' THEN
    RAISE NOTICE '✅ El rol es super_admin';
  ELSE
    RAISE NOTICE '❌ ERROR: El rol NO es super_admin, es: %', v_role;
  END IF;
  RAISE NOTICE '========================================';
END $$;

-- 5. Probar la consulta EXACTA que hace la app
DO $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  -- Obtener el user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'ingsebastian073@gmail.com';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'SIMULANDO CONSULTA DE LA APP';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'User ID: %', v_user_id;

  -- Hacer la consulta EXACTA que hace la app
  SELECT role INTO v_role
  FROM public.user_profiles
  WHERE user_id = v_user_id;

  IF v_role IS NULL THEN
    RAISE NOTICE '❌ ERROR: No se encontró el rol (NULL)';
    RAISE NOTICE 'Esto significa que NO hay registro en user_profiles con ese user_id';
  ELSE
    RAISE NOTICE '✅ Rol encontrado: %', v_role;
    
    IF v_role = 'super_admin' THEN
      RAISE NOTICE '✅✅✅ PERFECTO - La app DEBERÍA detectarte como super_admin';
    ELSE
      RAISE NOTICE '❌ ERROR - La app te detectará como: %', v_role;
    END IF;
  END IF;
  RAISE NOTICE '========================================';
END $$;

-- 6. Si hay problema, corregirlo
-- Descomenta y ejecuta esto si el rol no es super_admin:
/*
UPDATE public.user_profiles
SET role = 'super_admin'
WHERE email = 'ingsebastian073@gmail.com';

SELECT 'PERFIL ACTUALIZADO' as resultado, * 
FROM public.user_profiles 
WHERE email = 'ingsebastian073@gmail.com';
*/
