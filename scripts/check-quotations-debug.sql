-- Ver las últimas 5 cotizaciones creadas
SELECT id, ticket, store_id, customer_name, total, created_at
FROM quotations
ORDER BY created_at DESC
LIMIT 5;

-- Ver las tiendas asociadas al usuario actual (necesito saber tu user_id, pero listaré todas las tiendas por ahora)
SELECT id, name, owner_email, user_id
FROM stores;

-- Ver staff de tiendas
SELECT store_id, user_id, role
FROM store_staff;
