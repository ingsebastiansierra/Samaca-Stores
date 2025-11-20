-- =====================================================
-- VERIFICAR PRODUCTOS DE BOUTIQUE ELEGANCIA
-- =====================================================

-- 1. Ver productos de la tienda
SELECT 
  p.id,
  p.name,
  p.price,
  p.stock,
  p.is_active,
  p.store_id,
  c.name as categoria
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.store_id = (SELECT id FROM stores WHERE slug = 'boutique-elegancia')
ORDER BY p.created_at DESC;

-- 2. Contar productos por tienda
SELECT 
  s.name as tienda,
  COUNT(p.id) as total_productos
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.name
ORDER BY s.name;

-- 3. Ver si hay productos sin categoría
SELECT 
  p.id,
  p.name,
  p.category_id,
  p.store_id
FROM products p
WHERE p.store_id = (SELECT id FROM stores WHERE slug = 'boutique-elegancia')
AND p.category_id IS NULL;

-- 4. Ver categorías de Boutique Elegancia
SELECT 
  id,
  name,
  slug,
  is_active
FROM categories
WHERE store_id = (SELECT id FROM stores WHERE slug = 'boutique-elegancia')
ORDER BY name;

-- =====================================================
-- Si no hay productos, ejecuta el seed
-- =====================================================
-- Archivo: scripts/seed-multiple-stores.sql
