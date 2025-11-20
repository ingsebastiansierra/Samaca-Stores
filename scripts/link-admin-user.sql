-- =====================================================
-- VINCULAR USUARIO ADMIN CON TIENDA
-- =====================================================
-- Este script vincula el usuario vegasebastian073@gmail.com con una tienda

-- 1. Primero, verificar si el usuario ya tiene una tienda
DO $$
DECLARE
  v_user_id uuid;
  v_store_id uuid;
  v_existing_store_id uuid;
BEGIN
  -- Buscar el user_id por email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'vegasebastian073@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE '❌ Usuario no encontrado. Asegúrate de haber iniciado sesión al menos una vez.';
  ELSE
    RAISE NOTICE '✅ Usuario encontrado: %', v_user_id;

    -- Verificar si el usuario YA tiene una tienda vinculada
    SELECT id INTO v_existing_store_id
    FROM stores
    WHERE user_id = v_user_id
    LIMIT 1;

    IF v_existing_store_id IS NOT NULL THEN
      RAISE NOTICE '⚠️  El usuario YA tiene una tienda vinculada: %', v_existing_store_id;
      RAISE NOTICE 'No se realizarán cambios.';
    ELSE
      RAISE NOTICE '📝 El usuario NO tiene tienda. Procediendo a vincular...';

      -- Buscar una tienda sin dueño
      SELECT id INTO v_store_id
      FROM stores
      WHERE user_id IS NULL
      LIMIT 1;

      IF v_store_id IS NOT NULL THEN
        -- Vincular con tienda existente
        UPDATE stores
        SET 
          user_id = v_user_id,
          owner_email = 'vegasebastian073@gmail.com',
          status = 'active'
        WHERE id = v_store_id;
        
        RAISE NOTICE '✅ Usuario vinculado con tienda existente: %', v_store_id;
      ELSE
        -- Crear nueva tienda para el usuario
        INSERT INTO stores (
          name,
          slug,
          description,
          owner_name,
          owner_email,
          owner_phone,
          user_id,
          city,
          address,
          status
        ) VALUES (
          'Mi Tienda Admin',
          'mi-tienda-admin',
          'Tienda principal de administración',
          'Sebastian Vega',
          'vegasebastian073@gmail.com',
          '3001234567',
          v_user_id,
          'Samacá',
          'Centro',
          'active'
        ) RETURNING id INTO v_store_id;
        
        RAISE NOTICE '✅ Nueva tienda creada: %', v_store_id;
      END IF;
    END IF;
  END IF;
END $$;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver el usuario y su tienda
SELECT 
  u.email as usuario_email,
  s.name as tienda_nombre,
  s.slug as tienda_slug,
  s.status as estado
FROM auth.users u
LEFT JOIN stores s ON s.user_id = u.id
WHERE u.email = 'vegasebastian073@gmail.com';

-- =====================================================
-- ALTERNATIVA MANUAL (si el script automático no funciona)
-- =====================================================

-- Paso 1: Obtener tu user_id
-- SELECT id, email FROM auth.users WHERE email = 'vegasebastian073@gmail.com';

-- Paso 2: Ver tiendas disponibles
-- SELECT id, name, slug, user_id FROM stores;

-- Paso 3: Vincular (reemplaza USER_ID_AQUI con el id del paso 1)
-- UPDATE stores 
-- SET 
--   user_id = 'USER_ID_AQUI',
--   owner_email = 'vegasebastian073@gmail.com',
--   status = 'active'
-- WHERE slug = 'boutique-elegancia'; -- o la tienda que prefieras

-- =====================================================
-- ✅ SCRIPT COMPLETADO
-- Ejecuta este script en Supabase SQL Editor
-- =====================================================
