-- =====================================================
-- LIMPIAR Y RECREAR POLÍTICAS RLS COMPLETAMENTE
-- =====================================================
-- Este script elimina TODAS las políticas y las recrea
-- desde cero para evitar conflictos

-- =====================================================
-- PASO 1: DESHABILITAR RLS TEMPORALMENTE
-- =====================================================

ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 2: ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- =====================================================

-- Eliminar políticas de products
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
        RAISE NOTICE 'Eliminada política de products: %', pol.policyname;
    END LOOP;
END $$;

-- Eliminar políticas de categories
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
        RAISE NOTICE 'Eliminada política de categories: %', pol.policyname;
    END LOOP;
END $$;

-- Eliminar políticas de stores
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'stores' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON stores', pol.policyname);
        RAISE NOTICE 'Eliminada política de stores: %', pol.policyname;
    END LOOP;
END $$;

-- Eliminar políticas de orders
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
        RAISE NOTICE 'Eliminada política de orders: %', pol.policyname;
    END LOOP;
END $$;

-- =====================================================
-- PASO 3: HABILITAR RLS
-- =====================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 4: CREAR POLÍTICAS SIMPLES Y CLARAS
-- =====================================================

-- STORES: Todos pueden ver tiendas activas
CREATE POLICY "stores_select_public"
ON stores FOR SELECT
USING (status = 'active');

-- STORES: Dueño puede actualizar su tienda
CREATE POLICY "stores_update_owner"
ON stores FOR UPDATE
USING (auth.uid() = user_id);

-- STORES: Usuarios pueden crear tiendas
CREATE POLICY "stores_insert_authenticated"
ON stores FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- PRODUCTS: Público ve productos activos
CREATE POLICY "products_select_public"
ON products FOR SELECT
USING (
  is_active = true 
  AND store_id IN (SELECT id FROM stores WHERE status = 'active')
);

-- PRODUCTS: Dueño ve TODOS sus productos
CREATE POLICY "products_select_owner"
ON products FOR SELECT
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- PRODUCTS: Dueño puede insertar productos
CREATE POLICY "products_insert_owner"
ON products FOR INSERT
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- PRODUCTS: Dueño puede actualizar productos
CREATE POLICY "products_update_owner"
ON products FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- PRODUCTS: Dueño puede eliminar productos
CREATE POLICY "products_delete_owner"
ON products FOR DELETE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- CATEGORIES: Público ve categorías activas
CREATE POLICY "categories_select_public"
ON categories FOR SELECT
USING (
  is_active = true 
  AND store_id IN (SELECT id FROM stores WHERE status = 'active')
);

-- CATEGORIES: Dueño ve TODAS sus categorías
CREATE POLICY "categories_select_owner"
ON categories FOR SELECT
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- CATEGORIES: Dueño puede insertar categorías
CREATE POLICY "categories_insert_owner"
ON categories FOR INSERT
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- CATEGORIES: Dueño puede actualizar categorías
CREATE POLICY "categories_update_owner"
ON categories FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- CATEGORIES: Dueño puede eliminar categorías
CREATE POLICY "categories_delete_owner"
ON categories FOR DELETE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- ORDERS: Usuarios ven sus propios pedidos
CREATE POLICY "orders_select_user"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- ORDERS: Dueño ve pedidos de su tienda
CREATE POLICY "orders_select_owner"
ON orders FOR SELECT
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- ORDERS: Cualquiera puede crear pedidos
CREATE POLICY "orders_insert_public"
ON orders FOR INSERT
WITH CHECK (true);

-- ORDERS: Dueño puede actualizar pedidos
CREATE POLICY "orders_update_owner"
ON orders FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- =====================================================
-- PASO 5: VERIFICAR POLÍTICAS CREADAS
-- =====================================================

SELECT 
  'PRODUCTS' as tabla,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'products'
ORDER BY cmd, policyname;

SELECT 
  'CATEGORIES' as tabla,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'categories'
ORDER BY cmd, policyname;

SELECT 
  'STORES' as tabla,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'stores'
ORDER BY cmd, policyname;

SELECT 
  'ORDERS' as tabla,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY cmd, policyname;

-- =====================================================
-- PASO 6: TEST FINAL
-- =====================================================

-- Contar políticas por tabla
SELECT 
  tablename,
  COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('products', 'categories', 'stores', 'orders')
GROUP BY tablename
ORDER BY tablename;

RAISE NOTICE '✅ Políticas RLS recreadas exitosamente';
RAISE NOTICE 'Ahora refresca tu página de admin';
