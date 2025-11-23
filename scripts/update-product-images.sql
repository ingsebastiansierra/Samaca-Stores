-- Script para actualizar las imágenes de los productos con versiones de alta calidad
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Zapatos Deportivos Nike Air Max
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Zapatos Deportivos Nike Air Max';

-- 2. Zapatos Casuales Adidas
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Zapatos Casuales Adidas';

-- 3. Botas de Cuero Premium
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Botas de Cuero Premium';

-- 4. Sandalias de Verano
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1621268260866-668f6c237322?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Sandalias de Verano';

-- 5. Camiseta Casual Premium
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Camiseta Casual Premium';

-- 6. Camisa Formal Elegante
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Camisa Formal Elegante';

-- 7. Jeans Clásicos Levis
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Jeans Clásicos Levis';

-- 8. Chaqueta de Cuero
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1551028919-ac7bcb7d7153?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Chaqueta de Cuero';

-- 9. Vestido Casual Floral
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Vestido Casual Floral';

-- 10. Sudadera con Capucha
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Sudadera con Capucha';

-- 11. Bolso de Cuero Elegante
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Bolso de Cuero Elegante';

-- 12. Gorra Deportiva Nike
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Gorra Deportiva Nike';

-- 13. Cinturón de Cuero
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1624222247344-550fb60583bb?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Cinturón de Cuero';

-- 14. Gafas de Sol Polarizadas
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Gafas de Sol Polarizadas';

-- 15. Reloj Digital Deportivo
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Reloj Digital Deportivo';

-- 16. Mochila Urbana
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Mochila Urbana';

-- 17. Bufanda de Lana
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=800&auto=format&fit=crop'] 
WHERE name = 'Bufanda de Lana';

-- Verificar los cambios
SELECT name, images FROM products;
