-- Script para actualizar las imágenes de los productos específicos proporcionados
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Camiseta Básica
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'] 
WHERE name = 'Camiseta Básica';

-- 2. Jeans Clásico
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'] 
WHERE name = 'Jeans Clásico';

-- 3. Chaqueta Casual
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'] 
WHERE name = 'Chaqueta Casual';

-- 4. Vestido Elegante
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'] 
WHERE name = 'Vestido Elegante';

-- 5. Zapatillas Deportivas
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'] 
WHERE name = 'Zapatillas Deportivas';

-- 6. Camiseta Unisex
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1625910513394-ea511bed44ca?q=80&w=735&auto=format&fit=crop'] 
WHERE name = 'Camiseta Unisex';

-- Verificar los cambios para estos productos
SELECT name, images FROM products WHERE name IN (
  'Camiseta Básica',
  'Jeans Clásico',
  'Chaqueta Casual',
  'Vestido Elegante',
  'Zapatillas Deportivas',
  'Camiseta Unisex'
);
