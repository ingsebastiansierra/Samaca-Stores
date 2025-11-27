-- ============================================
-- DESHABILITAR RLS EN TODAS LAS TABLAS NECESARIAS
-- ============================================

-- Deshabilitar RLS en user_profiles (ya está deshabilitado)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en stores
ALTER TABLE public.stores DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en quotations
ALTER TABLE public.quotations DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en products
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en store_stats
ALTER TABLE public.store_stats DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en activity_logs
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;

-- Verificar que se deshabilitaron
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'stores', 'quotations', 'products', 'store_stats', 'activity_logs')
ORDER BY tablename;

-- Mensaje final
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ RLS DESHABILITADO EN TODAS LAS TABLAS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Ahora el super admin puede leer todos los datos';
  RAISE NOTICE '========================================';
END $$;
