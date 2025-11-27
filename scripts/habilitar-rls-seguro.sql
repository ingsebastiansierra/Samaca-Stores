-- ============================================
-- HABILITAR RLS CON POLÍTICAS SEGURAS
-- ============================================

-- ============================================
-- 1. USER_PROFILES
-- ============================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver y editar todo
CREATE POLICY "super_admin_all_user_profiles" ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Usuarios pueden ver y editar su propio perfil
CREATE POLICY "users_own_profile" ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- 2. STORES
-- ============================================
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver y editar todas las tiendas
CREATE POLICY "super_admin_all_stores" ON public.stores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Store admins pueden ver y editar su tienda
CREATE POLICY "store_admin_own_store" ON public.stores
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Usuarios pueden ver tiendas activas (para comprar)
CREATE POLICY "users_view_active_stores" ON public.stores
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Usuarios anónimos pueden ver tiendas activas
CREATE POLICY "anon_view_active_stores" ON public.stores
  FOR SELECT
  TO anon
  USING (status = 'active');

-- ============================================
-- 3. PRODUCTS
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver y editar todos los productos
CREATE POLICY "super_admin_all_products" ON public.products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Store admins pueden ver y editar productos de su tienda
CREATE POLICY "store_admin_own_products" ON public.products
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- Usuarios pueden ver productos activos
CREATE POLICY "users_view_active_products" ON public.products
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Usuarios anónimos pueden ver productos activos
CREATE POLICY "anon_view_active_products" ON public.products
  FOR SELECT
  TO anon
  USING (is_active = true);

-- ============================================
-- 4. QUOTATIONS
-- ============================================
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver todas las cotizaciones
CREATE POLICY "super_admin_all_quotations" ON public.quotations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Store admins pueden ver cotizaciones de su tienda
CREATE POLICY "store_admin_own_quotations" ON public.quotations
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- Usuarios pueden ver y crear sus propias cotizaciones
CREATE POLICY "users_own_quotations" ON public.quotations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- 5. ORDERS
-- ============================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver todos los pedidos
CREATE POLICY "super_admin_all_orders" ON public.orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Store admins pueden ver pedidos de su tienda
CREATE POLICY "store_admin_own_orders" ON public.orders
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- Usuarios pueden ver sus propios pedidos
CREATE POLICY "users_own_orders" ON public.orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- 6. CATEGORIES
-- ============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver y editar todas las categorías
CREATE POLICY "super_admin_all_categories" ON public.categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Store admins pueden ver y editar categorías de su tienda
CREATE POLICY "store_admin_own_categories" ON public.categories
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- Usuarios pueden ver categorías activas
CREATE POLICY "users_view_active_categories" ON public.categories
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Usuarios anónimos pueden ver categorías activas
CREATE POLICY "anon_view_active_categories" ON public.categories
  FOR SELECT
  TO anon
  USING (is_active = true);

-- ============================================
-- 7. STORE_STATS
-- ============================================
ALTER TABLE public.store_stats ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver todas las estadísticas
CREATE POLICY "super_admin_all_stats" ON public.store_stats
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Store admins pueden ver estadísticas de su tienda
CREATE POLICY "store_admin_own_stats" ON public.store_stats
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 8. ACTIVITY_LOGS
-- ============================================
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver todos los logs
CREATE POLICY "super_admin_all_logs" ON public.activity_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Store admins pueden ver logs de su tienda
CREATE POLICY "store_admin_own_logs" ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 9. INVENTORY_LOGS
-- ============================================
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver todos los logs de inventario
CREATE POLICY "super_admin_all_inventory_logs" ON public.inventory_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Store admins pueden ver logs de inventario de su tienda
CREATE POLICY "store_admin_own_inventory_logs" ON public.inventory_logs
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 10. PROMOTIONS
-- ============================================
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver y editar todas las promociones
CREATE POLICY "super_admin_all_promotions" ON public.promotions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Store admins pueden ver y editar promociones de su tienda
CREATE POLICY "store_admin_own_promotions" ON public.promotions
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- Usuarios pueden ver promociones activas
CREATE POLICY "users_view_active_promotions" ON public.promotions
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Usuarios anónimos pueden ver promociones activas
CREATE POLICY "anon_view_active_promotions" ON public.promotions
  FOR SELECT
  TO anon
  USING (active = true);

-- ============================================
-- VERIFICAR QUE SE HABILITARON
-- ============================================
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'stores', 'products', 'quotations', 'orders',
    'categories', 'store_stats', 'activity_logs', 'inventory_logs', 'promotions'
  )
ORDER BY tablename;

-- ============================================
-- MENSAJE FINAL
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ RLS HABILITADO CON POLÍTICAS SEGURAS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Super admins: Acceso total';
  RAISE NOTICE 'Store admins: Solo su tienda';
  RAISE NOTICE 'Users: Solo sus datos';
  RAISE NOTICE 'Anon: Solo contenido público';
  RAISE NOTICE '========================================';
END $$;
