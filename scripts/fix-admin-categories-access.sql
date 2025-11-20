-- =====================================================
-- FIX: Permitir que el admin vea TODAS sus categorías
-- =====================================================

-- =====================================================
-- 1. ELIMINAR POLÍTICAS ANTIGUAS DE CATEGORIES
-- =====================================================

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categorías activas son públicas" ON categories;
DROP POLICY IF EXISTS "Staff puede gestionar categorías" ON categories;

-- =====================================================
-- 2. CREAR POLÍTICAS CORRECTAS PARA CATEGORIES
-- =====================================================

-- Política 1: Público ve solo categorías activas
CREATE POLICY "public_view_active_categories"
ON categories FOR SELECT
TO public
USING (
  is_active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

-- Política 2: Dueño ve TODAS sus categorías
CREATE POLICY "owner_view_all_categories"
ON categories FOR SELECT
TO authenticated
USING (
  store_id IN (
    SELECT id FROM stores WHERE user_id = auth.uid()
  )
);

-- Política 3: Staff ve categorías de su tienda
CREATE POLICY "staff_view_store_categories"
ON categories FOR SELECT
TO authenticated
USING (
  store_id IN (
    SELECT store_id FROM store_staff 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

-- Política 4: Dueño y staff pueden CREAR categorías
CREATE POLICY "owner_staff_insert_categories"
ON categories FOR INSERT
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

-- Política 5: Dueño y staff pueden ACTUALIZAR categorías
CREATE POLICY "owner_staff_update_categories"
ON categories FOR UPDATE
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

-- Política 6: Dueño y staff pueden ELIMINAR categorías
CREATE POLICY "owner_staff_delete_categories"
ON categories FOR DELETE
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

-- =====================================================
-- 3. VERIFICAR POLÍTICAS APLICADAS
-- =====================================================

SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'categories'
ORDER BY cmd, policyname;
