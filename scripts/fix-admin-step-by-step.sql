-- =====================================================
-- PASO 1: Eliminar todas las políticas de products
-- =====================================================
-- Copia y ejecuta este bloque primero

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
        RAISE NOTICE 'Eliminada política: %', pol.policyname;
    END LOOP;
END $$;

-- Verificar que se eliminaron
SELECT 'Políticas restantes en products:' as info, COUNT(*) as cantidad
FROM pg_policies 
WHERE tablename = 'products';

-- =====================================================
-- PASO 2: Crear nuevas políticas para products
-- =====================================================
-- Ejecuta este bloque después del paso 1

-- Público ve solo productos activos
CREATE POLICY "public_view_active_products"
ON products FOR SELECT TO public
USING (is_active = true AND store_id IN (SELECT id FROM stores WHERE status = 'active'));

-- Dueño ve TODOS sus productos
CREATE POLICY "owner_view_all_products"
ON products FOR SELECT TO authenticated
USING (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()));

-- Staff ve productos de su tienda
CREATE POLICY "staff_view_store_products"
ON products FOR SELECT TO authenticated
USING (store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true));

-- Insertar productos
CREATE POLICY "owner_staff_insert_products"
ON products FOR INSERT TO authenticated
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true)
);

-- Actualizar productos
CREATE POLICY "owner_staff_update_products"
ON products FOR UPDATE TO authenticated
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true)
);

-- Eliminar productos
CREATE POLICY "owner_admin_delete_products"
ON products FOR DELETE TO authenticated
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
  OR store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND is_active = true)
);

-- Verificar políticas creadas
SELECT 'Nuevas políticas en products:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY cmd, policyname;

-- =====================================================
-- PASO 3: Eliminar todas las políticas de categories
-- =====================================================

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
        RAISE NOTICE 'Eliminada política: %', pol.policyname;
    END LOOP;
END $$;

-- =====================================================
-- PASO 4: Crear nuevas políticas para categories
-- =====================================================

-- Público ve solo categorías activas
CREATE POLICY "public_view_active_categories"
ON categories FOR SELECT TO public
USING (is_active = true AND store_id IN (SELECT id FROM stores WHERE status = 'active'));

-- Dueño ve todas sus categorías
CREATE POLICY "owner_view_all_categories"
ON categories FOR SELECT TO authenticated
USING (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()));

-- Staff ve categorías de su tienda
CREATE POLICY "staff_view_store_categories"
ON categories FOR SELECT TO authenticated
USING (store_id IN (SELECT store_id FROM store_staff WHERE user_id = auth.uid() AND is_active = true));

-- Gestión de categorías
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

-- Verificar políticas creadas
SELECT 'Nuevas políticas en categories:' as info, policyname, cmd
FROM pg_policies 
WHERE tablename = 'categories'
ORDER BY cmd, policyname;

-- =====================================================
-- PASO 5: TEST FINAL
-- =====================================================

-- Tu información
SELECT 
  'TU USUARIO' as tipo,
  auth.uid() as user_id,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as email;

-- Tu tienda
SELECT 
  'TU TIENDA' as tipo,
  id as store_id,
  name as store_name
FROM stores
WHERE user_id = auth.uid();

-- Tus productos (deberías verlos todos ahora)
SELECT 
  'TUS PRODUCTOS' as tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN is_active THEN 1 END) as activos,
  COUNT(CASE WHEN NOT is_active THEN 1 END) as inactivos
FROM products
WHERE store_id IN (SELECT id FROM stores WHERE user_id = auth.uid());

-- Listar productos
SELECT 
  id,
  name,
  price,
  stock,
  is_active,
  created_at
FROM products
WHERE store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
ORDER BY created_at DESC
LIMIT 10;
