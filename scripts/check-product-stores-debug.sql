-- Verificar productos y sus tiendas
SELECT 
  p.name as product_name, 
  p.store_id, 
  s.name as store_name, 
  s.id as store_table_id
FROM products p
LEFT JOIN stores s ON p.store_id = s.id
ORDER BY s.name, p.name;
