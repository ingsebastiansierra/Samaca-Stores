-- =====================================================
-- ELIMINAR POLÍTICAS DUPLICADAS INMEDIATAMENTE
-- =====================================================

-- Eliminar política duplicada en STORES
DROP POLICY IF EXISTS "Stores are viewable by everyone" ON stores;
DROP POLICY IF EXISTS "Tiendas activas son públicas" ON stores;

-- Eliminar política duplicada en PRODUCTS (si existe)
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Productos activos son públicos" ON products;

-- Recrear políticas de STORES (sin duplicados)
CREATE POLICY "stores_public_select"
ON stores FOR SELECT
USING (status = 'active');

CREATE POLICY "stores_owner_update"
ON stores FOR UPDATE
USING (
  auth.uid() = user_id 
  OR 
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = stores.id 
    AND role IN ('owner', 'admin')
    AND is_active = true
  )
);

CREATE POLICY "stores_authenticated_insert"
ON stores FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Recrear políticas de PRODUCTS (sin duplicados)
CREATE POLICY "products_public_select"
ON products FOR SELECT
USING (
  is_active = true 
  AND store_id IN (SELECT id FROM stores WHERE status = 'active')
);

CREATE POLICY "products_owner_select"
ON products FOR SELECT
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "products_owner_insert"
ON products FOR INSERT
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "products_owner_update"
ON products FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "products_owner_delete"
ON products FOR DELETE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- Verificar que no hay duplicados
SELECT 
  'VERIFICACIÓN' as resultado,
  tablename,
  COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('stores', 'products')
GROUP BY tablename;

-- Mostrar políticas finales
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('stores', 'products')
ORDER BY tablename, cmd, policyname;

-- Mensaje de éxito
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas duplicadas eliminadas';
  RAISE NOTICE 'Refresca tu página de admin ahora';
END $$;
