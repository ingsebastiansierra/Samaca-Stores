-- Crear tabla de perfiles de usuario con roles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'store_admin', 'user')),
  profession TEXT,
  phone TEXT,
  preferred_stores UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

-- Agregar campos adicionales a la tabla stores
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed'));
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS total_sales DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0;

-- Crear tabla de logs de actividad
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_store_id ON public.activity_logs(store_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Crear tabla de estadísticas agregadas por tienda
CREATE TABLE IF NOT EXISTS public.store_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_products INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  avg_order_value DECIMAL(10,2) DEFAULT 0,
  last_order_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_store_stats_store_id ON public.store_stats(store_id);

-- Agregar campos a orders para mejor tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL;

-- Función para actualizar estadísticas de tienda
CREATE OR REPLACE FUNCTION update_store_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO public.store_stats (store_id, total_orders, total_revenue, last_order_date, updated_at)
    SELECT 
      NEW.store_id,
      COUNT(*),
      COALESCE(SUM(total), 0),
      MAX(created_at),
      NOW()
    FROM public.orders
    WHERE store_id = NEW.store_id
    ON CONFLICT (store_id) 
    DO UPDATE SET
      total_orders = EXCLUDED.total_orders,
      total_revenue = EXCLUDED.total_revenue,
      last_order_date = EXCLUDED.last_order_date,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estadísticas automáticamente
DROP TRIGGER IF EXISTS trigger_update_store_stats ON public.orders;
CREATE TRIGGER trigger_update_store_stats
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_store_stats();

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_stats ENABLE ROW LEVEL SECURITY;

-- Super admins pueden ver todo
CREATE POLICY "Super admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update all profiles" ON public.user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Activity logs
CREATE POLICY "Super admins can view all logs" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Store admins can view their store logs" ON public.activity_logs
  FOR SELECT USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- Store stats
CREATE POLICY "Super admins can view all stats" ON public.store_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Store admins can view their stats" ON public.store_stats
  FOR SELECT USING (
    store_id IN (
      SELECT id FROM public.stores WHERE user_id = auth.uid()
    )
  );

-- Insertar el super admin principal
-- NOTA: Primero debes crear el usuario en Supabase Auth con el email ingsebastian073@gmail.com
-- Luego ejecuta este INSERT con el UUID correcto del usuario
-- INSERT INTO public.user_profiles (user_id, email, full_name, role, profession)
-- VALUES (
--   'UUID_DEL_USUARIO_AQUI',
--   'ingsebastian073@gmail.com',
--   'Sebastian Sierra Pineda',
--   'super_admin',
--   'Ingeniero de Sistemas'
-- );
