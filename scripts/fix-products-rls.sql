-- =====================================================
-- FIX: Políticas RLS para productos del admin
-- =====================================================
-- Este script corrige las políticas para que el admin
-- pueda ver TODOS sus productos (activos e inactivos)

-- =====================================================
-- 1. ELIMINAR POLÍTICAS ANTIGUAS DE PRODUCTS
-- =====================================================

DROP POLICY IF EXISTS "Productos activos son públicos" ON products;
DROP POLICY IF EXISTS "Staff puede crear productos" ON products;
DROP POLICY IF EXISTS "Staff puede actualizar productos" ON products;
DROP POLICY IF EXISTS "Staff puede eliminar productos" ON products;

-- =====================================================
-- 2. CREAR NUEVAS POLÍTICAS PARA PRODUCTS
-- =====================================================

-- Política 1: Público puede VER solo productos activos de tiendas activas
CREATE POLICY "Público ve productos activos"
ON products FOR SELECT
USING (
  is_active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

-- Política 2: Dueño de la tienda puede VER TODOS sus productos
CREATE POLICY "Dueño ve todos sus productos"
ON products FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = products.store_id
  )
);

-- Política 3: Staff puede VER todos los productos de su tienda
CREATE POLICY "Staff ve productos de su tienda"
ON products FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = products.store_id 
    AND is_active = true
  )
);

-- Política 4: Dueño puede CREAR productos
CREATE POLICY "Dueño puede crear productos"
ON products FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = products.store_id
  )
);

-- Política 5: Staff puede CREAR productos
CREATE POLICY "Staff puede crear productos"
ON products FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = products.store_id 
    AND is_active = true
  )
);

-- Política 6: Dueño puede ACTUALIZAR productos
CREATE POLICY "Dueño puede actualizar productos"
ON products FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = products.store_id
  )
);

-- Política 7: Staff puede ACTUALIZAR productos
CREATE POLICY "Staff puede actualizar productos"
ON products FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = products.store_id 
    AND is_active = true
  )
);

-- Política 8: Dueño puede ELIMINAR productos
CREATE POLICY "Dueño puede eliminar productos"
ON products FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = products.store_id
  )
);

-- Política 9: Staff admin puede ELIMINAR productos
CREATE POLICY "Staff admin puede eliminar productos"
ON products FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = products.store_id 
    AND role IN ('owner', 'admin')
    AND is_active = true
  )
);

-- =====================================================
-- 3. VERIFICAR POLÍTICAS APLICADAS
-- =====================================================

SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'products'
ORDER BY policyname;

-- =====================================================
-- 4. TEST: Verificar acceso a productos
-- =====================================================

-- Mostrar productos con información de acceso
SELECT 
  p.id,
  p.name,
  p.is_active,
  p.store_id,
  s.name as store_name,
  s.user_id as store_owner_id,
  (
    SELECT email FROM auth.users WHERE id = s.user_id
  ) as owner_email
FROM products p
JOIN stores s ON p.store_id = s.id
ORDER BY p.created_at DESC;
