-- Ver nombre y slug de todos los productos de Moda Start
SELECT 
  p.id,
  p.name as nombre,
  p.slug as link,
  s.name as tienda
FROM products p
JOIN stores s ON p.store_id = s.id
WHERE s.slug = 'moda-start'
ORDER BY p.name;
