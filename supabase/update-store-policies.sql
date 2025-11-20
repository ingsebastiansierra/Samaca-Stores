-- =====================================================
-- ACTUALIZAR POLÍTICAS DE STORES PARA PERMITIR REGISTRO
-- =====================================================
-- Ejecuta este script para permitir que usuarios creen tiendas

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Tiendas activas son públicas" ON stores;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear tiendas" ON stores;

-- Crear políticas actualizadas
CREATE POLICY "Tiendas activas son públicas"
ON stores FOR SELECT
USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Usuarios autenticados pueden crear tiendas"
ON stores FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver las políticas de stores
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'stores'
ORDER BY policyname;

-- =====================================================
-- ✅ POLÍTICAS ACTUALIZADAS
-- Ahora los usuarios pueden:
-- 1. Ver tiendas activas (público)
-- 2. Ver sus propias tiendas (incluso si están pending)
-- 3. Crear nuevas tiendas al registrarse
-- =====================================================
