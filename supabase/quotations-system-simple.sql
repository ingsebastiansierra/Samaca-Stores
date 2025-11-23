-- ============================================
-- SISTEMA DE COTIZACIONES - VERSION SIMPLE
-- Solo tablas básicas, sin RLS complejo
-- ============================================

-- 1. Tabla de cotizaciones
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket text UNIQUE NOT NULL,
  
  -- Relaciones
  store_id uuid REFERENCES stores(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  
  -- Datos del cliente
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  customer_city text,
  
  -- Productos (JSON)
  items jsonb NOT NULL,
  
  -- Totales
  subtotal numeric NOT NULL,
  discount numeric DEFAULT 0,
  total numeric NOT NULL,
  
  -- Estado
  status text DEFAULT 'pending' CHECK (status IN (
    'pending',
    'contacted',
    'negotiating',
    'accepted',
    'converted',
    'cancelled',
    'expired'
  )),
  
  -- Tracking
  whatsapp_sent_at timestamp,
  whatsapp_opened boolean DEFAULT false,
  store_responded_at timestamp,
  converted_to_order_id uuid REFERENCES orders(id),
  
  -- Notas
  admin_notes text,
  customer_notes text,
  
  -- Timestamps
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  expires_at timestamp DEFAULT (now() + interval '7 days')
);

-- 2. Tabla de eventos
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

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_quotations_user ON quotations(user_id);
CREATE INDEX IF NOT EXISTS idx_quotations_store ON quotations(store_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created ON quotations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotation_events_quotation ON quotation_events(quotation_id);

-- 4. Función para generar ticket
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
  IF NEW.ticket IS NULL OR NEW.ticket = '' THEN
    NEW.ticket := generate_quotation_ticket();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_quotation_ticket ON quotations;
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

DROP TRIGGER IF EXISTS trigger_update_quotation_timestamp ON quotations;
CREATE TRIGGER trigger_update_quotation_timestamp
  BEFORE UPDATE ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION update_quotation_timestamp();

-- 7. RLS Básico
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_events ENABLE ROW LEVEL SECURITY;

-- Políticas simples
DROP POLICY IF EXISTS "Users can view own quotations" ON quotations;
CREATE POLICY "Users can view own quotations"
  ON quotations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create quotations" ON quotations;
CREATE POLICY "Users can create quotations"
  ON quotations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Store staff can view store quotations" ON quotations;
CREATE POLICY "Store staff can view store quotations"
  ON quotations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM store_staff
      WHERE store_staff.store_id = quotations.store_id
      AND store_staff.user_id = auth.uid()
      AND store_staff.is_active = true
    )
  );

DROP POLICY IF EXISTS "Store staff can update store quotations" ON quotations;
CREATE POLICY "Store staff can update store quotations"
  ON quotations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM store_staff
      WHERE store_staff.store_id = quotations.store_id
      AND store_staff.user_id = auth.uid()
      AND store_staff.is_active = true
    )
  );

-- Eventos: usuarios ven sus eventos
DROP POLICY IF EXISTS "Users can view own quotation events" ON quotation_events;
CREATE POLICY "Users can view own quotation events"
  ON quotation_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quotations
      WHERE quotations.id = quotation_events.quotation_id
      AND quotations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create quotation events" ON quotation_events;
CREATE POLICY "Users can create quotation events"
  ON quotation_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotations
      WHERE quotations.id = quotation_events.quotation_id
      AND quotations.user_id = auth.uid()
    )
  );

-- 8. Vista con info de tienda
CREATE OR REPLACE VIEW quotations_with_store AS
SELECT 
  q.*,
  s.name as store_name,
  s.slug as store_slug,
  s.whatsapp as store_whatsapp,
  s.logo_url as store_logo,
  (
    SELECT COUNT(*)
    FROM quotation_events qe
    WHERE qe.quotation_id = q.id
  ) as events_count
FROM quotations q
JOIN stores s ON s.id = q.store_id;

-- 9. Función de estadísticas
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

-- Comentarios
COMMENT ON TABLE quotations IS 'Cotizaciones de clientes por tienda';
COMMENT ON TABLE quotation_events IS 'Historial de eventos de cotizaciones';
COMMENT ON VIEW quotations_with_store IS 'Vista de cotizaciones con información de la tienda';

-- ✅ Listo! Ahora puedes usar el sistema de cotizaciones
