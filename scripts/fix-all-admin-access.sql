-- =====================================================
-- SCRIPT MAESTRO: Corregir acceso completo del admin
-- =====================================================
-- Este script corrige todas las políticas RLS para que
-- el admin pueda ver y gestionar todos sus recursos

-- =====================================================
-- PARTE 1: PRODUCTOS
-- =====================================================

-- Eliminar TODAS las políticas existentes de products
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'products' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON products', pol.policyname);
    END LOOP;
END $$;

-- Crear políticas correctas para productos
CREATE POLICY "public_view_active_products"
ON products FOR SELECT TO public
USING (is_active = true AND store_id IN (SELECT id FROM stores WHERE status = 'active'));

CREATE POLICY "owner_view_all_products"
ON products FOR SELECT TO authenticated
USING (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()));

CREATE POLICY "staff_view_store_products"
ON products FOR SELECT TO authenticated
USING (store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "owner_staff_insert_products"
ON products FOR INSERT TO authenticated
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "owner_staff_update_products"
ON products FOR UPDATE TO authenticated
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "owner_admin_delete_products"
ON products FOR DELETE TO authenticated
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND is_active = true)
);

-- =====================================================
-- PARTE 2: CATEGORÍAS
-- =====================================================

-- Eliminar TODAS las políticas existentes de categories
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'categories' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON categories', pol.policyname);
    END LOOP;
END $$;

-- Crear políticas correctas para categorías
CREATE POLICY "public_view_active_categories"
ON categories FOR SELECT TO public
USING (is_active = true AND store_id IN (SELECT id FROM stores WHERE status = 'active'));

CREATE POLICY "owner_view_all_categories"
ON categories FOR SELECT TO authenticated
USING (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()));

CREATE POLICY "staff_view_store_categories"
ON categories FOR SELECT TO authenticated
USING (store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "owner_staff_insert_categories"
ON categories FOR INSERT TO authenticated
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "owner_staff_update_categories"
ON categories FOR UPDATE TO authenticated
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "owner_staff_delete_categories"
ON categories FOR DELETE TO authenticated
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true)
);

-- =====================================================
-- PARTE 3: ÓRDENES
-- =====================================================

-- Eliminar TODAS las políticas existentes de orders
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'orders' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON orders', pol.policyname);
    END LOOP;
END $$;

-- Crear políticas correctas para órdenes
CREATE POLICY "users_view_own_orders"
ON orders FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "owner_view_store_orders"
ON orders FOR SELECT TO authenticated
USING (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()));

CREATE POLICY "staff_view_store_orders"
ON orders FOR SELECT TO authenticated
USING (store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true));

CREATE POLICY "anyone_create_orders"
ON orders FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "owner_staff_update_orders"
ON orders FOR UPDATE TO authenticated
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true)
);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar todas las políticas de products
SELECT 'PRODUCTS' as tabla, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'products'
ORDER BY cmd, policyname;

-- Mostrar todas las políticas de categories
SELECT 'CATEGORIES' as tabla, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'categories'
ORDER BY cmd, policyname;

-- Mostrar todas las políticas de orders
SELECT 'ORDERS' as tabla, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY cmd, policyname;

-- =====================================================
-- TEST DE ACCESO
-- =====================================================

-- Información del usuario actual
SELECT 
  'INFO' as tipo,
  auth.uid() as user_id,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as email,
  (SELECT id FROM stores WHERE user_id = auth.uid()) as store_id,
  (SELECT name FROM stores WHERE user_id = auth.uid()) as store_name;

-- Contar recursos accesibles
SELECT 'PRODUCTOS' as recurso, COUNT(*) as total
FROM products
WHERE store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
UNION ALL
SELECT 'CATEGORÍAS', COUNT(*)
FROM categories
WHERE store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
UNION ALL
SELECT 'ÓRDENES', COUNT(*)
FROM orders
WHERE store_id IN (SELECT id FROM stores WHERE user_id = auth.uid());
