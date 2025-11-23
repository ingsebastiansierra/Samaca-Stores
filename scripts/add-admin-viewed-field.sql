-- Agregar campo para rastrear si el admin vio la cotización
ALTER TABLE quotations 
ADD COLUMN IF NOT EXISTS admin_viewed_at TIMESTAMP WITH TIME ZONE;

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_quotations_admin_viewed 
ON quotations(store_id, status, admin_viewed_at);

-- Actualizar las cotizaciones existentes como no vistas (opcional)
-- UPDATE quotations SET admin_viewed_at = NULL WHERE admin_viewed_at IS NULL;
