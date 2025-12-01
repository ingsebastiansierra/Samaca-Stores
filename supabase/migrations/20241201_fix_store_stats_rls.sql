-- Arreglar políticas RLS para store_stats
-- El problema es que el trigger update_store_stats() se ejecuta con permisos del usuario
-- pero necesita poder insertar/actualizar en store_stats

-- Solución: Hacer que la función use SECURITY DEFINER para ejecutarse con permisos elevados

-- Recrear la función con SECURITY DEFINER
CREATE OR REPLACE FUNCTION update_store_stats()
RETURNS TRIGGER 
SECURITY DEFINER -- Ejecutar con permisos del dueño de la función
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO store_stats (store_id, total_orders, total_revenue, last_order_date, updated_at)
    SELECT 
      NEW.store_id,
      COUNT(*) as total_orders,
      COALESCE(SUM(total), 0) as total_revenue,
      MAX(created_at) as last_order_date,
      NOW() as updated_at
    FROM orders
    WHERE store_id = NEW.store_id
      AND status IN ('confirmed', 'preparing', 'ready', 'shipped', 'delivered')
    GROUP BY store_id
    ON CONFLICT (store_id) 
    DO UPDATE SET
      total_orders = EXCLUDED.total_orders,
      total_revenue = EXCLUDED.total_revenue,
      last_order_date = EXCLUDED.last_order_date,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "store_stats_insert_policy" ON store_stats;
DROP POLICY IF EXISTS "store_stats_update_policy" ON store_stats;
DROP POLICY IF EXISTS "store_stats_select_policy" ON store_stats;

-- Política de SELECT: Los dueños y staff pueden ver las estadísticas de su tienda
CREATE POLICY "store_stats_select_policy" ON store_stats
FOR SELECT
USING (
  store_id IN (
    -- Dueños de la tienda
    SELECT id FROM stores WHERE user_id = auth.uid()
    UNION
    -- Staff de la tienda
    SELECT store_id FROM store_staff WHERE user_id = auth.uid()
  )
);

-- Política de INSERT: Permitir insertar estadísticas para tiendas propias o donde es staff
CREATE POLICY "store_stats_insert_policy" ON store_stats
FOR INSERT
WITH CHECK (
  store_id IN (
    -- Dueños de la tienda
    SELECT id FROM stores WHERE user_id = auth.uid()
    UNION
    -- Staff de la tienda
    SELECT store_id FROM store_staff WHERE user_id = auth.uid()
  )
);

-- Política de UPDATE: Permitir actualizar estadísticas para tiendas propias o donde es staff
CREATE POLICY "store_stats_update_policy" ON store_stats
FOR UPDATE
USING (
  store_id IN (
    -- Dueños de la tienda
    SELECT id FROM stores WHERE user_id = auth.uid()
    UNION
    -- Staff de la tienda
    SELECT store_id FROM store_staff WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  store_id IN (
    -- Dueños de la tienda
    SELECT id FROM stores WHERE user_id = auth.uid()
    UNION
    -- Staff de la tienda
    SELECT store_id FROM store_staff WHERE user_id = auth.uid()
  )
);

-- Verificar que RLS esté habilitado
ALTER TABLE store_stats ENABLE ROW LEVEL SECURITY;

-- Recrear el trigger para asegurarnos de que use la nueva función
DROP TRIGGER IF EXISTS trigger_update_store_stats ON orders;
DROP TRIGGER IF EXISTS update_store_orders_stats ON orders;

CREATE TRIGGER trigger_update_store_stats
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_store_stats();

-- Verificar las políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'store_stats';
