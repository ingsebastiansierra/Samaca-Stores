-- =====================================================
-- POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY)
-- =====================================================
-- Este script configura el acceso seguro a las tablas

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
-- 2. POLÍTICAS PARA STORES (Tiendas)
-- =====================================================

-- Todos pueden VER tiendas activas (para el catálogo público)
DROP POLICY IF EXISTS "Tiendas activas son públicas" ON stores;
CREATE POLICY "Tiendas activas son públicas"
ON stores FOR SELECT
USING (status = 'active');

-- Solo el dueño puede ACTUALIZAR su tienda
DROP POLICY IF EXISTS "Dueños pueden actualizar su tienda" ON stores;
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

-- Solo usuarios autenticados pueden CREAR tiendas
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear tiendas" ON stores;
CREATE POLICY "Usuarios autenticados pueden crear tiendas"
ON stores FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. POLÍTICAS PARA PRODUCTS (Productos)
-- =====================================================

-- Todos pueden VER productos activos
CREATE POLICY "Productos activos son públicos"
ON products FOR SELECT
USING (
  is_active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

-- Staff de la tienda puede CREAR productos
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

-- Staff de la tienda puede ACTUALIZAR productos
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

-- Staff de la tienda puede ELIMINAR productos
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

-- =====================================================
-- 4. POLÍTICAS PARA CATEGORIES (Categorías)
-- =====================================================

-- Todos pueden VER categorías activas
CREATE POLICY "Categorías activas son públicas"
ON categories FOR SELECT
USING (
  is_active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

-- Staff puede gestionar categorías
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

-- =====================================================
-- 5. POLÍTICAS PARA ORDERS (Pedidos)
-- =====================================================

-- Usuarios pueden VER sus propios pedidos
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

-- Cualquiera puede CREAR pedidos (incluso sin autenticar)
CREATE POLICY "Cualquiera puede crear pedidos"
ON orders FOR INSERT
WITH CHECK (true);

-- Solo staff puede ACTUALIZAR pedidos
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

-- =====================================================
-- 6. POLÍTICAS PARA PROMOTIONS (Promociones)
-- =====================================================

-- Todos pueden VER promociones activas
CREATE POLICY "Promociones activas son públicas"
ON promotions FOR SELECT
USING (
  active = true 
  AND 
  store_id IN (SELECT id FROM stores WHERE status = 'active')
);

-- Staff puede gestionar promociones
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

-- =====================================================
-- 7. POLÍTICAS PARA STORE_STAFF (Personal)
-- =====================================================

-- Staff puede VER el personal de su tienda
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

-- Solo owners/admins pueden AGREGAR personal
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

-- Solo owners/admins pueden ACTUALIZAR personal
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

-- =====================================================
-- 8. POLÍTICAS PARA INVENTORY_LOGS (Logs de inventario)
-- =====================================================

-- Solo staff puede VER logs de inventario
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

-- Solo staff puede CREAR logs de inventario
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
-- 9. FUNCIÓN HELPER: Verificar si usuario es staff
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
-- 10. TRIGGER: Actualizar updated_at automáticamente
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas (DROP IF EXISTS para evitar errores)
DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ✅ POLÍTICAS DE SEGURIDAD CONFIGURADAS
-- =====================================================

-- Verificar que RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('stores', 'products', 'categories', 'orders', 'promotions', 'store_staff', 'inventory_logs');
