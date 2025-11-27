-- ============================================
-- RLS SIMPLE Y FUNCIONAL - VERSIÓN FINAL
-- ============================================

-- Estrategia: Permitir lectura amplia, restringir escritura

-- ============================================
-- 1. USER_PROFILES - Todos pueden leer, solo dueño puede editar
-- ============================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "super_admin_update_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "super_admin_insert_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "super_admin_delete_profiles" ON public.user_profiles;

-- Todos los autenticados pueden leer todos los perfiles
CREATE POLICY "all_authenticated_read_profiles" ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Todos pueden actualizar su propio perfil
CREATE POLICY "users_update_own" ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Todos pueden insertar (para registro)
CREATE POLICY "users_insert_own" ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- 2. STORES - Lectura amplia, escritura restringida
-- ============================================
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin_all_stores" ON public.stores;
DROP POLICY IF EXISTS "store_admin_own_store" ON public.stores;
DROP POLICY IF EXISTS "users_view_active_stores" ON public.stores;
DROP POLICY IF EXISTS "anon_view_active_stores" ON public.stores;

-- Todos pueden leer todas las tiendas
CREATE POLICY "all_read_stores" ON public.stores
  FOR SELECT
  USING (true);

-- Solo el dueño puede actualizar su tienda
CREATE POLICY "owner_update_store" ON public.stores
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- 3. PRODUCTS - Lectura amplia
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin_all_products" ON public.products;
DROP POLICY IF EXISTS "store_admin_own_products" ON public.products;
DROP POLICY IF EXISTS "users_view_active_products" ON public.products;
DROP POLICY IF EXISTS "anon_view_active_products" ON public.products;

-- Todos pueden leer todos los productos
CREATE POLICY "all_read_products" ON public.products
  FOR SELECT
  USING (true);

-- Solo el dueño de la tienda puede modificar productos
CREATE POLICY "store_owner_manage_products" ON public.products
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 4. QUOTATIONS - Lectura amplia
-- ============================================
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin_all_quotations" ON public.quotations;
DROP POLICY IF EXISTS "store_admin_own_quotations" ON public.quotations;
DROP POLICY IF EXISTS "users_own_quotations" ON public.quotations;

-- Todos los autenticados pueden leer todas las cotizaciones
CREATE POLICY "all_authenticated_read_quotations" ON public.quotations
  FOR SELECT
  TO authenticated
  USING (true);

-- Usuarios pueden crear sus propias cotizaciones
CREATE POLICY "users_create_quotations" ON public.quotations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Dueños de tienda pueden actualizar cotizaciones de su tienda
CREATE POLICY "store_owner_update_quotations" ON public.quotations
  FOR UPDATE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 5. ORDERS - Lectura amplia
-- ============================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin_all_orders" ON public.orders;
DROP POLICY IF EXISTS "store_admin_own_orders" ON public.orders;
DROP POLICY IF EXISTS "users_own_orders" ON public.orders;

-- Todos los autenticados pueden leer todos los pedidos
CREATE POLICY "all_authenticated_read_orders" ON public.orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Dueños de tienda pueden gestionar pedidos de su tienda
CREATE POLICY "store_owner_manage_orders" ON public.orders
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 6. CATEGORIES - Lectura amplia
-- ============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin_all_categories" ON public.categories;
DROP POLICY IF EXISTS "store_admin_own_categories" ON public.categories;
DROP POLICY IF EXISTS "users_view_active_categories" ON public.categories;
DROP POLICY IF EXISTS "anon_view_active_categories" ON public.categories;

-- Todos pueden leer todas las categorías
CREATE POLICY "all_read_categories" ON public.categories
  FOR SELECT
  USING (true);

-- Dueños de tienda pueden gestionar categorías de su tienda
CREATE POLICY "store_owner_manage_categories" ON public.categories
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 7. STORE_STATS - Lectura amplia
-- ============================================
ALTER TABLE public.store_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin_all_stats" ON public.store_stats;
DROP POLICY IF EXISTS "store_admin_own_stats" ON public.store_stats;

-- Todos los autenticados pueden leer todas las estadísticas
CREATE POLICY "all_authenticated_read_stats" ON public.store_stats
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 8. ACTIVITY_LOGS - Lectura amplia
-- ============================================
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin_all_logs" ON public.activity_logs;
DROP POLICY IF EXISTS "store_admin_own_logs" ON public.activity_logs;

-- Todos los autenticados pueden leer todos los logs
CREATE POLICY "all_authenticated_read_logs" ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 9. INVENTORY_LOGS - Lectura amplia
-- ============================================
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin_all_inventory_logs" ON public.inventory_logs;
DROP POLICY IF EXISTS "store_admin_own_inventory_logs" ON public.inventory_logs;

-- Todos los autenticados pueden leer todos los logs de inventario
CREATE POLICY "all_authenticated_read_inventory_logs" ON public.inventory_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Dueños de tienda pueden gestionar logs de su tienda
CREATE POLICY "store_owner_manage_inventory_logs" ON public.inventory_logs
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 10. PROMOTIONS - Lectura amplia
-- ============================================
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin_all_promotions" ON public.promotions;
DROP POLICY IF EXISTS "store_admin_own_promotions" ON public.promotions;
DROP POLICY IF EXISTS "users_view_active_promotions" ON public.promotions;
DROP POLICY IF EXISTS "anon_view_active_promotions" ON public.promotions;

-- Todos pueden leer todas las promociones
CREATE POLICY "all_read_promotions" ON public.promotions
  FOR SELECT
  USING (true);

-- Dueños de tienda pueden gestionar promociones de su tienda
CREATE POLICY "store_owner_manage_promotions" ON public.promotions
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- VERIFICAR
-- ============================================
SELECT 
  tablename,
  COUNT(*) as num_policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ============================================
-- MENSAJE FINAL
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ RLS CONFIGURADO - VERSIÓN SIMPLE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Lectura: Amplia para todos los autenticados';
  RAISE NOTICE 'Escritura: Solo dueños de tienda';
  RAISE NOTICE 'Sin recursión infinita';
  RAISE NOTICE '========================================';
END $$;
