-- Habilitar RLS
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_events ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT a usuarios autenticados
CREATE POLICY "Users can create their own quotations"
ON quotations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política para permitir SELECT a usuarios autenticados (sus propias cotizaciones)
CREATE POLICY "Users can view their own quotations"
ON quotations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para permitir INSERT a quotation_events
CREATE POLICY "Users can create events for their quotations"
ON quotation_events FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM quotations
    WHERE id = quotation_id
    AND user_id = auth.uid()
  )
);

-- Política para permitir SELECT a quotation_events
CREATE POLICY "Users can view events for their quotations"
ON quotation_events FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quotations
    WHERE id = quotation_id
    AND user_id = auth.uid()
  )
);
