-- ============================================
-- AGREGAR CAMPO IS_ACTIVE A USER_PROFILES
-- ============================================

-- Agregar campo is_active
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Actualizar usuarios existentes a activos
UPDATE public.user_profiles 
SET is_active = true 
WHERE is_active IS NULL;

-- Verificar
SELECT 
  email,
  full_name,
  role,
  is_active,
  CASE 
    WHEN is_active THEN '✅ Activo'
    ELSE '❌ Inactivo'
  END as estado
FROM public.user_profiles
ORDER BY role, email;

-- Mensaje
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ CAMPO IS_ACTIVE AGREGADO';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Ahora puedes habilitar/deshabilitar usuarios';
  RAISE NOTICE 'Todos los usuarios existentes están activos';
  RAISE NOTICE '========================================';
END $$;
