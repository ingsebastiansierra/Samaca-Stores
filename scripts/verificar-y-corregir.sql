-- ============================================
-- VERIFICAR Y CORREGIR PERFIL SUPER ADMIN
-- ============================================

-- 1. Ver tu usuario actual
SELECT 
  '1. USUARIO EN AUTH' as paso,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'ingsebastian073@gmail.com';

-- 2. Ver tu perfil actual
SELECT 
  '2. PERFIL ACTUAL' as paso,
  id,
  user_id,
  email,
  full_name,
  role,
  profession
FROM public.user_profiles 
WHERE email = 'ingsebastian073@gmail.com';

-- 3. FORZAR actualización del perfil
UPDATE public.user_profiles
SET 
  role = 'super_admin',
  full_name = 'Sebastian Sierra Pineda',
  profession = 'Ingeniero de Sistemas',
  updated_at = NOW()
WHERE email = 'ingsebastian073@gmail.com';

-- 4. Verificar que se actualizó
SELECT 
  '3. PERFIL ACTUALIZADO' as paso,
  user_id,
  email,
  full_name,
  role,
  profession,
  updated_at
FROM public.user_profiles 
WHERE email = 'ingsebastian073@gmail.com';

-- 5. Probar consulta como lo hace la app
DO $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  -- Obtener user_id
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'ingsebastian073@gmail.com';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'User ID: %', v_user_id;

  -- Consultar rol (como lo hace getUserRole)
  SELECT role INTO v_role
  FROM public.user_profiles
  WHERE user_id = v_user_id;

  RAISE NOTICE 'Rol encontrado: %', v_role;

  IF v_role = 'super_admin' THEN
    RAISE NOTICE '✅✅✅ PERFECTO - Eres super_admin';
    RAISE NOTICE 'Deberías ser redirigido a: /super-admin/dashboard';
  ELSE
    RAISE NOTICE '❌ ERROR - El rol no es super_admin';
  END IF;
  
  RAISE NOTICE '========================================';
END $$;

-- 6. Resultado final
SELECT 
  CASE 
    WHEN role = 'super_admin' THEN '✅ TODO CORRECTO'
    ELSE '❌ PROBLEMA CON EL ROL'
  END as estado,
  email,
  role,
  full_name
FROM public.user_profiles 
WHERE email = 'ingsebastian073@gmail.com';
