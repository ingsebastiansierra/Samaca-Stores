-- ============================================
-- SINCRONIZAR USUARIOS DE AUTH CON USER_PROFILES
-- ============================================

-- 1. Ver usuarios en auth.users
SELECT 
  'USUARIOS EN AUTH.USERS' as paso,
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Ver usuarios en user_profiles
SELECT 
  'USUARIOS EN USER_PROFILES' as paso,
  user_id,
  email,
  full_name,
  role
FROM public.user_profiles
ORDER BY created_at DESC;

-- 3. Encontrar usuarios que están en auth pero NO en user_profiles
SELECT 
  'USUARIOS SIN PERFIL' as paso,
  au.id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.user_id
WHERE up.user_id IS NULL;

-- 4. Crear perfiles para usuarios que no tienen
-- Asignar rol 'user' por defecto, excepto si tienen tienda (store_admin)
INSERT INTO public.user_profiles (user_id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.stores WHERE user_id = au.id
    ) THEN 'store_admin'
    ELSE 'user'
  END as role
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.user_id
WHERE up.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 5. Actualizar roles de usuarios que tienen tienda pero no tienen rol store_admin
UPDATE public.user_profiles up
SET role = 'store_admin'
WHERE EXISTS (
  SELECT 1 FROM public.stores s WHERE s.user_id = up.user_id
)
AND up.role = 'user';

-- 6. Verificar resultado final
SELECT 
  'RESUMEN FINAL' as paso,
  role,
  COUNT(*) as total
FROM public.user_profiles
GROUP BY role
ORDER BY role;

-- 7. Ver todos los usuarios con sus roles
SELECT 
  'TODOS LOS USUARIOS' as paso,
  up.email,
  up.full_name,
  up.role,
  CASE 
    WHEN s.id IS NOT NULL THEN 'Sí'
    ELSE 'No'
  END as tiene_tienda
FROM public.user_profiles up
LEFT JOIN public.stores s ON s.user_id = up.user_id
ORDER BY up.role, up.email;

-- 8. Mensaje final
DO $$
DECLARE
  v_total INTEGER;
  v_super_admin INTEGER;
  v_store_admin INTEGER;
  v_user INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total FROM public.user_profiles;
  SELECT COUNT(*) INTO v_super_admin FROM public.user_profiles WHERE role = 'super_admin';
  SELECT COUNT(*) INTO v_store_admin FROM public.user_profiles WHERE role = 'store_admin';
  SELECT COUNT(*) INTO v_user FROM public.user_profiles WHERE role = 'user';

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ USUARIOS SINCRONIZADOS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total usuarios: %', v_total;
  RAISE NOTICE 'Super admins: %', v_super_admin;
  RAISE NOTICE 'Store admins: %', v_store_admin;
  RAISE NOTICE 'Usuarios: %', v_user;
  RAISE NOTICE '========================================';
END $$;
