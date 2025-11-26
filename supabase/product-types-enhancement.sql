-- Mejoras para tipos de prendas y filtros avanzados

-- 1. Agregar columna para tipo de prenda (product_type)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS product_type text;

-- 2. Agregar columna para subtipo de prenda (product_subtype)
-- Ejemplo: type="jeans", subtype="super_tiro_alto"
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS product_subtype text;

-- 3. Agregar columna para fit/corte
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS fit text;

-- 4. Crear tabla para tipos de prendas y sus subtipos
CREATE TABLE IF NOT EXISTS public.product_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL, -- "Jeans", "Camisetas", "Vestidos"
    slug text NOT NULL UNIQUE,
    description text,
    icon text,
    image_url text,
    gender text CHECK (gender = ANY (ARRAY['hombre'::text, 'mujer'::text, 'unisex'::text, 'niño'::text, 'niña'::text])),
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 5. Crear tabla para subtipos de prendas
CREATE TABLE IF NOT EXISTS public.product_subtypes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type_id uuid NOT NULL REFERENCES public.product_types(id) ON DELETE CASCADE,
    name text NOT NULL, -- "Super tiro alto", "Baggy", "Straight leg"
    slug text NOT NULL,
    description text,
    image_url text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(product_type_id, slug)
);

-- 6. Insertar tipos de prendas comunes
INSERT INTO public.product_types (name, slug, gender, display_order) VALUES
    ('Jeans', 'jeans', 'mujer', 1),
    ('Jeans', 'jeans', 'hombre', 2),
    ('Camisetas', 'camisetas', 'mujer', 3),
    ('Camisetas', 'camisetas', 'hombre', 4),
    ('Vestidos', 'vestidos', 'mujer', 5),
    ('Chaquetas', 'chaquetas', 'mujer', 6),
    ('Chaquetas', 'chaquetas', 'hombre', 7),
    ('Pantalones', 'pantalones', 'mujer', 8),
    ('Pantalones', 'pantalones', 'hombre', 9),
    ('Faldas', 'faldas', 'mujer', 10),
    ('Shorts', 'shorts', 'mujer', 11),
    ('Shorts', 'shorts', 'hombre', 12)
ON CONFLICT (slug) DO NOTHING;

-- 7. Insertar subtipos de jeans para mujer
INSERT INTO public.product_subtypes (product_type_id, name, slug, display_order)
SELECT 
    pt.id,
    subtype.name,
    subtype.slug,
    subtype.display_order
FROM public.product_types pt
CROSS JOIN (
    VALUES 
        ('Ver todo', 'ver-todo', 0),
        ('Super tiro alto', 'super-tiro-alto', 1),
        ('Baggy', 'baggy', 2),
        ('Straight leg', 'straight-leg', 3),
        ('Mom fit', 'mom-fit', 4),
        ('90s fit', '90s-fit', 5),
        ('Boyfriend', 'boyfriend', 6),
        ('Push up', 'push-up', 7),
        ('Tendencia', 'tendencia', 8),
        ('Skinny', 'skinny', 9),
        ('Flare', 'flare', 10),
        ('Wide leg', 'wide-leg', 11)
) AS subtype(name, slug, display_order)
WHERE pt.slug = 'jeans' AND pt.gender = 'mujer'
ON CONFLICT (product_type_id, slug) DO NOTHING;

-- 8. Insertar subtipos de jeans para hombre
INSERT INTO public.product_subtypes (product_type_id, name, slug, display_order)
SELECT 
    pt.id,
    subtype.name,
    subtype.slug,
    subtype.display_order
FROM public.product_types pt
CROSS JOIN (
    VALUES 
        ('Ver todo', 'ver-todo', 0),
        ('Slim fit', 'slim-fit', 1),
        ('Regular fit', 'regular-fit', 2),
        ('Relaxed fit', 'relaxed-fit', 3),
        ('Straight', 'straight', 4),
        ('Skinny', 'skinny', 5),
        ('Baggy', 'baggy', 6),
        ('Carpenter', 'carpenter', 7)
) AS subtype(name, slug, display_order)
WHERE pt.slug = 'jeans' AND pt.gender = 'hombre'
ON CONFLICT (product_type_id, slug) DO NOTHING;

-- 9. Crear índices para mejorar el rendimiento de búsquedas
CREATE INDEX IF NOT EXISTS idx_products_product_type ON public.products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_product_subtype ON public.products(product_subtype);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_products_sizes ON public.products USING GIN(sizes);
CREATE INDEX IF NOT EXISTS idx_products_gender_type ON public.products(gender, product_type);
CREATE INDEX IF NOT EXISTS idx_products_gender_type_subtype ON public.products(gender, product_type, product_subtype);

-- 10. Crear función para obtener tallas disponibles por tipo de prenda
CREATE OR REPLACE FUNCTION get_available_sizes_by_type(
    p_gender text DEFAULT NULL,
    p_product_type text DEFAULT NULL,
    p_product_subtype text DEFAULT NULL
)
RETURNS TABLE(size text, product_count bigint) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        unnest(p.sizes) as size,
        COUNT(DISTINCT p.id) as product_count
    FROM public.products p
    WHERE 
        p.is_active = true
        AND p.stock > 0
        AND (p_gender IS NULL OR p.gender = p_gender)
        AND (p_product_type IS NULL OR p.product_type = p_product_type)
        AND (p_product_subtype IS NULL OR p.product_subtype = p_product_subtype)
    GROUP BY size
    ORDER BY 
        CASE 
            WHEN size ~ '^[0-9]+$' THEN size::integer
            ELSE 999
        END,
        size;
END;
$$ LANGUAGE plpgsql;

-- 11. Crear vista para productos con información de tipo
CREATE OR REPLACE VIEW products_with_types AS
SELECT 
    p.*,
    pt.name as type_name,
    pt.icon as type_icon,
    pst.name as subtype_name,
    pst.image_url as subtype_image
FROM public.products p
LEFT JOIN public.product_types pt ON p.product_type = pt.slug AND p.gender = pt.gender
LEFT JOIN public.product_subtypes pst ON pst.slug = p.product_subtype AND pst.product_type_id = pt.id
WHERE p.is_active = true;

-- 12. Comentarios para documentación
COMMENT ON COLUMN public.products.product_type IS 'Tipo de prenda: jeans, camisetas, vestidos, etc.';
COMMENT ON COLUMN public.products.product_subtype IS 'Subtipo de prenda: super-tiro-alto, baggy, straight-leg, etc.';
COMMENT ON COLUMN public.products.fit IS 'Ajuste de la prenda: slim, regular, relaxed, etc.';
COMMENT ON TABLE public.product_types IS 'Catálogo de tipos de prendas';
COMMENT ON TABLE public.product_subtypes IS 'Catálogo de subtipos de prendas por tipo';
