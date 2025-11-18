-- ============================================
-- PRODUCTOS DE EJEMPLO - SISTEMA MULTI-TIENDA
-- Ejecutar DESPUÉS de migration-to-multistore.sql
-- ============================================

-- Obtener IDs necesarios
DO $$
DECLARE
  v_store_id UUID;
  v_cat_zapatos UUID;
  v_cat_ropa UUID;
  v_cat_accesorios UUID;
BEGIN
  -- Obtener ID de la tienda
  SELECT id INTO v_store_id FROM stores WHERE slug = 'samaca-store';
  
  -- Obtener IDs de categorías
  SELECT id INTO v_cat_zapatos FROM categories WHERE store_id = v_store_id AND slug = 'zapatos';
  SELECT id INTO v_cat_ropa FROM categories WHERE store_id = v_store_id AND slug = 'ropa';
  SELECT id INTO v_cat_accesorios FROM categories WHERE store_id = v_store_id AND slug = 'accesorios';

  -- ============================================
  -- ZAPATOS
  -- ============================================
  
  INSERT INTO products (store_id, category_id, name, slug, description, price, stock, images, sizes, colors, tags, is_active) VALUES
  (v_store_id, v_cat_zapatos, 'Zapatos Deportivos Nike Air Max', 'zapatos-nike-air-max', 'Zapatos deportivos con tecnología Air Max para máxima comodidad', 150000, 15, 
   ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], 
   ARRAY['36', '37', '38', '39', '40', '41', '42'], 
   ARRAY['Negro', 'Blanco', 'Azul'], 
   ARRAY['nuevo', 'deportivo'], true),
  
  (v_store_id, v_cat_zapatos, 'Zapatos Casuales Adidas', 'zapatos-adidas-casual', 'Zapatos casuales elegantes para el día a día', 120000, 8, 
   ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'], 
   ARRAY['36', '37', '38', '39', '40', '41'], 
   ARRAY['Negro', 'Gris', 'Café'], 
   ARRAY['casual'], true),
  
  (v_store_id, v_cat_zapatos, 'Botas de Cuero Premium', 'botas-cuero-premium', 'Botas de cuero genuino, perfectas para clima frío', 180000, 5, 
   ARRAY['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400'], 
   ARRAY['37', '38', '39', '40', '41', '42'], 
   ARRAY['Café', 'Negro'], 
   ARRAY['nuevo', 'invierno'], true),
  
  (v_store_id, v_cat_zapatos, 'Sandalias de Verano', 'sandalias-verano', 'Sandalias cómodas y frescas para el verano', 45000, 3, 
   ARRAY['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400'], 
   ARRAY['36', '37', '38', '39', '40'], 
   ARRAY['Negro', 'Beige', 'Blanco'], 
   ARRAY['verano', 'oferta'], true);

  -- ============================================
  -- ROPA
  -- ============================================
  
  INSERT INTO products (store_id, category_id, name, slug, description, price, stock, images, sizes, colors, tags, is_active) VALUES
  (v_store_id, v_cat_ropa, 'Camiseta Casual Premium', 'camiseta-casual-premium', 'Camiseta de algodón 100% premium', 45000, 20, 
   ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'], 
   ARRAY['S', 'M', 'L', 'XL', 'XXL'], 
   ARRAY['Negro', 'Blanco', 'Gris', 'Azul'], 
   ARRAY['basico'], true),
  
  (v_store_id, v_cat_ropa, 'Camisa Formal Elegante', 'camisa-formal-elegante', 'Camisa formal de vestir, perfecta para ocasiones especiales', 75000, 12, 
   ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'], 
   ARRAY['S', 'M', 'L', 'XL'], 
   ARRAY['Blanco', 'Azul', 'Negro'], 
   ARRAY['formal', 'nuevo'], true),
  
  (v_store_id, v_cat_ropa, 'Jeans Clásicos', 'jeans-clasicos', 'Jeans de mezclilla de alta calidad', 95000, 10, 
   ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'], 
   ARRAY['28', '30', '32', '34', '36'], 
   ARRAY['Azul', 'Negro'], 
   ARRAY['clasico'], true),
  
  (v_store_id, v_cat_ropa, 'Chaqueta de Cuero', 'chaqueta-cuero', 'Chaqueta de cuero sintético de alta calidad', 150000, 6, 
   ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'], 
   ARRAY['S', 'M', 'L', 'XL'], 
   ARRAY['Negro', 'Café'], 
   ARRAY['nuevo', 'invierno'], true),
  
  (v_store_id, v_cat_ropa, 'Vestido Casual Floral', 'vestido-casual-floral', 'Vestido casual con estampado floral', 85000, 2, 
   ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'], 
   ARRAY['S', 'M', 'L'], 
   ARRAY['Floral', 'Rosa', 'Azul'], 
   ARRAY['oferta', 'verano'], true),
  
  (v_store_id, v_cat_ropa, 'Sudadera con Capucha', 'sudadera-capucha', 'Sudadera cómoda con capucha', 65000, 15, 
   ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'], 
   ARRAY['S', 'M', 'L', 'XL'], 
   ARRAY['Negro', 'Gris', 'Azul'], 
   ARRAY['casual', 'invierno'], true);

  -- ============================================
  -- ACCESORIOS
  -- ============================================
  
  INSERT INTO products (store_id, category_id, name, slug, description, price, stock, images, colors, tags, is_active) VALUES
  (v_store_id, v_cat_accesorios, 'Bolso de Cuero Elegante', 'bolso-cuero-elegante', 'Bolso de cuero genuino para toda ocasión', 85000, 8, 
   ARRAY['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400'], 
   ARRAY['Café', 'Negro', 'Beige'], 
   ARRAY['nuevo', 'elegante'], true),
  
  (v_store_id, v_cat_accesorios, 'Gorra Deportiva Nike', 'gorra-deportiva-nike', 'Gorra deportiva ajustable', 35000, 12, 
   ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'], 
   ARRAY['Negro', 'Blanco', 'Azul', 'Rojo'], 
   ARRAY['deportivo'], true),
  
  (v_store_id, v_cat_accesorios, 'Cinturón de Cuero', 'cinturon-cuero', 'Cinturón de cuero genuino con hebilla metálica', 40000, 10, 
   ARRAY['https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=400'], 
   ARRAY['Negro', 'Café'], 
   ARRAY['clasico'], true),
  
  (v_store_id, v_cat_accesorios, 'Gafas de Sol Polarizadas', 'gafas-sol-polarizadas', 'Gafas de sol con protección UV', 55000, 7, 
   ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'], 
   ARRAY['Negro', 'Café', 'Dorado'], 
   ARRAY['verano', 'nuevo'], true),
  
  (v_store_id, v_cat_accesorios, 'Reloj Digital Deportivo', 'reloj-digital-deportivo', 'Reloj digital resistente al agua', 75000, 5, 
   ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'], 
   ARRAY['Negro', 'Azul', 'Rojo'], 
   ARRAY['deportivo', 'nuevo'], true),
  
  (v_store_id, v_cat_accesorios, 'Mochila Urbana', 'mochila-urbana', 'Mochila espaciosa para laptop y uso diario', 95000, 3, 
   ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'], 
   ARRAY['Negro', 'Gris', 'Azul'], 
   ARRAY['urbano', 'oferta'], true),
  
  (v_store_id, v_cat_accesorios, 'Bufanda de Lana', 'bufanda-lana', 'Bufanda suave de lana para clima frío', 30000, 2, 
   ARRAY['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400'], 
   ARRAY['Gris', 'Negro', 'Beige', 'Rojo'], 
   ARRAY['invierno', 'oferta'], true);

END $$;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver productos creados por categoría
SELECT 
  s.name as tienda,
  c.name as categoria,
  p.name as producto,
  p.price as precio,
  p.stock,
  p.status
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN stores s ON p.store_id = s.id
ORDER BY c.name, p.name;

-- Estadísticas
SELECT 
  c.name as categoria,
  COUNT(p.id) as total_productos,
  SUM(p.stock) as stock_total,
  AVG(p.price) as precio_promedio
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name
ORDER BY c.name;

-- ============================================
-- ✅ PRODUCTOS AGREGADOS EXITOSAMENTE
-- ============================================
