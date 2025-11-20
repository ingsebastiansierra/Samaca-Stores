-- ============================================
-- ACTUALIZAR IMÁGENES DE TIENDAS EXISTENTES
-- ============================================
-- Este script solo actualiza las imágenes sin borrar datos

-- Boutique Elegancia - Moda elegante femenina
UPDATE stores SET 
  banner_url = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
  logo_url = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200'
WHERE slug = 'boutique-elegancia';

-- Moda Urbana - Ropa casual y streetwear
UPDATE stores SET 
  banner_url = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
  logo_url = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'
WHERE slug = 'moda-urbana';

-- Todo a Buen Precio - Ropa económica
UPDATE stores SET 
  banner_url = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
  logo_url = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200'
WHERE slug = 'todo-buen-precio';

-- Sport Zone - Ropa deportiva
UPDATE stores SET 
  banner_url = 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
  logo_url = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200'
WHERE slug = 'sport-zone';

-- Pequeños Fashionistas - Ropa infantil
UPDATE stores SET 
  banner_url = 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800',
  logo_url = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200'
WHERE slug = 'pequenos-fashionistas';

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver las tiendas con sus nuevas imágenes
SELECT 
  name,
  slug,
  CASE 
    WHEN banner_url IS NOT NULL THEN '✅ Tiene banner'
    ELSE '❌ Sin banner'
  END as banner_status,
  CASE 
    WHEN logo_url IS NOT NULL THEN '✅ Tiene logo'
    ELSE '❌ Sin logo'
  END as logo_status
FROM stores
ORDER BY name;

-- ============================================
-- ✅ ACTUALIZACIÓN COMPLETADA
-- Ahora cada tienda tiene su propia imagen única
-- ============================================
