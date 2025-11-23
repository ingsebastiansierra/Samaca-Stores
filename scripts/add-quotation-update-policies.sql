-- Políticas de UPDATE para quotations
-- Permitir que los dueños de tienda actualicen las cotizaciones de su tienda

-- Política para que los dueños de tienda puedan actualizar cotizaciones
CREATE POLICY "Store owners can update quotations for their store"
ON quotations FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = quotations.store_id
    AND stores.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = quotations.store_id
    AND stores.user_id = auth.uid()
  )
);

-- Política para que el staff de tienda pueda actualizar cotizaciones
CREATE POLICY "Store staff can update quotations for their store"
ON quotations FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM store_staff
    WHERE store_staff.store_id = quotations.store_id
    AND store_staff.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM store_staff
    WHERE store_staff.store_id = quotations.store_id
    AND store_staff.user_id = auth.uid()
  )
);
