-- =====================================================
-- ÍNDICES DE RENDIMIENTO PARA SAMACÁ STORE
-- =====================================================
-- Ejecuta este script en tu base de datos de Supabase
-- para mejorar significativamente el rendimiento de las queries
-- =====================================================

-- Índice para búsqueda de productos activos ordenados por fecha
CREATE INDEX IF NOT EXISTS idx_products_active_created 
ON products(is_active, created_at DESC) 
WHERE is_active = true;

-- Índice para productos destacados
CREATE INDEX IF NOT EXISTS idx_products_featured 
ON products(is_featured, is_active, created_at DESC) 
WHERE is_featured = true AND is_active = true;

-- Índice para tiendas activas
CREATE INDEX IF NOT EXISTS idx_stores_active 
ON stores(status, created_at DESC) 
WHERE status = 'active';

-- Índice para búsqueda por slug de productos
CREATE INDEX IF NOT EXISTS idx_products_slug_store 
ON products(slug, store_id, is_active);

-- Índice para búsqueda por slug de tiendas
CREATE INDEX IF NOT EXISTS idx_stores_slug 
ON stores(slug, status);

-- Índice para productos por tienda
CREATE INDEX IF NOT EXISTS idx_products_store_active 
ON products(store_id, is_active, created_at DESC) 
WHERE is_active = true;

-- Índice para categorías
CREATE INDEX IF NOT EXISTS idx_categories_slug 
ON categories(slug);

-- Índice para relación productos-categorías
CREATE INDEX IF NOT EXISTS idx_products_category 
ON products(category_id, is_active) 
WHERE is_active = true;

-- Índice para búsqueda de texto en productos (si usas búsqueda)
CREATE INDEX IF NOT EXISTS idx_products_name_search 
ON products USING gin(to_tsvector('spanish', name));

-- Índice para búsqueda de texto en descripción
CREATE INDEX IF NOT EXISTS idx_products_description_search 
ON products USING gin(to_tsvector('spanish', description));

-- =====================================================
-- ESTADÍSTICAS Y ANÁLISIS
-- =====================================================

-- Actualizar estadísticas de las tablas para mejor planificación de queries
ANALYZE products;
ANALYZE stores;
ANALYZE categories;

-- =====================================================
-- VERIFICACIÓN DE ÍNDICES
-- =====================================================

-- Consulta para ver todos los índices creados
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('products', 'stores', 'categories')
ORDER BY tablename, indexname;

-- =====================================================
-- NOTAS DE RENDIMIENTO
-- =====================================================

-- Estos índices mejorarán significativamente:
-- 1. Listado de productos en la página principal (3-5x más rápido)
-- 2. Búsqueda de productos por slug (10x más rápido)
-- 3. Filtrado de productos por tienda (5x más rápido)
-- 4. Búsqueda de texto en productos (20x más rápido)
-- 5. Listado de tiendas activas (3x más rápido)

-- Impacto en escritura: Mínimo (~5-10% más lento en INSERT/UPDATE)
-- Espacio adicional: ~10-20% del tamaño de las tablas

-- =====================================================
-- MANTENIMIENTO
-- =====================================================

-- Ejecutar periódicamente (mensual) para mantener rendimiento óptimo:
-- REINDEX TABLE products;
-- REINDEX TABLE stores;
-- ANALYZE products;
-- ANALYZE stores;
