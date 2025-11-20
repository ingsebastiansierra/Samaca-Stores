-- =====================================================
-- RESET COMPLETO Y CREAR TIENDA "MODA START"
-- =====================================================

-- PASO 1: Eliminar todos los productos
DELETE FROM products;

-- PASO 2: Eliminar todas las categorías
DELETE FROM categories;

-- PASO 3: Eliminar todos los pedidos
DELETE FROM orders;

-- PASO 4: Eliminar todas las promociones
DELETE FROM promotions;

-- PASO 5: Eliminar todos los logs de inventario
DELETE FROM inventory_logs;

-- PASO 6: Eliminar todo el staff
DELETE FROM store_staff;

-- PASO 7: Eliminar todas las tiendas
DELETE FROM stores;

-- Verificar que todo está limpio
SELECT 'LIMPIEZA COMPLETA' as resultado,
  (SELECT COUNT(*) FROM stores) as tiendas,
  (SELECT COUNT(*) FROM products) as productos,
  (SELECT COUNT(*) FROM categories) as categorias,
  (SELECT COUNT(*) FROM orders) as pedidos;

-- PASO 8: Crear la tienda "Moda Start"
INSERT INTO stores (
  name,
  slug,
  description,
  owner_name,
  owner_email,
  owner_phone,
  user_id,
  city,
  department,
  country,
  status,
  primary_color
) VALUES (
  'Moda Start',
  'moda-start',
  'Tu tienda de moda en Samacá',
  'Sebastian Vega',
  'vegasebastian073@gmail.com',
  '3123106507',
  '4e5e7cd0-410b-4e0f-926a-27d69782c380', -- Tu user_id
  'Samacá',
  'Boyacá',
  'Colombia',
  'active',
  '#0284c7'
)
RETURNING id, name, slug, owner_email;

-- PASO 9: Crear categoría inicial "Ropa"
INSERT INTO categories (
  store_id,
  name,
  slug,
  description,
  is_active
)
SELECT 
  id,
  'Ropa',
  'ropa',
  'Categoría de ropa y moda',
  true
FROM stores
WHERE slug = 'moda-start'
RETURNING id, name, store_id;

-- PASO 10: Crear algunos productos de ejemplo
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
)
SELECT 
  s.id,
  c.id,
  'Camiseta Básica',
  'camiseta-basica',
  'Camiseta de algodón 100% en varios colores',
  35000,
  20,
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
  true
FROM stores s
CROSS JOIN categories c
WHERE s.slug = 'moda-start' AND c.slug = 'ropa'
UNION ALL
SELECT 
  s.id,
  c.id,
  'Jeans Clásico',
  'jeans-clasico',
  'Jeans de mezclilla con corte clásico',
  85000,
  15,
  ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
  true
FROM stores s
CROSS JOIN categories c
WHERE s.slug = 'moda-start' AND c.slug = 'ropa'
UNION ALL
SELECT 
  s.id,
  c.id,
  'Chaqueta Casual',
  'chaqueta-casual',
  'Chaqueta ligera perfecta para cualquier ocasión',
  120000,
  10,
  ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
  true
FROM stores s
CROSS JOIN categories c
WHERE s.slug = 'moda-start' AND c.slug = 'ropa'
UNION ALL
SELECT 
  s.id,
  c.id,
  'Vestido Elegante',
  'vestido-elegante',
  'Vestido elegante para ocasiones especiales',
  150000,
  8,
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
  true
FROM stores s
CROSS JOIN categories c
WHERE s.slug = 'moda-start' AND c.slug = 'ropa'
UNION ALL
SELECT 
  s.id,
  c.id,
  'Zapatillas Deportivas',
  'zapatillas-deportivas',
  'Zapatillas cómodas para el día a día',
  95000,
  12,
  ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
  true
FROM stores s
CROSS JOIN categories c
WHERE s.slug = 'moda-start' AND c.slug = 'ropa';

-- VERIFICACIÓN FINAL
SELECT 
  '✅ TIENDA CREADA' as resultado,
  s.id as store_id,
  s.name as store_name,
  s.slug,
  u.email as admin_email,
  (SELECT COUNT(*) FROM categories WHERE store_id = s.id) as categorias,
  (SELECT COUNT(*) FROM products WHERE store_id = s.id) as productos
FROM stores s
LEFT JOIN auth.users u ON s.user_id = u.id
WHERE s.slug = 'moda-start';

-- Mostrar productos creados
SELECT 
  '✅ PRODUCTOS CREADOS' as info,
  p.name,
  p.price,
  p.stock,
  c.name as categoria
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN stores s ON p.store_id = s.id
WHERE s.slug = 'moda-start'
ORDER BY p.name;

-- Mensaje final
DO $$
BEGIN
  RAISE NOTICE '✅ Base de datos limpia';
  RAISE NOTICE '✅ Tienda "Moda Start" creada';
  RAISE NOTICE '✅ Admin: vegasebastian073@gmail.com';
  RAISE NOTICE '✅ 5 productos de ejemplo creados';
  RAISE NOTICE '✅ Refresca tu admin ahora: http://localhost:3000/admin/products';
END $$;
