-- =====================================================
-- LIMPIAR TODAS LAS POLÍTICAS Y EMPEZAR DE CERO
-- =====================================================

-- PASO 1: Eliminar TODAS las políticas de products
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
        RAISE NOTICE 'Eliminada: %', pol.policyname;
    END LOOP;
END $$;

-- PASO 2: Eliminar TODAS las políticas de stores
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
        RAISE NOTICE 'Eliminada: %', pol.policyname;
    END LOOP;
END $$;

-- PASO 3: Eliminar TODAS las políticas de categories
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
        RAISE NOTICE 'Eliminada: %', pol.policyname;
    END LOOP;
END $$;

-- PASO 4: Crear políticas SIMPLES para STORES
CREATE POLICY "stores_select"
ON stores FOR SELECT
USING (status = 'active');

CREATE POLICY "stores_insert"
ON stores FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stores_update"
ON stores FOR UPDATE
USING (auth.uid() = user_id);

-- PASO 5: Crear políticas SIMPLES para PRODUCTS
CREATE POLICY "products_select_public"
ON products FOR SELECT
USING (
  is_active = true 
  AND store_id IN (SELECT id FROM stores WHERE status = 'active')
);

CREATE POLICY "products_select_owner"
ON products FOR SELECT
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "products_insert"
ON products FOR INSERT
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "products_update"
ON products FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "products_delete"
ON products FOR DELETE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- PASO 6: Crear políticas SIMPLES para CATEGORIES
CREATE POLICY "categories_select_public"
ON categories FOR SELECT
USING (
  is_active = true 
  AND store_id IN (SELECT id FROM stores WHERE status = 'active')
);

CREATE POLICY "categories_select_owner"
ON categories FOR SELECT
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "categories_insert"
ON categories FOR INSERT
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "categories_update"
ON categories FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "categories_delete"
ON categories FOR DELETE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- VERIFICACIÓN FINAL
SELECT 
  'POLÍTICAS FINALES' as info,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('stores', 'products', 'categories')
ORDER BY tablename, cmd, policyname;

-- Contar políticas por tabla
SELECT 
  'RESUMEN' as info,
  tablename,
  COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('stores', 'products', 'categories')
GROUP BY tablename
ORDER BY tablename;
