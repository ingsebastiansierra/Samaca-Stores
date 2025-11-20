-- ===============================================  ======
-- POLÍTICAS DE SEGURIDAD (RLS) - VERSIÓN SIMPLIFICADA
-- =====================================================
-- Este script es seguro de ejecutar múltiples veces

-- =====================================================
-- 1. HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. ELIMINAR POLÍTICAS EXISTENTES (si existen)
-- =====================================================

-- Stores
DROP POLICY IF EXISTS "Tiendas activas son públicas" ON stores;
DROP POLICY IF EXISTS "Dueños pueden actualizar su tienda" ON stores;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear tiendas" ON stores;

-- Products
DROP POLICY IF EXISTS "Productos activos son públicos" ON products;
DROP POLICY IF EXISTS "Staff puede crear productos" ON products;
DROP POLICY IF EXISTS "Staff puede actualizar productos" ON products;
DROP POLICY IF EXISTS "Staff puede eliminar productos" ON products;

-- Categories
DROP POLICY IF EXISTS "Categorías activas son públicas" ON categories;
DROP POLICY IF EXISTS "Staff puede gestionar categorías" ON categories;

-- Orders
DROP POLICY IF EXISTS "Usuarios ven sus pedidos" ON orders;
DROP POLICY IF EXISTS "Cualquiera puede crear pedidos" ON orders;
DROP POLICY IF EXISTS "Staff puede actualizar pedidos" ON orders;

-- Promotions
DROP POLICY IF EXISTS "Promociones activas son públicas" ON promotions;
DROP POLICY IF EXISTS "Staff puede gestionar promociones" ON promotions;

-- Store Staff
DROP POLICY IF EXISTS "Staff puede ver personal de su tienda" ON store_staff;
DROP POLICY IF EXISTS "Owners pueden agregar personal" ON store_staff;
DROP POLICY IF EXISTS "Owners pueden actualizar personal" ON store_staff;

-- Inventory Logs
DROP POLICY IF EXISTS "Staff puede ver logs de inventario" ON inventory_logs;
DROP POLICY IF EXISTS "Staff puede crear logs de inventario" ON inventory_logs;

-- =====================================================
-- 3. CREAR POLÍTICAS NUEVAS
-- =====================================================

-- STORES
CREATE POLICY "Tiendas activas son públicas"
ON stores FOR SELECT
USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Dueños pueden actualizar su tienda"
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

CREATE POLICY "Usuarios autenticados pueden crear tiendas"
ON stores FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- PRODUCTS
CREATE POLICY "Productos activos son públicos"
ON products FOR SELECT
USING (
  is_active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

CREATE POLICY "Staff puede crear productos"
ON products FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = products.store_id 
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = products.store_id
  )
);

CREATE POLICY "Staff puede actualizar productos"
ON products FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = products.store_id 
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = products.store_id
  )
);

CREATE POLICY "Staff puede eliminar productos"
ON products FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = products.store_id 
    AND role IN ('owner', 'admin')
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = products.store_id
  )
);

-- CATEGORIES
CREATE POLICY "Categorías activas son públicas"
ON categories FOR SELECT
USING (
  is_active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

CREATE POLICY "Staff puede gestionar categorías"
ON categories FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = categories.store_id 
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = categories.store_id
  )
);

-- ORDERS
CREATE POLICY "Usuarios ven sus pedidos"
ON orders FOR SELECT
USING (
  auth.uid() = user_id
  OR
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = orders.store_id 
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = orders.store_id
  )
);

CREATE POLICY "Cualquiera puede crear pedidos"
ON orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Staff puede actualizar pedidos"
ON orders FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = orders.store_id 
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = orders.store_id
  )
);

-- PROMOTIONS
CREATE POLICY "Promociones activas son públicas"
ON promotions FOR SELECT
USING (
  active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

CREATE POLICY "Staff puede gestionar promociones"
ON promotions FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = promotions.store_id 
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = promotions.store_id
  )
);

-- STORE STAFF
CREATE POLICY "Staff puede ver personal de su tienda"
ON store_staff FOR SELECT
USING (
  auth.uid() = user_id
  OR
  auth.uid() IN (
    SELECT user_id FROM store_staff AS ss
    WHERE ss.store_id = store_staff.store_id 
    AND ss.is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = store_staff.store_id
  )
);

CREATE POLICY "Owners pueden agregar personal"
ON store_staff FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = store_staff.store_id 
    AND role IN ('owner', 'admin')
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = store_staff.store_id
  )
);

CREATE POLICY "Owners pueden actualizar personal"
ON store_staff FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff AS ss
    WHERE ss.store_id = store_staff.store_id 
    AND ss.role IN ('owner', 'admin')
    AND ss.is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = store_staff.store_id
  )
);

-- INVENTORY LOGS
CREATE POLICY "Staff puede ver logs de inventario"
ON inventory_logs FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = inventory_logs.store_id 
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = inventory_logs.store_id
  )
);

CREATE POLICY "Staff puede crear logs de inventario"
ON inventory_logs FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM store_staff 
    WHERE store_id = inventory_logs.store_id 
    AND is_active = true
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM stores WHERE id = inventory_logs.store_id
  )
);

-- =====================================================
-- 4. FUNCIÓN HELPER
-- =====================================================

CREATE OR REPLACE FUNCTION is_store_staff(store_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM store_staff
    WHERE store_id = store_uuid
    AND user_id = auth.uid()
    AND is_active = true
  ) OR EXISTS (
    SELECT 1 FROM stores
    WHERE id = store_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. VERIFICACIÓN
-- =====================================================

SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Habilitado"
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('stores', 'products', 'categories', 'orders', 'promotions', 'store_staff', 'inventory_logs')
ORDER BY tablename;

-- =====================================================
-- ✅ POLÍTICAS CONFIGURADAS CORRECTAMENTE
-- =====================================================
