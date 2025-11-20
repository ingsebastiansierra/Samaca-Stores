-- =====================================================
-- FIX: Recursión infinita en store_staff
-- =====================================================
-- El problema: Las políticas de stores/products hacen
-- referencia a store_staff, y store_staff hace referencia
-- a sí misma, creando un loop infinito

-- PASO 1: Ver políticas actuales de store_staff
SELECT 
  'POLÍTICAS ACTUALES DE STORE_STAFF' as info,
  policyname,
  cmd,
  qual as using_clause
FROM pg_policies
WHERE tablename = 'store_staff';

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
        RAISE NOTICE 'Eliminada política de store_staff: %', pol.policyname;
    END LOOP;
END $$;

-- PASO 3: Crear políticas SIMPLES sin recursión
-- Solo el dueño de la tienda puede ver/gestionar su staff
CREATE POLICY "store_staff_select"
ON store_staff FOR SELECT
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "store_staff_insert"
ON store_staff FOR INSERT
WITH CHECK (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "store_staff_update"
ON store_staff FOR UPDATE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

CREATE POLICY "store_staff_delete"
ON store_staff FOR DELETE
USING (
  store_id IN (SELECT id FROM stores WHERE user_id = auth.uid())
);

-- PASO 4: Simplificar políticas de stores (eliminar referencia a store_staff)
DROP POLICY IF EXISTS "stores_update" ON stores;
DROP POLICY IF EXISTS "Dueños pueden actualizar su tienda" ON stores;
DROP POLICY IF EXISTS "stores_owner_update" ON stores;

CREATE POLICY "stores_update_simple"
ON stores FOR UPDATE
USING (auth.uid() = user_id);

-- VERIFICACIÓN
SELECT 
  'POLÍTICAS FINALES DE STORE_STAFF' as info,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'store_staff'
ORDER BY cmd, policyname;

SELECT 
  'POLÍTICAS FINALES DE STORES' as info,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'stores'
ORDER BY cmd, policyname;
