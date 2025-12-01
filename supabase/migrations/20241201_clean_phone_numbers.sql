-- Limpiar números de teléfono en la tabla quotations
-- Elimina espacios, guiones, paréntesis y otros caracteres no numéricos

UPDATE quotations
SET customer_phone = regexp_replace(customer_phone, '[^0-9]', '', 'g')
WHERE customer_phone ~ '[^0-9]';

-- Verificar los cambios
SELECT 
    id,
    ticket,
    customer_name,
    customer_phone,
    created_at
FROM quotations
ORDER BY created_at DESC
LIMIT 10;
