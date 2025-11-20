-- =====================================================
-- VINCULAR TIENDAS EXISTENTES CON USUARIOS
-- =====================================================
-- Este script te ayuda a crear usuarios y vincularlos con las tiendas

-- =====================================================
-- OPCIÓN 1: Crear usuarios manualmente desde Supabase Dashboard
-- =====================================================
-- 1. Ve a Authentication > Users en Supabase Dashboard
-- 2. Click en "Add user" > "Create new user"
-- 3. Ingresa email y contraseña para cada dueño de tienda
-- 4. Copia el UUID del usuario creado
-- 5. Ejecuta el UPDATE correspondiente abajo

-- =====================================================
-- OPCIÓN 2: Actualizar tiendas con user_id
-- =====================================================

-- Ejemplo: Vincular Boutique Elegancia con un usuario
-- Reemplaza 'USER_UUID_AQUI' con el UUID real del usuario

-- UPDATE stores 
-- SET user_id = 'USER_UUID_AQUI'
-- WHERE slug = 'boutique-elegancia';

-- UPDATE stores 
-- SET user_id = 'USER_UUID_AQUI'
-- WHERE slug = 'moda-urbana';

-- UPDATE stores 
-- SET user_id = 'USER_UUID_AQUI'
-- WHERE slug = 'todo-buen-precio';

-- UPDATE stores 
-- SET user_id = 'USER_UUID_AQUI'
-- WHERE slug = 'sport-zone';

-- UPDATE stores 
-- SET user_id = 'USER_UUID_AQUI'
-- WHERE slug = 'pequenos-fashionistas';

-- =====================================================
-- OPCIÓN 3: Script para crear usuarios de prueba
-- =====================================================
-- NOTA: Esto solo funciona si tienes acceso directo a auth.users
-- Normalmente se hace desde el Dashboard o mediante la API

-- =====================================================
-- VERIFICAR VINCULACIÓN
-- =====================================================

-- Ver tiendas y sus usuarios
SELECT 
  s.name as tienda,
  s.slug,
  s.owner_email,
  CASE 
    WHEN s.user_id IS NOT NULL THEN '✅ Vinculada'
    ELSE '❌ Sin vincular'
  END as estado,
  s.user_id
FROM stores s
ORDER BY s.name;

-- =====================================================
-- CREAR USUARIOS DE PRUEBA (Instrucciones)
-- =====================================================

/*
PASOS PARA VINCULAR TIENDAS CON USUARIOS:

1. CREAR USUARIOS EN SUPABASE DASHBOARD:
   - Ve a: Authentication > Users
   - Click: "Add user" > "Create new user"
   - Crea un usuario para cada tienda con estos datos:

   Boutique Elegancia:
   - Email: maria@boutiqueelegancia.com
   - Password: (elige una segura)
   
   Moda Urbana:
   - Email: carlos@modaurbana.com
   - Password: (elige una segura)
   
   Todo a Buen Precio:
   - Email: ana@todobuenprecio.com
   - Password: (elige una segura)
   
   Sport Zone:
   - Email: pedro@sportzone.com
   - Password: (elige una segura)
   
   Pequeños Fashionistas:
   - Email: laura@pequenosfashionistas.com
   - Password: (elige una segura)

2. COPIAR UUID DE CADA USUARIO:
   - Después de crear cada usuario, copia su UUID
   - Lo encuentras en la columna "ID" de la tabla de usuarios

3. EJECUTAR UPDATES:
   - Reemplaza 'USER_UUID_AQUI' con el UUID real
   - Ejecuta cada UPDATE para vincular la tienda con su usuario

Ejemplo:
UPDATE stores 
SET user_id = '123e4567-e89b-12d3-a456-426614174000'
WHERE slug = 'boutique-elegancia';

4. VERIFICAR:
   - Ejecuta la query de verificación arriba
   - Todas las tiendas deben mostrar "✅ Vinculada"

5. PROBAR LOGIN:
   - Ve a /auth/login
   - Inicia sesión con el email y contraseña de cada tienda
   - Deberías poder acceder al dashboard de administración
*/

-- =====================================================
-- FUNCIÓN HELPER: Obtener tiendas de un usuario
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_stores(user_uuid uuid)
RETURNS TABLE (
  store_id uuid,
  store_name text,
  store_slug text,
  role text
) AS $$
BEGIN
  RETURN QUERY
  -- Tiendas donde el usuario es dueño
  SELECT 
    s.id,
    s.name,
    s.slug,
    'owner'::text as role
  FROM stores s
  WHERE s.user_id = user_uuid
  
  UNION
  
  -- Tiendas donde el usuario es staff
  SELECT 
    s.id,
    s.name,
    s.slug,
    ss.role
  FROM stores s
  INNER JOIN store_staff ss ON s.id = ss.store_id
  WHERE ss.user_id = user_uuid
  AND ss.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejemplo de uso:
-- SELECT * FROM get_user_stores('USER_UUID_AQUI');

-- =====================================================
-- ✅ INSTRUCCIONES COMPLETADAS
-- Sigue los pasos arriba para vincular las tiendas
-- =====================================================
