-- ============================================
-- SISTEMA DE COTIZACIONES MULTI-TIENDA
-- ============================================

-- 1. Tabla de cotizaciones (una por tienda)
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket text UNIQUE NOT NULL, -- #COT-2024-001
  
  -- Relaciones
  store_id uuid REFERENCES stores(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  
  -- Datos del cliente (cache para WhatsApp)
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  customer_city text,
  
  -- Productos (JSON array)
  items jsonb NOT NULL,
  -- Ejemplo: [
  --   {
  --     "product_id": "uuid",
  --     "name": "Camiseta",
  --     "size": "M",
  --     "color": "Azul",
  --     "quantity": 2,
  --     "price": 35000,
  --     "subtotal": 70000,
  --     "image_url": "..."
  --   }
  -- ]
  
  -- Totales
  subtotal numeric NOT NULL,
  discount numeric DEFAULT 0,
  total numeric NOT NULL,
  
  -- Estado y seguimiento
  status text DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Enviada, esperando respuesta
    'contacted',    -- Tienda respondió
    'negotiating',  -- En conversación
    'accepted',     -- Cliente aceptó
    'converted',    -- Se convirtió en pedido
    'cancelled',    -- Cancelada
    'expired'       -- Expiró (7 días sin respuesta)
  )),
  
  -- Tracking
  whatsapp_sent_at timestamp,
  whatsapp_opened boolean DEFAULT false,
  store_responded_at timestamp,
  converted_to_order_id uuid REFERENCES orders(id),
  
  -- Notas internas
  admin_notes text,
  customer_notes text,
  
  -- Timestamps
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  expires_at timestamp DEFAULT (now() + interval '7 days')
);

-- 2. Tabla de eventos de cotización (historial)
CREATE TABLE IF NOT EXISTS quotation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES quotations(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN (
    'created',
    'whatsapp_sent',
    'whatsapp_opened',
    'store_viewed',
    'store_responded',
    'status_changed',
    'converted',
    'cancelled'
  )),
  event_data jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp DEFAULT now()
);

-- 3. Índices para performance
CREATE INDEX idx_quotations_user ON quotations(user_id);
CREATE INDEX idx_quotations_store ON quotations(store_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_created ON quotations(created_at DESC);
CREATE INDEX idx_quotation_events_quotation ON quotation_events(quotation_id);

-- 4. Función para generar ticket único
CREATE OR REPLACE FUNCTION generate_quotation_ticket()
RETURNS text AS $$
DECLARE
  year text;
  count int;
  ticket text;
BEGIN
  year := to_char(now(), 'YYYY');
  
  SELECT COUNT(*) + 1 INTO count
  FROM quotations
  WHERE ticket LIKE 'COT-' || year || '-%';
  
  ticket := 'COT-' || year || '-' || LPAD(count::text, 4, '0');
  
  RETURN ticket;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger para auto-generar ticket
CREATE OR REPLACE FUNCTION set_quotation_ticket()
RETURNS trigger AS $$
BEGIN
  IF NEW.ticket IS NULL THEN
    NEW.ticket := generate_quotation_ticket();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_quotation_ticket
  BEFORE INSERT ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION set_quotation_ticket();

-- 6. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_quotation_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quotation_timestamp
  BEFORE UPDATE ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION update_quotation_timestamp();

-- 7. RLS Policies
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_events ENABLE ROW LEVEL SECURITY;

-- Clientes ven solo sus cotizaciones
CREATE POLICY "Users can view own quotations"
  ON quotations FOR SELECT
  USING (auth.uid() = user_id);

-- Clientes pueden crear cotizaciones
CREATE POLICY "Users can create quotations"
  ON quotations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins de tienda ven cotizaciones de su tienda
CREATE POLICY "Store admins can view store quotations"
  ON quotations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM store_staff
      WHERE store_staff.store_id = quotations.store_id
      AND store_staff.user_id = auth.uid()
      AND store_staff.role IN ('owner', 'admin', 'manager')
      AND store_staff.is_active = true
    )
  );

-- Admins pueden actualizar cotizaciones de su tienda
CREATE POLICY "Store admins can update store quotations"
  ON quotations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM store_staff
      WHERE store_staff.store_id = quotations.store_id
      AND store_staff.user_id = auth.uid()
      AND store_staff.role IN ('owner', 'admin', 'manager')
      AND store_staff.is_active = true
    )
  );

-- Eventos: usuarios ven sus eventos
CREATE POLICY "Users can view own quotation events"
  ON quotation_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quotations
      WHERE quotations.id = quotation_events.quotation_id
      AND quotations.user_id = auth.uid()
    )
  );

-- 8. Vista para cotizaciones con info de tienda
CREATE OR REPLACE VIEW quotations_with_store AS
SELECT 
  q.*,
  s.name as store_name,
  s.slug as store_slug,
  s.whatsapp_number as store_whatsapp,
  s.logo_url as store_logo,
  (
    SELECT COUNT(*)
    FROM quotation_events qe
    WHERE qe.quotation_id = q.id
  ) as events_count
FROM quotations q
JOIN stores s ON s.id = q.store_id;

-- 9. Función para obtener estadísticas de cotizaciones
CREATE OR REPLACE FUNCTION get_quotation_stats(store_uuid uuid)
RETURNS jsonb AS $$
DECLARE
  stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'pending', COUNT(*) FILTER (WHERE status = 'pending'),
    'contacted', COUNT(*) FILTER (WHERE status = 'contacted'),
    'converted', COUNT(*) FILTER (WHERE status = 'converted'),
    'cancelled', COUNT(*) FILTER (WHERE status = 'cancelled'),
    'conversion_rate', 
      CASE 
        WHEN COUNT(*) > 0 THEN 
          ROUND((COUNT(*) FILTER (WHERE status = 'converted')::numeric / COUNT(*)::numeric) * 100, 2)
        ELSE 0
      END,
    'total_value', COALESCE(SUM(total), 0),
    'avg_value', COALESCE(AVG(total), 0)
  ) INTO stats
  FROM quotations
  WHERE store_id = store_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE quotations IS 'Cotizaciones de clientes por tienda';
COMMENT ON TABLE quotation_events IS 'Historial de eventos de cotizaciones';
