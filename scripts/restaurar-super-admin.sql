-- ============================================
-- RESTAURAR ROL DE SUPER ADMIN
-- ============================================

-- Restaurar el rol de super_admin
UPDATE public.user_profiles
SET role = 'super_admin'
WHERE email = 'ingsebastian073@gmail.com';

-- Verificar que se restauró
SELECT 
  'ROL RESTAURADO' as resultado,
  email,
  full_name,
  role,
  profession
FROM public.user_profiles
WHERE email = 'ingsebastian073@gmail.com';

-- Mensaje
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ROL RESTAURADO A SUPER_ADMIN';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: ingsebastian073@gmail.com';
  RAISE NOTICE 'Rol: super_admin';
  RAISE NOTICE '========================================';
END $$;
