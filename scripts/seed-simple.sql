-- Script simplificado para agregar productos de prueba
-- Copia y pega este script completo en el SQL Editor de Supabase

INSERT INTO products (name, description, price, category, images, sizes, colors, stock, tags)
VALUES 
  -- ZAPATOS
  ('Zapatos Deportivos Nike Air Max', 'Zapatos deportivos con tecnología Air Max para máxima comodidad', 150000, 'zapatos', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], ARRAY['36', '37', '38', '39', '40', '41', '42'], ARRAY['Negro', 'Blanco', 'Azul'], 15, ARRAY['nuevo', 'deportivo']),
  
  ('Zapatos Casuales Adidas', 'Zapatos casuales elegantes para el día a día', 120000, 'zapatos', ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'], ARRAY['36', '37', '38', '39', '40', '41'], ARRAY['Negro', 'Gris', 'Café'], 8, ARRAY['casual']),
  
  ('Botas de Cuero Premium', 'Botas de cuero genuino, perfectas para clima frío', 180000, 'zapatos', ARRAY['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400'], ARRAY['37', '38', '39', '40', '41', '42'], ARRAY['Café', 'Negro'], 5, ARRAY['nuevo', 'invierno']),
  
  ('Sandalias de Verano', 'Sandalias cómodas y frescas para el verano', 45000, 'zapatos', ARRAY['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400'], ARRAY['36', '37', '38', '39', '40'], ARRAY['Negro', 'Beige', 'Blanco'], 3, ARRAY['verano', 'oferta']),

  -- ROPA
  ('Camiseta Casual Premium', 'Camiseta de algodón 100% premium', 45000, 'ropa', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Negro', 'Blanco', 'Gris', 'Azul'], 20, ARRAY['basico']),
  
  ('Camisa Formal Elegante', 'Camisa formal de vestir, perfecta para ocasiones especiales', 75000, 'ropa', ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blanco', 'Azul', 'Negro'], 12, ARRAY['formal', 'nuevo']),
  
  ('Jeans Clásicos', 'Jeans de mezclilla de alta calidad', 95000, 'ropa', ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'], ARRAY['28', '30', '32', '34', '36'], ARRAY['Azul', 'Negro'], 10, ARRAY['clasico']),
  
  ('Chaqueta de Cuero', 'Chaqueta de cuero sintético de alta calidad', 150000, 'ropa', ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Negro', 'Café'], 6, ARRAY['nuevo', 'invierno']),
  
  ('Vestido Casual Floral', 'Vestido casual con estampado floral', 85000, 'ropa', ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'], ARRAY['S', 'M', 'L'], ARRAY['Floral', 'Rosa', 'Azul'], 2, ARRAY['oferta', 'verano']),
  
  ('Sudadera con Capucha', 'Sudadera cómoda con capucha', 65000, 'ropa', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Negro', 'Gris', 'Azul'], 15, ARRAY['casual', 'invierno']),

  -- ACCESORIOS
  ('Bolso de Cuero Elegante', 'Bolso de cuero genuino para toda ocasión', 85000, 'accesorios', ARRAY['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400'], NULL, ARRAY['Café', 'Negro', 'Beige'], 8, ARRAY['nuevo', 'elegante']),
  
  ('Gorra Deportiva Nike', 'Gorra deportiva ajustable', 35000, 'accesorios', ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'], ARRAY['Única'], ARRAY['Negro', 'Blanco', 'Azul', 'Rojo'], 12, ARRAY['deportivo']),
  
  ('Cinturón de Cuero', 'Cinturón de cuero genuino con hebilla metálica', 40000, 'accesorios', ARRAY['https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Negro', 'Café'], 10, ARRAY['clasico']),
  
  ('Gafas de Sol Polarizadas', 'Gafas de sol con protección UV', 55000, 'accesorios', ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'], NULL, ARRAY['Negro', 'Café', 'Dorado'], 7, ARRAY['verano', 'nuevo']),
  
  ('Reloj Digital Deportivo', 'Reloj digital resistente al agua', 75000, 'accesorios', ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'], NULL, ARRAY['Negro', 'Azul', 'Rojo'], 5, ARRAY['deportivo', 'nuevo']),
  
  ('Mochila Urbana', 'Mochila espaciosa para laptop y uso diario', 95000, 'accesorios', ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'], NULL, ARRAY['Negro', 'Gris', 'Azul'], 3, ARRAY['urbano', 'oferta']),
  
  ('Bufanda de Lana', 'Bufanda suave de lana para clima frío', 30000, 'accesorios', ARRAY['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400'], NULL, ARRAY['Gris', 'Negro', 'Beige', 'Rojo'], 2, ARRAY['invierno', 'oferta']);
