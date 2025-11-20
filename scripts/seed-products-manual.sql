-- =====================================================
-- Crear productos para tu tienda (Versión Manual)
-- =====================================================
-- INSTRUCCIONES:
-- 1. Primero ejecuta la PARTE 1 para ver tu información
-- 2. Copia tu store_id
-- 3. Reemplaza 'TU_STORE_ID_AQUI' en la PARTE 2
-- 4. Ejecuta la PARTE 2

-- =====================================================
-- PARTE 1: Ver tu información (EJECUTA ESTO PRIMERO)
-- =====================================================

-- Ver todos los usuarios y sus tiendas
SELECT 
  'USUARIOS Y TIENDAS' as info,
  u.id as user_id,
  u.email,
  s.id as store_id,
  s.name as store_name,
  s.slug as store_slug,
  s.status
FROM auth.users u
LEFT JOIN stores s ON s.user_id = u.id
ORDER BY u.created_at DESC;

-- =====================================================
-- PARTE 2: Crear productos (EJECUTA DESPUÉS)
-- =====================================================
-- ⚠️ IMPORTANTE: Reemplaza 'TU_STORE_ID_AQUI' con tu store_id real

DO $$
DECLARE
  v_store_id uuid := 'TU_STORE_ID_AQUI'; -- ⚠️ CAMBIA ESTO
  v_category_id uuid;
  v_store_name text;
BEGIN
  -- Verificar que la tienda existe
  SELECT name INTO v_store_name
  FROM stores
  WHERE id = v_store_id;

  IF v_store_name IS NULL THEN
    RAISE EXCEPTION 'Tienda no encontrada con ID: %. Verifica el store_id en la PARTE 1.', v_store_id;
  END IF;

  RAISE NOTICE 'Tienda encontrada: % (ID: %)', v_store_name, v_store_id;

  -- Crear o obtener categoría "General"
  INSERT INTO categories (store_id, name, slug, description, is_active)
  VALUES (v_store_id, 'General', 'general', 'Productos generales', true)
  ON CONFLICT (store_id, slug) DO UPDATE SET name = 'General'
  RETURNING id INTO v_category_id;

  RAISE NOTICE 'Categoría creada/encontrada: %', v_category_id;

  -- Eliminar productos de prueba existentes (opcional)
  DELETE FROM products 
  WHERE store_id = v_store_id 
  AND name LIKE 'Producto de Prueba%';

  -- Crear productos de ejemplo
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
    'producto-prueba-1',
    'Este es un producto de prueba para verificar que el admin funciona correctamente.',
    25000,
    10,
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    true
  ),
  (
    v_store_id,
    v_category_id,
    'Producto de Prueba 2',
    'producto-prueba-2',
    'Segundo producto de prueba con stock bajo.',
    35000,
    3,
    ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    true
  ),
  (
    v_store_id,
    v_category_id,
    'Producto de Prueba 3 (Inactivo)',
    'producto-prueba-3',
    'Producto inactivo para probar que el admin muestra todos los productos.',
    45000,
    0,
    ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    false
  ),
  (
    v_store_id,
    v_category_id,
    'Producto de Prueba 4',
    'producto-prueba-4',
    'Producto con buen stock.',
    55000,
    25,
    ARRAY['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500'],
    true
  ),
  (
    v_store_id,
    v_category_id,
    'Producto de Prueba 5',
    'producto-prueba-5',
    'Producto premium.',
    75000,
    5,
    ARRAY['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500'],
    true
  );

  RAISE NOTICE '✅ 5 productos creados exitosamente';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'RESUMEN:';
  RAISE NOTICE 'Tienda: % (ID: %)', v_store_name, v_store_id;
  RAISE NOTICE 'Categoría ID: %', v_category_id;
  RAISE NOTICE 'Productos creados: 5';
  RAISE NOTICE '===========================================';

END $$;

-- =====================================================
-- PARTE 3: Verificar productos creados
-- =====================================================
-- ⚠️ IMPORTANTE: Reemplaza 'TU_STORE_ID_AQUI' con tu store_id real

SELECT 
  'PRODUCTOS CREADOS' as resultado,
  p.id,
  p.name,
  p.price,
  p.stock,
  p.is_active,
  c.name as categoria,
  p.created_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.store_id = 'TU_STORE_ID_AQUI' -- ⚠️ CAMBIA ESTO
ORDER BY p.created_at DESC;

-- Contar productos
SELECT 
  'RESUMEN' as metrica,
  COUNT(*) as total_productos,
  COUNT(CASE WHEN is_active THEN 1 END) as activos,
  COUNT(CASE WHEN NOT is_active THEN 1 END) as inactivos,
  SUM(stock) as stock_total
FROM products
WHERE store_id = 'TU_STORE_ID_AQUI'; -- ⚠️ CAMBIA ESTO
