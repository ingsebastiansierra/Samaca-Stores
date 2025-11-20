-- =====================================================
-- FIX: Políticas RLS para categorías del admin
-- =====================================================

-- =====================================================
-- 1. ELIMINAR POLÍTICAS ANTIGUAS DE CATEGORIES
-- =====================================================

DROP POLICY IF EXISTS "Categorías activas son públicas" ON categories;
DROP POLICY IF EXISTS "Staff puede gestionar categorías" ON categories;

-- =====================================================
-- 2. CREAR NUEVAS POLÍTICAS PARA CATEGORIES
-- =====================================================

-- Política 1: Público puede VER solo categorías activas
CREATE POLICY "Público ve categorías activas"
ON categories FOR SELECT
USING (
  is_active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

-- Política 2: Dueño puede VER todas sus categorías
CREATE POLICY "Dueño ve todas sus categorías"
ON categories FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = categories.store_id
  )
);

-- Política 3: Staff puede VER categorías de su tienda
CREATE POLICY "Staff ve categorías de su tienda"
ON categories FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = categories.store_id 
    AND is_active = true
  )
);

-- Política 4: Dueño puede CREAR categorías
CREATE POLICY "Dueño puede crear categorías"
ON categories FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = categories.store_id
  )
);

-- Política 5: Staff puede CREAR categorías
CREATE POLICY "Staff puede crear categorías"
ON categories FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = categories.store_id 
    AND is_active = true
  )
);

-- Política 6: Dueño puede ACTUALIZAR categorías
CREATE POLICY "Dueño puede actualizar categorías"
ON categories FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = categories.store_id
  )
);

-- Política 7: Staff puede ACTUALIZAR categorías
CREATE POLICY "Staff puede actualizar categorías"
ON categories FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = categories.store_id 
    AND is_active = true
  )
);

-- Política 8: Dueño puede ELIMINAR categorías
CREATE POLICY "Dueño puede eliminar categorías"
ON categories FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = categories.store_id
  )
);

-- Política 9: Staff puede ELIMINAR categorías
CREATE POLICY "Staff puede eliminar categorías"
ON categories FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = categories.store_id 
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
WHERE tablename = 'categories'
ORDER BY policyname;
