-- ============================================
-- ARREGLAR RECURSIÓN INFINITA EN RLS
-- ============================================

-- El problema es que las políticas de super_admin consultan user_profiles
-- dentro de user_profiles, causando recursión infinita.
-- Solución: Usar una función que use SECURITY DEFINER

-- 1. Crear función para verificar si es super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
END;
$$;

-- 2. Eliminar todas las políticas existentes de user_profiles
DROP POLICY IF EXISTS "super_admin_all_user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "users_own_profile" ON public.user_profiles;

-- 3. Crear nuevas políticas sin recursión
-- Permitir que todos los usuarios autenticados lean cualquier perfil
-- (necesario para que el middleware funcione)
CREATE POLICY "authenticated_read_profiles" ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "users_update_own_profile" ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Super admins pueden actualizar cualquier perfil
CREATE POLICY "super_admin_update_profiles" ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin());

-- Super admins pueden insertar perfiles
CREATE POLICY "super_admin_insert_profiles" ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

-- Super admins pueden eliminar perfiles
CREATE POLICY "super_admin_delete_profiles" ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- 4. Actualizar políticas de otras tablas para usar la función
-- STORES
DROP POLICY IF EXISTS "super_admin_all_stores" ON public.stores;
CREATE POLICY "super_admin_all_stores" ON public.stores
  FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- PRODUCTS
DROP POLICY IF EXISTS "super_admin_all_products" ON public.products;
CREATE POLICY "super_admin_all_products" ON public.products
  FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- QUOTATIONS
DROP POLICY IF EXISTS "super_admin_all_quotations" ON public.quotations;
CREATE POLICY "super_admin_all_quotations" ON public.quotations
  FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- ORDERS
DROP POLICY IF EXISTS "super_admin_all_orders" ON public.orders;
CREATE POLICY "super_admin_all_orders" ON public.orders
  FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- CATEGORIES
DROP POLICY IF EXISTS "super_admin_all_categories" ON public.categories;
CREATE POLICY "super_admin_all_categories" ON public.categories
  FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- STORE_STATS
DROP POLICY IF EXISTS "super_admin_all_stats" ON public.store_stats;
CREATE POLICY "super_admin_all_stats" ON public.store_stats
  FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- ACTIVITY_LOGS
DROP POLICY IF EXISTS "super_admin_all_logs" ON public.activity_logs;
CREATE POLICY "super_admin_all_logs" ON public.activity_logs
  FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- INVENTORY_LOGS
DROP POLICY IF EXISTS "super_admin_all_inventory_logs" ON public.inventory_logs;
CREATE POLICY "super_admin_all_inventory_logs" ON public.inventory_logs
  FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- PROMOTIONS
DROP POLICY IF EXISTS "super_admin_all_promotions" ON public.promotions;
CREATE POLICY "super_admin_all_promotions" ON public.promotions
  FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- 5. Verificar que se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_profiles'
ORDER BY policyname;

-- 6. Probar la función
SELECT 
  'TEST: is_super_admin()' as test,
  public.is_super_admin() as resultado,
  auth.uid() as user_id;

-- 7. Mensaje final
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ RECURSIÓN INFINITA ARREGLADA';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Ahora las políticas usan una función SECURITY DEFINER';
  RAISE NOTICE 'Esto evita la recursión infinita';
  RAISE NOTICE '========================================';
END $$;
