-- =====================================================
-- URGENTE: Arreglar recursión PRIMERO
-- =====================================================
-- Este error está bloqueando TODAS las consultas

-- PASO 1: Deshabilitar RLS en store_staff
ALTER TABLE store_staff DISABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar TODAS las políticas de store_staff
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'store_staff' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON store_staff', pol.policyname);
        RAISE NOTICE 'Eliminada: %', pol.policyname;
    END LOOP;
END $$;

-- PASO 3: Habilitar RLS nuevamente
ALTER TABLE store_staff ENABLE ROW LEVEL SECURITY;

-- PASO 4: Crear UNA SOLA política simple sin recursión
CREATE POLICY "store_staff_owner_only"
ON store_staff FOR ALL
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
)
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- VERIFICAR
SELECT 
  'POLÍTICAS DE STORE_STAFF' as info,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'store_staff';

-- Mensaje
DO $$
BEGIN
  RAISE NOTICE '✅ Recursión eliminada';
  RAISE NOTICE '✅ Ahora ejecuta el siguiente script para verificar usuarios';
END $$;
