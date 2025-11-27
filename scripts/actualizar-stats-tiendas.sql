-- ============================================
-- ACTUALIZAR ESTADÍSTICAS DE TIENDAS
-- ============================================

-- 1. Ver las tiendas que existen
SELECT 
  'TIENDAS EXISTENTES' as paso,
  id,
  name,
  city,
  status,
  user_id
FROM public.stores
ORDER BY created_at DESC;

-- 2. Ver cuántas cotizaciones hay por tienda
SELECT 
  'COTIZACIONES POR TIENDA' as paso,
  store_id,
  COUNT(*) as total_cotizaciones,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as convertidas,
  SUM(CASE WHEN status = 'converted' THEN total ELSE 0 END) as ventas_totales
FROM public.quotations
GROUP BY store_id;

-- 3. Ver cuántos productos hay por tienda
SELECT 
  'PRODUCTOS POR TIENDA' as paso,
  store_id,
  COUNT(*) as total_productos
FROM public.products
GROUP BY store_id;

-- 4. Actualizar o insertar estadísticas para cada tienda
INSERT INTO public.store_stats (
  store_id,
  total_products,
  total_orders,
  total_revenue,
  total_customers,
  avg_order_value,
  last_order_date,
  updated_at
)
SELECT 
  s.id as store_id,
  COALESCE(p.total_productos, 0) as total_products,
  COALESCE(q.total_cotizaciones, 0) as total_orders,
  COALESCE(q.ventas_totales, 0) as total_revenue,
  COALESCE(q.clientes_unicos, 0) as total_customers,
  CASE 
    WHEN COALESCE(q.total_cotizaciones, 0) > 0 
    THEN COALESCE(q.ventas_totales, 0) / q.total_cotizaciones 
    ELSE 0 
  END as avg_order_value,
  q.ultima_cotizacion as last_order_date,
  NOW() as updated_at
FROM public.stores s
LEFT JOIN (
  SELECT 
    store_id,
    COUNT(*) as total_productos
  FROM public.products
  GROUP BY store_id
) p ON s.id = p.store_id
LEFT JOIN (
  SELECT 
    store_id,
    COUNT(*) as total_cotizaciones,
    SUM(CASE WHEN status = 'converted' THEN total ELSE 0 END) as ventas_totales,
    COUNT(DISTINCT customer_email) as clientes_unicos,
    MAX(created_at) as ultima_cotizacion
  FROM public.quotations
  GROUP BY store_id
) q ON s.id = q.store_id
ON CONFLICT (store_id) 
DO UPDATE SET
  total_products = EXCLUDED.total_products,
  total_orders = EXCLUDED.total_orders,
  total_revenue = EXCLUDED.total_revenue,
  total_customers = EXCLUDED.total_customers,
  avg_order_value = EXCLUDED.avg_order_value,
  last_order_date = EXCLUDED.last_order_date,
  updated_at = NOW();

-- 5. Actualizar campos en la tabla stores
UPDATE public.stores s
SET 
  total_sales = COALESCE(q.ventas_totales, 0),
  total_orders = COALESCE(q.total_cotizaciones, 0)
FROM (
  SELECT 
    store_id,
    COUNT(*) as total_cotizaciones,
    SUM(CASE WHEN status = 'converted' THEN total ELSE 0 END) as ventas_totales
  FROM public.quotations
  GROUP BY store_id
) q
WHERE s.id = q.store_id;

-- 6. Verificar que se actualizaron correctamente
SELECT 
  'ESTADÍSTICAS ACTUALIZADAS' as resultado,
  s.id,
  s.name,
  s.total_sales,
  s.total_orders,
  ss.total_products,
  ss.total_revenue,
  ss.avg_order_value
FROM public.stores s
LEFT JOIN public.store_stats ss ON s.id = ss.store_id
ORDER BY s.created_at DESC;

-- 7. Mensaje final
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ESTADÍSTICAS ACTUALIZADAS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Ahora recarga el dashboard del super admin';
  RAISE NOTICE '========================================';
END $$;
