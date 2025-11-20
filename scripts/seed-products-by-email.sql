-- =====================================================
-- Crear productos usando tu EMAIL
-- =====================================================
-- INSTRUCCIONES:
-- 1. Reemplaza 'tu-email@ejemplo.com' con tu email real
-- 2. Ejecuta todo el script

DO $$
DECLARE
  v_user_email text := 'tu-email@ejemplo.com'; -- ⚠️ CAMBIA ESTO POR TU EMAIL
  v_user_id uuid;
  v_store_id uuid;
  v_store_name text;
  v_category_id uuid;
BEGIN
  -- Buscar usuario por email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_user_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado con email: %. Verifica el email.', v_user_email;
  END IF;

  RAISE NOTICE 'Usuario encontrado: % (ID: %)', v_user_email, v_user_id;

  -- Buscar tienda del usuario
  SELECT id, name INTO v_store_id, v_store_name
  FROM stores
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_store_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró tienda para el usuario: %. Crea una tienda primero.', v_user_email;
  END IF;

  RAISE NOTICE 'Tienda encontrada: % (ID: %)', v_store_name, v_store_id;

  -- Crear o obtener categoría "General"
  INSERT INTO categories (store_id, name, slug, description, is_active)
  VALUES (v_store_id, 'General', 'general', 'Productos generales', true)
  ON CONFLICT (store_id, slug) DO UPDATE SET name = 'General'
  RETURNING id INTO v_category_id;

  RAISE NOTICE 'Categoría creada: %', v_category_id;

  -- Eliminar productos de prueba existentes
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

  RAISE NOTICE '✅ ¡ÉXITO! 5 productos creados';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Usuario: %', v_user_email;
  RAISE NOTICE 'Tienda: % (ID: %)', v_store_name, v_store_id;
  RAISE NOTICE 'Categoría ID: %', v_category_id;
  RAISE NOTICE 'Productos: 5 (4 activos, 1 inactivo)';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Ahora ve a: http://localhost:3000/admin/products';

END $$;

-- Verificar productos creados (reemplaza el email)
SELECT 
  p.id,
  p.name,
  p.price,
  p.stock,
  p.is_active,
  c.name as categoria
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.store_id IN (
  SELECT id FROM stores WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com' -- ⚠️ CAMBIA ESTO
  )
)
ORDER BY p.created_at DESC;
