-- =====================================================
-- Crear productos para TU tienda
-- =====================================================
-- Este script crea productos de ejemplo en tu tienda

-- Paso 1: Obtener tu store_id
DO $$
DECLARE
  v_store_id uuid;
  v_category_id uuid;
  v_user_id uuid;
BEGIN
  -- Obtener el usuario actual
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No hay usuario autenticado. Debes estar logueado en Supabase.';
  END IF;

  -- Obtener la tienda del usuario
  SELECT id INTO v_store_id
  FROM stores
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_store_id IS NULL THEN
    RAISE EXCEPTION 'No tienes una tienda asignada. Usuario: %', v_user_id;
  END IF;

  RAISE NOTICE 'Tienda encontrada: %', v_store_id;

  -- Crear o obtener categoría "General"
  INSERT INTO categories (store_id, name, slug, description, is_active)
  VALUES (v_store_id, 'General', 'general', 'Productos generales', true)
  ON CONFLICT (store_id, slug) DO UPDATE SET name = 'General'
  RETURNING id INTO v_category_id;

  RAISE NOTICE 'Categoría creada/encontrada: %', v_category_id;

  -- Eliminar productos existentes de prueba (opcional)
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

  RAISE NOTICE 'Productos creados exitosamente';

  -- Mostrar resumen
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'RESUMEN:';
  RAISE NOTICE 'Usuario ID: %', v_user_id;
  RAISE NOTICE 'Tienda ID: %', v_store_id;
  RAISE NOTICE 'Categoría ID: %', v_category_id;
  RAISE NOTICE 'Productos creados: 5';
  RAISE NOTICE '===========================================';

END $$;

-- Verificar productos creados
SELECT 
  'PRODUCTOS CREADOS' as resultado,
  p.id,
  p.name,
  p.price,
  p.stock,
  p.is_active,
  c.name as categoria
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
ORDER BY p.created_at DESC;

-- Contar productos
SELECT 
  'TOTAL' as metrica,
  COUNT(*) as cantidad,
  COUNT(CASE WHEN is_active THEN 1 END) as activos,
  COUNT(CASE WHEN NOT is_active THEN 1 END) as inactivos
FROM products
WHERE store_id IN (SELECT id FROM stores WHERE user_id = auth.uid());
