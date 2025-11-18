-- ============================================
-- SEED: 5 TIENDAS CON CATEGORÍAS Y PRODUCTOS
-- Ejecutar DESPUÉS de migration-to-multistore.sql
-- ============================================

-- ============================================
-- TIENDA 1: BOUTIQUE ELEGANCIA (Alta gama)
-- ============================================

INSERT INTO stores (name, slug, description, owner_name, owner_email, owner_phone, whatsapp, city, address, status)
VALUES (
  'Boutique Elegancia',
  'boutique-elegancia',
  'Moda exclusiva y elegante para mujeres que buscan destacar. Marcas reconocidas y diseños únicos.',
  'María González',
  'maria@boutiqueelegancia.com',
  '3201234567',
  '573201234567',
  'Samacá',
  'Calle 5 #12-34, Centro',
  'active'
);

-- Categorías Boutique Elegancia
INSERT INTO categories (store_id, name, slug, description, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'boutique-elegancia'), 'Vestidos de Gala', 'vestidos-gala', 'Vestidos elegantes para ocasiones especiales', true),
  ((SELECT id FROM stores WHERE slug = 'boutique-elegancia'), 'Ropa Formal', 'ropa-formal', 'Trajes y conjuntos formales', true),
  ((SELECT id FROM stores WHERE slug = 'boutique-elegancia'), 'Accesorios Premium', 'accesorios-premium', 'Bolsos, joyas y accesorios de lujo', true),
  ((SELECT id FROM stores WHERE slug = 'boutique-elegancia'), 'Zapatos de Diseñador', 'zapatos-disenador', 'Calzado exclusivo de marcas reconocidas', true);

-- Productos Boutique Elegancia
INSERT INTO products (store_id, category_id, name, slug, description, price, stock, images, sizes, colors, brand, is_featured, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'boutique-elegancia'), 
   (SELECT id FROM categories WHERE slug = 'vestidos-gala' AND store_id = (SELECT id FROM stores WHERE slug = 'boutique-elegancia')),
   'Vestido de Noche Elegante', 'vestido-noche-elegante', 'Vestido largo de noche con detalles en pedrería', 450000, 3,
   ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400'], ARRAY['S', 'M', 'L'], ARRAY['Negro', 'Azul Marino', 'Rojo'], 'Elegance', true, true),
  
  ((SELECT id FROM stores WHERE slug = 'boutique-elegancia'), 
   (SELECT id FROM categories WHERE slug = 'vestidos-gala' AND store_id = (SELECT id FROM stores WHERE slug = 'boutique-elegancia')),
   'Vestido Cóctel Sofisticado', 'vestido-coctel-sofisticado', 'Vestido corto ideal para eventos sociales', 380000, 5,
   ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'], ARRAY['S', 'M', 'L'], ARRAY['Negro', 'Dorado'], 'Chic', false, true),
  
  ((SELECT id FROM stores WHERE slug = 'boutique-elegancia'), 
   (SELECT id FROM categories WHERE slug = 'zapatos-disenador' AND store_id = (SELECT id FROM stores WHERE slug = 'boutique-elegancia')),
   'Tacones Christian Louboutin Style', 'tacones-louboutin-style', 'Tacones altos elegantes con suela roja', 520000, 4,
   ARRAY['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'], ARRAY['35', '36', '37', '38', '39'], ARRAY['Negro', 'Nude'], 'Luxury', true, true),
  
  ((SELECT id FROM stores WHERE slug = 'boutique-elegancia'), 
   (SELECT id FROM categories WHERE slug = 'accesorios-premium' AND store_id = (SELECT id FROM stores WHERE slug = 'boutique-elegancia')),
   'Bolso de Cuero Italiano', 'bolso-cuero-italiano', 'Bolso de mano en cuero genuino importado', 680000, 2,
   ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'], NULL, ARRAY['Negro', 'Café', 'Beige'], 'Milano', true, true);

-- ============================================
-- TIENDA 2: MODA URBANA (Jóvenes, casual)
-- ============================================

INSERT INTO stores (name, slug, description, owner_name, owner_email, owner_phone, whatsapp, city, address, status)
VALUES (
  'Moda Urbana',
  'moda-urbana',
  'Ropa casual y moderna para jóvenes. Estilo urbano y tendencias actuales a precios accesibles.',
  'Carlos Rodríguez',
  'carlos@modaurbana.com',
  '3109876543',
  '573109876543',
  'Samacá',
  'Carrera 8 #15-20',
  'active'
);

-- Categorías Moda Urbana
INSERT INTO categories (store_id, name, slug, description, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'moda-urbana'), 'Streetwear', 'streetwear', 'Ropa urbana y moderna', true),
  ((SELECT id FROM stores WHERE slug = 'moda-urbana'), 'Jeans y Pantalones', 'jeans-pantalones', 'Variedad de jeans y pantalones casuales', true),
  ((SELECT id FROM stores WHERE slug = 'moda-urbana'), 'Camisetas y Polos', 'camisetas-polos', 'Camisetas estampadas y polos', true),
  ((SELECT id FROM stores WHERE slug = 'moda-urbana'), 'Tenis Deportivos', 'tenis-deportivos', 'Calzado deportivo y casual', true);

-- Productos Moda Urbana
INSERT INTO products (store_id, category_id, name, slug, description, price, stock, images, sizes, colors, brand, is_featured, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'moda-urbana'), 
   (SELECT id FROM categories WHERE slug = 'streetwear' AND store_id = (SELECT id FROM stores WHERE slug = 'moda-urbana')),
   'Hoodie Oversize', 'hoodie-oversize', 'Sudadera con capucha estilo oversize', 85000, 15,
   ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Negro', 'Gris', 'Beige'], 'Urban', true, true),
  
  ((SELECT id FROM stores WHERE slug = 'moda-urbana'), 
   (SELECT id FROM categories WHERE slug = 'jeans-pantalones' AND store_id = (SELECT id FROM stores WHERE slug = 'moda-urbana')),
   'Jeans Skinny Fit', 'jeans-skinny-fit', 'Jeans ajustados de mezclilla premium', 95000, 20,
   ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'], ARRAY['28', '30', '32', '34', '36'], ARRAY['Azul', 'Negro'], 'Denim Co', true, true),
  
  ((SELECT id FROM stores WHERE slug = 'moda-urbana'), 
   (SELECT id FROM categories WHERE slug = 'camisetas-polos' AND store_id = (SELECT id FROM stores WHERE slug = 'moda-urbana')),
   'Camiseta Estampada', 'camiseta-estampada', 'Camiseta con diseños urbanos', 45000, 30,
   ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blanco', 'Negro', 'Gris'], 'Street', false, true),
  
  ((SELECT id FROM stores WHERE slug = 'moda-urbana'), 
   (SELECT id FROM categories WHERE slug = 'tenis-deportivos' AND store_id = (SELECT id FROM stores WHERE slug = 'moda-urbana')),
   'Tenis Nike Air Force', 'tenis-nike-air-force', 'Tenis clásicos estilo Nike Air Force', 180000, 12,
   ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'], ARRAY['38', '39', '40', '41', '42', '43'], ARRAY['Blanco', 'Negro'], 'Nike Style', true, true),
  
  ((SELECT id FROM stores WHERE slug = 'moda-urbana'), 
   (SELECT id FROM categories WHERE slug = 'streetwear' AND store_id = (SELECT id FROM stores WHERE slug = 'moda-urbana')),
   'Chaqueta Bomber', 'chaqueta-bomber', 'Chaqueta bomber estilo aviador', 120000, 8,
   ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Negro', 'Verde Militar'], 'Urban', false, true);

-- ============================================
-- TIENDA 3: ROPA ECONÓMICA (Precios bajos)
-- ============================================

INSERT INTO stores (name, slug, description, owner_name, owner_email, owner_phone, whatsapp, city, address, status)
VALUES (
  'Todo a Buen Precio',
  'todo-buen-precio',
  'Ropa de calidad a precios económicos. La mejor opción para vestir bien sin gastar mucho.',
  'Ana Martínez',
  'ana@todobuenprecio.com',
  '3157654321',
  '573157654321',
  'Samacá',
  'Calle 10 #8-15',
  'active'
);

-- Categorías Todo a Buen Precio
INSERT INTO categories (store_id, name, slug, description, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'todo-buen-precio'), 'Ropa Básica', 'ropa-basica', 'Prendas básicas para el día a día', true),
  ((SELECT id FROM stores WHERE slug = 'todo-buen-precio'), 'Ofertas Especiales', 'ofertas-especiales', 'Productos en promoción', true),
  ((SELECT id FROM stores WHERE slug = 'todo-buen-precio'), 'Ropa Infantil', 'ropa-infantil', 'Ropa para niños y niñas', true),
  ((SELECT id FROM stores WHERE slug = 'todo-buen-precio'), 'Calzado Económico', 'calzado-economico', 'Zapatos a precios accesibles', true);

-- Productos Todo a Buen Precio
INSERT INTO products (store_id, category_id, name, slug, description, price, stock, images, sizes, colors, is_featured, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'todo-buen-precio'), 
   (SELECT id FROM categories WHERE slug = 'ropa-basica' AND store_id = (SELECT id FROM stores WHERE slug = 'todo-buen-precio')),
   'Camiseta Básica Pack x3', 'camiseta-basica-pack', 'Pack de 3 camisetas básicas', 35000, 50,
   ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blanco', 'Negro', 'Gris'], true, true),
  
  ((SELECT id FROM stores WHERE slug = 'todo-buen-precio'), 
   (SELECT id FROM categories WHERE slug = 'ofertas-especiales' AND store_id = (SELECT id FROM stores WHERE slug = 'todo-buen-precio')),
   'Jean Clásico Oferta', 'jean-clasico-oferta', 'Jean de mezclilla en oferta', 55000, 25,
   ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'], ARRAY['28', '30', '32', '34'], ARRAY['Azul'], true, true),
  
  ((SELECT id FROM stores WHERE slug = 'todo-buen-precio'), 
   (SELECT id FROM categories WHERE slug = 'ropa-infantil' AND store_id = (SELECT id FROM stores WHERE slug = 'todo-buen-precio')),
   'Conjunto Infantil', 'conjunto-infantil', 'Conjunto de camiseta y pantalón para niños', 40000, 30,
   ARRAY['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400'], ARRAY['2', '4', '6', '8', '10'], ARRAY['Azul', 'Rojo'], false, true),
  
  ((SELECT id FROM stores WHERE slug = 'todo-buen-precio'), 
   (SELECT id FROM categories WHERE slug = 'calzado-economico' AND store_id = (SELECT id FROM stores WHERE slug = 'todo-buen-precio')),
   'Zapatos Casuales', 'zapatos-casuales-economicos', 'Zapatos casuales cómodos', 65000, 20,
   ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'], ARRAY['36', '37', '38', '39', '40'], ARRAY['Negro', 'Café'], true, true),
  
  ((SELECT id FROM stores WHERE slug = 'todo-buen-precio'), 
   (SELECT id FROM categories WHERE slug = 'ropa-basica' AND store_id = (SELECT id FROM stores WHERE slug = 'todo-buen-precio')),
   'Sudadera Sencilla', 'sudadera-sencilla', 'Sudadera básica sin capucha', 45000, 35,
   ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Gris', 'Negro'], false, true);

-- ============================================
-- TIENDA 4: DEPORTES EXTREMOS (Ropa deportiva)
-- ============================================

INSERT INTO stores (name, slug, description, owner_name, owner_email, owner_phone, whatsapp, city, address, status)
VALUES (
  'Sport Zone',
  'sport-zone',
  'Todo para deportistas. Ropa y calzado deportivo de las mejores marcas para tu rendimiento.',
  'Pedro Sánchez',
  'pedro@sportzone.com',
  '3186543210',
  '573186543210',
  'Samacá',
  'Avenida Principal #20-30',
  'active'
);

-- Categorías Sport Zone
INSERT INTO categories (store_id, name, slug, description, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'sport-zone'), 'Ropa Deportiva', 'ropa-deportiva', 'Camisetas, shorts y conjuntos deportivos', true),
  ((SELECT id FROM stores WHERE slug = 'sport-zone'), 'Calzado Running', 'calzado-running', 'Tenis especializados para correr', true),
  ((SELECT id FROM stores WHERE slug = 'sport-zone'), 'Accesorios Fitness', 'accesorios-fitness', 'Accesorios para gimnasio y entrenamiento', true),
  ((SELECT id FROM stores WHERE slug = 'sport-zone'), 'Ropa de Ciclismo', 'ropa-ciclismo', 'Ropa especializada para ciclistas', true);

-- Productos Sport Zone
INSERT INTO products (store_id, category_id, name, slug, description, price, stock, images, sizes, colors, brand, is_featured, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'sport-zone'), 
   (SELECT id FROM categories WHERE slug = 'ropa-deportiva' AND store_id = (SELECT id FROM stores WHERE slug = 'sport-zone')),
   'Conjunto Deportivo Nike', 'conjunto-deportivo-nike', 'Conjunto completo para entrenamiento', 150000, 15,
   ARRAY['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Negro', 'Azul', 'Gris'], 'Nike', true, true),
  
  ((SELECT id FROM stores WHERE slug = 'sport-zone'), 
   (SELECT id FROM categories WHERE slug = 'calzado-running' AND store_id = (SELECT id FROM stores WHERE slug = 'sport-zone')),
   'Tenis Adidas Ultraboost', 'tenis-adidas-ultraboost', 'Tenis de running con tecnología Boost', 280000, 10,
   ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], ARRAY['38', '39', '40', '41', '42', '43'], ARRAY['Negro', 'Blanco'], 'Adidas', true, true),
  
  ((SELECT id FROM stores WHERE slug = 'sport-zone'), 
   (SELECT id FROM categories WHERE slug = 'accesorios-fitness' AND store_id = (SELECT id FROM stores WHERE slug = 'sport-zone')),
   'Guantes de Gimnasio', 'guantes-gimnasio', 'Guantes profesionales para levantamiento de pesas', 35000, 25,
   ARRAY['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400'], ARRAY['S', 'M', 'L'], ARRAY['Negro'], 'FitPro', false, true),
  
  ((SELECT id FROM stores WHERE slug = 'sport-zone'), 
   (SELECT id FROM categories WHERE slug = 'ropa-ciclismo' AND store_id = (SELECT id FROM stores WHERE slug = 'sport-zone')),
   'Jersey de Ciclismo', 'jersey-ciclismo', 'Jersey profesional con bolsillos traseros', 95000, 12,
   ARRAY['https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Rojo', 'Azul', 'Negro'], 'CyclePro', true, true),
  
  ((SELECT id FROM stores WHERE slug = 'sport-zone'), 
   (SELECT id FROM categories WHERE slug = 'ropa-deportiva' AND store_id = (SELECT id FROM stores WHERE slug = 'sport-zone')),
   'Leggins Deportivos', 'leggins-deportivos', 'Leggins de compresión para mujer', 75000, 20,
   ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400'], ARRAY['S', 'M', 'L'], ARRAY['Negro', 'Gris', 'Morado'], 'FitWear', false, true);

-- ============================================
-- TIENDA 5: MODA INFANTIL (Niños)
-- ============================================

INSERT INTO stores (name, slug, description, owner_name, owner_email, owner_phone, whatsapp, city, address, status)
VALUES (
  'Pequeños Fashionistas',
  'pequenos-fashionistas',
  'Ropa linda y cómoda para niños y niñas. Calidad y estilo para los más pequeños de la casa.',
  'Laura Jiménez',
  'laura@pequenosfashionistas.com',
  '3145678901',
  '573145678901',
  'Samacá',
  'Calle 7 #10-25',
  'active'
);

-- Categorías Pequeños Fashionistas
INSERT INTO categories (store_id, name, slug, description, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'pequenos-fashionistas'), 'Ropa para Niñas', 'ropa-ninas', 'Vestidos, faldas y conjuntos para niñas', true),
  ((SELECT id FROM stores WHERE slug = 'pequenos-fashionistas'), 'Ropa para Niños', 'ropa-ninos', 'Camisetas, pantalones y conjuntos para niños', true),
  ((SELECT id FROM stores WHERE slug = 'pequenos-fashionistas'), 'Ropa de Bebé', 'ropa-bebe', 'Ropa para bebés de 0 a 2 años', true),
  ((SELECT id FROM stores WHERE slug = 'pequenos-fashionistas'), 'Calzado Infantil', 'calzado-infantil', 'Zapatos y tenis para niños', true);

-- Productos Pequeños Fashionistas
INSERT INTO products (store_id, category_id, name, slug, description, price, stock, images, sizes, colors, is_featured, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'pequenos-fashionistas'), 
   (SELECT id FROM categories WHERE slug = 'ropa-ninas' AND store_id = (SELECT id FROM stores WHERE slug = 'pequenos-fashionistas')),
   'Vestido Princesa', 'vestido-princesa', 'Vestido elegante para niñas con tul', 65000, 15,
   ARRAY['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400'], ARRAY['2', '4', '6', '8'], ARRAY['Rosa', 'Lila', 'Azul'], true, true),
  
  ((SELECT id FROM stores WHERE slug = 'pequenos-fashionistas'), 
   (SELECT id FROM categories WHERE slug = 'ropa-ninos' AND store_id = (SELECT id FROM stores WHERE slug = 'pequenos-fashionistas')),
   'Conjunto Deportivo Niño', 'conjunto-deportivo-nino', 'Conjunto de camiseta y short deportivo', 55000, 20,
   ARRAY['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400'], ARRAY['4', '6', '8', '10', '12'], ARRAY['Azul', 'Rojo', 'Verde'], true, true),
  
  ((SELECT id FROM stores WHERE slug = 'pequenos-fashionistas'), 
   (SELECT id FROM categories WHERE slug = 'ropa-bebe' AND store_id = (SELECT id FROM stores WHERE slug = 'pequenos-fashionistas')),
   'Body para Bebé Pack x3', 'body-bebe-pack', 'Pack de 3 bodies de algodón', 45000, 30,
   ARRAY['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'], ARRAY['0-3m', '3-6m', '6-12m'], ARRAY['Blanco', 'Amarillo', 'Rosa'], false, true),
  
  ((SELECT id FROM stores WHERE slug = 'pequenos-fashionistas'), 
   (SELECT id FROM categories WHERE slug = 'calzado-infantil' AND store_id = (SELECT id FROM stores WHERE slug = 'pequenos-fashionistas')),
   'Tenis Infantiles con Luces', 'tenis-infantiles-luces', 'Tenis con luces LED en la suela', 75000, 18,
   ARRAY['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400'], ARRAY['22', '24', '26', '28', '30'], ARRAY['Rosa', 'Azul', 'Negro'], true, true),
  
  ((SELECT id FROM stores WHERE slug = 'pequenos-fashionistas'), 
   (SELECT id FROM categories WHERE slug = 'ropa-ninas' AND store_id = (SELECT id FROM stores WHERE slug = 'pequenos-fashionistas')),
   'Conjunto de Falda y Blusa', 'conjunto-falda-blusa', 'Conjunto casual para niñas', 58000, 12,
   ARRAY['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=400'], ARRAY['4', '6', '8', '10'], ARRAY['Rosa', 'Blanco'], false, true);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver todas las tiendas
SELECT name, slug, city, status FROM stores ORDER BY name;

-- Ver categorías por tienda
SELECT 
  s.name as tienda,
  c.name as categoria,
  COUNT(p.id) as total_productos
FROM stores s
LEFT JOIN categories c ON s.id = c.store_id
LEFT JOIN products p ON c.id = p.category_id
GROUP BY s.name, c.name
ORDER BY s.name, c.name;

-- Ver total de productos por tienda
SELECT 
  s.name as tienda,
  COUNT(p.id) as total_productos,
  SUM(p.stock) as stock_total
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.name
ORDER BY s.name;

-- ============================================
-- ✅ SEED COMPLETADO
-- 5 tiendas creadas con categorías y productos
-- ============================================
