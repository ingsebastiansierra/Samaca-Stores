-- Crear tabla para guardar respuestas de cotizaciones
CREATE TABLE IF NOT EXISTS quotation_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  
  -- Items con precios ajustados
  items JSONB NOT NULL,
  
  -- Totales
  original_total DECIMAL(10, 2) NOT NULL,
  adjusted_total DECIMAL(10, 2) NOT NULL,
  total_discount DECIMAL(10, 2) NOT NULL,
  discount_percentage INTEGER NOT NULL,
  
  -- Detalles de la respuesta
  notes TEXT,
  valid_until_days INTEGER NOT NULL DEFAULT 7,
  valid_until_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Índices
  CONSTRAINT quotation_responses_quotation_id_key UNIQUE(quotation_id)
);

-- Índices para búsqueda rápida
CREATE INDEX idx_quotation_responses_quotation_id ON quotation_responses(quotation_id);
CREATE INDEX idx_quotation_responses_store_id ON quotation_responses(store_id);
CREATE INDEX idx_quotation_responses_created_at ON quotation_responses(created_at DESC);

-- RLS Policies
ALTER TABLE quotation_responses ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver todo
CREATE POLICY "Super admins can view all quotation responses"
  ON quotation_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

-- Store admins pueden ver sus propias respuestas
CREATE POLICY "Store admins can view their quotation responses"
  ON quotation_responses FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Store admins pueden crear respuestas para sus cotizaciones
CREATE POLICY "Store admins can create quotation responses"
  ON quotation_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Store admins pueden actualizar sus respuestas
CREATE POLICY "Store admins can update their quotation responses"
  ON quotation_responses FOR UPDATE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Super admins pueden hacer todo
CREATE POLICY "Super admins can manage all quotation responses"
  ON quotation_responses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'super_admin'
    )
  );

COMMENT ON TABLE quotation_responses IS 'Almacena las respuestas de cotizaciones con precios ajustados';
