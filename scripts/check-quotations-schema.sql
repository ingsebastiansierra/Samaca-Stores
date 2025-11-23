-- Verificar políticas de la tabla quotations
SELECT *
FROM pg_policies
WHERE tablename = 'quotations';

-- Verificar estructura de la tabla para asegurar que las columnas coinciden
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quotations';
