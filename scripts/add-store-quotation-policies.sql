-- Política para que los dueños de tienda vean las cotizaciones recibidas
CREATE POLICY "Store owners can view quotations for their store"
ON quotations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = quotations.store_id
    AND stores.user_id = auth.uid()
  )
);

-- Política para que el staff de tienda vea las cotizaciones recibidas
CREATE POLICY "Store staff can view quotations for their store"
ON quotations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM store_staff
    WHERE store_staff.store_id = quotations.store_id
    AND store_staff.user_id = auth.uid()
  )
);
