-- Actualizar imagen de Samacá Store
UPDATE stores SET 
  banner_url = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  logo_url = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200'
WHERE slug = 'samaca-store';

-- Verificar
SELECT name, slug, banner_url, logo_url FROM stores WHERE slug = 'samaca-store';
