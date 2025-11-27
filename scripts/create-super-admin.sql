-- Script para crear el super administrador
-- Ejecuta esto en el SQL Editor de Supabase después de crear el usuario en Auth

-- 1. Primero, crea el usuario en Supabase Dashboard > Authentication > Users
--    Email: ingsebastian073@gmail.com
--    Password: [tu contraseña segura]

-- 2. Luego, obtén el UUID del usuario y reemplázalo aquí
-- Puedes obtenerlo con: SELECT id, email FROM auth.users WHERE email = 'ingsebastian073@gmail.com';

-- 3. Ejecuta este INSERT con el UUID correcto:
INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
VALUES (
  'REEMPLAZAR_CON_UUID_DEL_USUARIO',
  'ingsebastian073@gmail.com',
  'Sebastian Sierra Pineda',
  'super_admin',
  'Ingeniero de Sistemas'
)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  full_name = 'Sebastian Sierra Pineda',
  profession = 'Ingeniero de Sistemas';

-- Verificar que se creó correctamente
SELECT * FROM public.user_profiles WHERE email = 'ingsebastian073@gmail.com';
