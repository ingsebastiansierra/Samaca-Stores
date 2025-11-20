-- Corregir el slug de "Camiseta Unisex" que tiene una URL de imagen
UPDATE products
SET slug = 'camiseta-unisex'
WHERE id = '903f050f-97ff-4bb0-921f-76b92e8967fb'
AND name = 'Camiseta Unisex';

-- Verificar el cambio
SELECT 
  id,
  name as nombre,
  slug as link_corregido
FROM products
WHERE id = '903f050f-97ff-4bb0-921f-76b92e8967fb';

-- Ver todos los productos actualizados
SELECT 
  p.name as nombre,
  p.slug as link,
  s.name as tienda
FROM products p
JOIN stores s ON p.store_id = s.id
WHERE s.slug = 'moda-start'
ORDER BY p.name;
