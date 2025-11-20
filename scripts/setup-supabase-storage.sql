-- =====================================================
-- CONFIGURAR SUPABASE STORAGE PARA IMÁGENES
-- =====================================================

-- Crear bucket para imágenes de productos (si no existe)
-- NOTA: Esto debe ejecutarse desde el dashboard de Supabase
-- Storage > Create a new bucket
-- Nombre: product-images
-- Public: Yes (para que las imágenes sean accesibles públicamente)

-- Políticas de acceso para el bucket product-images
-- Estas políticas permiten:
-- 1. Cualquiera puede VER las imágenes (público)
-- 2. Solo usuarios autenticados pueden SUBIR imágenes
-- 3. Solo el dueño puede ELIMINAR sus imágenes

-- Política 1: Lectura pública
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Política 2: Usuarios autenticados pueden subir
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

-- Verificar políticas
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
