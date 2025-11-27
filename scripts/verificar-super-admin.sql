-- Script para verificar si tu usuario super admin está configurado correctamente

-- 1. Verificar que la tabla user_profiles existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
) as tabla_existe;

-- 2. Verificar tu usuario en auth
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'ingsebastian073@gmail.com';

-- 3. Verificar tu perfil en user_profiles
SELECT 
  id,
  user_id,
  email,
  full_name,
  role,
  profession,
  created_at
FROM public.user_profiles 
WHERE email = 'ingsebastian073@gmail.com';

-- 4. Si no existe el perfil, créalo (reemplaza el UUID)
-- Primero obtén tu UUID con la consulta #2, luego ejecuta:
/*
INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
VALUES (
  'REEMPLAZA_CON_TU_UUID',
  'ingsebastian073@gmail.com',
  'Sebastian Sierra Pineda',
  'super_admin',
  'Ingeniero de Sistemas'
)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  full_name = 'Sebastian Sierra Pineda',
  profession = 'Ingeniero de Sistemas';
*/

-- 5. Verificar que se creó correctamente
SELECT * FROM public.user_profiles WHERE email = 'ingsebastian073@gmail.com';
