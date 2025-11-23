-- 1. Obtener el ID de la tienda principal (asumiendo que hay una llamada 'Moda & Estilo' o similar, o simplemente tomamos la primera)
WITH main_store AS (
  SELECT id FROM stores LIMIT 1
)
-- 2. Actualizar TODOS los productos para que pertenezcan a esa tienda
UPDATE products
SET store_id = (SELECT id FROM main_store)
WHERE store_id IS NULL OR store_id != (SELECT id FROM main_store);

-- 3. Verificar el resultado
SELECT p.name, p.store_id, s.name as store_name
FROM products p
JOIN stores s ON p.store_id = s.id;
