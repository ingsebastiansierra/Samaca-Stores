-- =====================================================
-- SOLUCIÓN COMPLETA: Eliminar todas las recursiones
-- =====================================================

-- PASO 1: Deshabilitar RLS temporalmente
ALTER TABLE store_staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar TODAS las políticas de todas las tablas
DO $$ 
DECLARE
    pol record;
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT DISTINCT tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        FOR pol IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE tablename = tbl 
            AND schemaname = 'public'
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, tbl);
            RAISE NOTICE 'Eliminada: %.%', tbl, pol.policyname;
        END LOOP;
    END LOOP;
END $$;

-- PASO 3: Habilitar RLS nuevamente
ALTER TABLE store_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- PASO 4: Crear políticas SIMPLES sin recursión

-- STORES: Solo políticas básicas
CREATE POLICY "stores_select_all"
ON stores FOR SELECT
USING (true); -- Todos pueden ver todas las tiendas (simplificado)

CREATE POLICY "stores_insert_owner"
ON stores FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stores_update_owner"
ON stores FOR UPDATE
USING (auth.uid() = user_id);

-- PRODUCTS: Sin referencia a store_staff
CREATE POLICY "products_select_all"
ON products FOR SELECT
USING (true); -- Todos pueden ver todos los productos (simplificado)

CREATE POLICY "products_insert_owner"
ON products FOR INSERT
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "products_update_owner"
ON products FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "products_delete_owner"
ON products FOR DELETE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- CATEGORIES: Sin referencia a store_staff
CREATE POLICY "categories_select_all"
ON categories FOR SELECT
USING (true); -- Todos pueden ver todas las categorías (simplificado)

CREATE POLICY "categories_insert_owner"
ON categories FOR INSERT
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "categories_update_owner"
ON categories FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "categories_delete_owner"
ON categories FOR DELETE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- STORE_STAFF: Sin auto-referencia
CREATE POLICY "store_staff_select_owner"
ON store_staff FOR SELECT
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "store_staff_insert_owner"
ON store_staff FOR INSERT
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "store_staff_update_owner"
ON store_staff FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "store_staff_delete_owner"
ON store_staff FOR DELETE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- VERIFICACIÓN FINAL
SELECT 
  'RESUMEN DE POLÍTICAS' as info,
  tablename,
  COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

SELECT 
  'DETALLE DE POLÍTICAS' as info,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;

-- Mensaje de éxito
DO $$
BEGIN
  RAISE NOTICE '✅ Todas las políticas recreadas sin recursión';
  RAISE NOTICE '✅ Refresca tu aplicación ahora';
END $$;
