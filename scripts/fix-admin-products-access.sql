-- =====================================================
-- FIX: Permitir que el admin vea TODOS sus productos
-- =====================================================
-- Problema: Las políticas actuales solo permiten ver
-- productos activos, pero el admin necesita ver todos

-- =====================================================
-- 1. ELIMINAR POLÍTICAS DUPLICADAS Y ANTIGUAS
-- =====================================================

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Productos activos son públicos" ON products;
DROP POLICY IF EXISTS "Staff puede crear productos" ON products;
DROP POLICY IF EXISTS "Staff puede actualizar productos" ON products;
DROP POLICY IF EXISTS "Staff puede eliminar productos" ON products;

-- =====================================================
-- 2. CREAR POLÍTICAS CORRECTAS
-- =====================================================

-- Política 1: Público ve solo productos activos de tiendas activas
CREATE POLICY "public_view_active_products"
ON products FOR SELECT
TO public
USING (
  is_active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

-- Política 2: Dueño de tienda ve TODOS sus productos (activos e inactivos)
CREATE POLICY "owner_view_all_products"
ON products FOR SELECT
TO authenticated
USING (
  store_id IN (
    SELECT id FROM stores WHERE user_id = auth.uid()
  )
);

-- Política 3: Staff ve todos los productos de su tienda
CREATE POLICY "staff_view_store_products"
ON products FOR SELECT
TO authenticated
USING (
  store_id IN (
    SELECT store_id FROM store_staff 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

-- Política 4: Dueño y staff pueden CREAR productos
CREATE POLICY "owner_staff_insert_products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  store_id IN (
    SELECT id FROM stores WHERE user_id = auth.uid()
  )
  OR
  store_id IN (
    SELECT store_id FROM store_staff 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

-- Política 5: Dueño y staff pueden ACTUALIZAR productos
CREATE POLICY "owner_staff_update_products"
ON products FOR UPDATE
TO authenticated
USING (
  store_id IN (
    SELECT id FROM stores WHERE user_id = auth.uid()
  )
  OR
  store_id IN (
    SELECT store_id FROM store_staff 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

-- Política 6: Dueño y staff admin pueden ELIMINAR productos
CREATE POLICY "owner_admin_delete_products"
ON products FOR DELETE
TO authenticated
USING (
  store_id IN (
    SELECT id FROM stores WHERE user_id = auth.uid()
  )
  OR
  store_id IN (
    SELECT store_id FROM store_staff 
    WHERE user_id = auth.uid() 
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
  roles,
  CASE 
    WHEN cmd = 'SELECT' THEN 'Ver productos'
    WHEN cmd = 'INSERT' THEN 'Crear productos'
    WHEN cmd = 'UPDATE' THEN 'Actualizar productos'
    WHEN cmd = 'DELETE' THEN 'Eliminar productos'
  END as accion
FROM pg_policies
WHERE tablename = 'products'
ORDER BY cmd, policyname;

-- =====================================================
-- 4. TEST: Verificar que el usuario actual puede ver productos
-- =====================================================

-- Mostrar el usuario actual
SELECT 
  'Usuario actual' as info,
  auth.uid() as user_id,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as email;

-- Mostrar la tienda del usuario
SELECT 
  'Tienda del usuario' as info,
  id as store_id,
  name as store_name,
  user_id as owner_id
FROM stores
WHERE user_id = auth.uid();

-- Contar productos que el usuario debería ver
SELECT 
  'Total productos de mi tienda' as info,
  COUNT(*) as cantidad
FROM products
WHERE store_id IN (
  SELECT id FROM stores WHERE user_id = auth.uid()
);

-- Mostrar productos (debería funcionar ahora)
SELECT 
  id,
  name,
  price,
  stock,
  is_active,
  store_id
FROM products
WHERE store_id IN (
  SELECT id FROM stores WHERE user_id = auth.uid()
)
ORDER BY created_at DESC
LIMIT 10;
