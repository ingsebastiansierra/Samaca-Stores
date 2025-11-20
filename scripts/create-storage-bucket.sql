-- =====================================================
-- CREAR BUCKET DE STORAGE PARA IMÁGENES DE PRODUCTOS
-- =====================================================

-- Crear el bucket 'product-images' (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true, -- público para que las imágenes sean accesibles
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Verificar que el bucket se creó
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'product-images';

-- =====================================================
-- CONFIGURAR POLÍTICAS DE ACCESO
-- =====================================================

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own product images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own product images" ON storage.objects;

-- Política 1: Lectura pública (cualquiera puede ver las imágenes)
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Política 2: Usuarios autenticados pueden subir imágenes
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Política 3: Usuarios pueden actualizar sus propias imágenes
CREATE POLICY "Users can update their own product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política 4: Usuarios pueden eliminar sus propias imágenes
CREATE POLICY "Users can delete their own product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Ver el bucket creado
SELECT 
  '✅ BUCKET CREADO' as resultado,
  id,
  name,
  public as es_publico,
  file_size_limit / 1024 / 1024 as limite_mb
FROM storage.buckets
WHERE id = 'product-images';

-- Ver las políticas aplicadas
SELECT 
  '✅ POLÍTICAS CONFIGURADAS' as resultado,
  policyname,
  cmd as accion
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%product images%'
ORDER BY cmd;

-- Mensaje de éxito
DO $$
BEGIN
  RAISE NOTICE '✅ Bucket "product-images" creado exitosamente';
  RAISE NOTICE '✅ Políticas de acceso configuradas';
  RAISE NOTICE '✅ Ahora puedes subir imágenes desde el admin';
END $$;
