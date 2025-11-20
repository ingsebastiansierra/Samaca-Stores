-- =====================================================
-- Crear productos para TU tienda específica
-- =====================================================
-- Store ID: de3bfbdd-4f31-4e49-9a83-048a124aff04

DO $$
DECLARE
  v_store_id uuid := 'de3bfbdd-4f31-4e49-9a83-048a124aff04'; -- Tu store_id
  v_category_id uuid;
  v_store_name text;
BEGIN
  -- Verificar que la tienda existe
  SELECT name INTO v_store_name
  FROM stores
  WHERE id = v_store_id;

  IF v_store_name IS NULL THEN
    RAISE EXCEPTION 'Tienda no encontrada con ID: %', v_store_id;
  END IF;

  RAISE NOTICE 'Creando productos para: %', v_store_name;

  -- Crear o obtener categoría "General"
  INSERT INTO categories (store_id, name, slug, description, is_active)
  VALUES (v_store_id, 'General', 'general', 'Productos generales', true)
  ON CONFLICT (store_id, slug) DO UPDATE SET name = 'General'
  RETURNING id INTO v_category_id;

  RAISE NOTICE 'Categoría ID: %', v_category_id;

  -- Eliminar productos de prueba existentes (si los hay)
  DELETE FROM products 
  WHERE store_id = v_store_id 
  AND name LIKE 'Producto de Prueba%';

  -- Crear productos de ejemplo para TU tienda
  INSERT INTO products (
    store_id,
    category_id,
    name,
    slug,
    description,
    price,
    stock,
    images,
    is_active
  ) VALUES
  (
    v_store_id,
    v_category_id,
    'Producto de Prueba 1',
    'producto-prueba-1-' || v_store_id::text,
    'Producto de prueba para tu tienda',
    25000,
    10,
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    true
  ),
  (
    v_store_id,
    v_category_id,
    'Producto de Prueba 2',
    'producto-prueba-2-' || v_store_id::text,
    'Segundo producto de prueba',
    35000,
    3,
    ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    true
  ),
  (
    v_store_id,
    v_category_id,
    'Producto de Prueba 3 (Inactivo)',
    'producto-prueba-3-' || v_store_id::text,
    'Producto inactivo para probar',
    45000,
    0,
    ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    false
  ),
  (
    v_store_id,
    v_category_id,
    'Producto de Prueba 4',
    'producto-prueba-4-' || v_store_id::text,
    'Producto con buen stock',
    55000,
    25,
    ARRAY['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500'],
    true
  ),
  (
    v_store_id,
    v_category_id,
    'Producto de Prueba 5',
    'producto-prueba-5-' || v_store_id::text,
    'Producto premium',
    75000,
    5,
    ARRAY['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500'],
    true
  );

  RAISE NOTICE '✅ 5 productos creados para tu tienda';
  RAISE NOTICE 'Tienda: % (ID: %)', v_store_name, v_store_id;

END $$;

-- Verificar productos creados
SELECT 
  'PRODUCTOS CREADOS EN TU TIENDA' as resultado,
  p.id,
  p.name,
  p.price,
  p.stock,
  p.is_active,
  c.name as categoria
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.store_id = 'de3bfbdd-4f31-4e49-9a83-048a124aff04'
ORDER BY p.created_at DESC;

-- Resumen
SELECT 
  'RESUMEN' as info,
  COUNT(*) as total_productos,
  COUNT(CASE WHEN is_active THEN 1 END) as activos,
  COUNT(CASE WHEN NOT is_active THEN 1 END) as inactivos,
  SUM(stock) as stock_total
FROM products
WHERE store_id = 'de3bfbdd-4f31-4e49-9a83-048a124aff04';
