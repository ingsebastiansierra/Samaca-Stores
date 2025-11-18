-- ============================================
-- MIGRACIÓN A SISTEMA MULTI-TIENDA
-- ⚠️ ADVERTENCIA: Este script eliminará las tablas existentes
-- ⚠️ Asegúrate de hacer backup si tienes datos importantes
-- ============================================

-- ============================================
-- PASO 1: ELIMINAR TABLAS ANTIGUAS
-- ============================================

-- Deshabilitar RLS temporalmente
ALTER TABLE IF EXISTS inventory_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS promotions DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas RLS antiguas
DROP POLICY IF EXISTS "Inventory logs are viewable by authenticated users" ON inventory_logs;
DROP POLICY IF EXISTS "Inventory logs are insertable by authenticated users" ON inventory_logs;
DROP POLICY IF EXISTS "Orders are viewable by owner or admin" ON orders;
DROP POLICY IF EXISTS "Orders are insertable by everyone" ON orders;
DROP POLICY IF EXISTS "Orders are updatable by authenticated users" ON orders;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Products are insertable by authenticated users" ON products;
DROP POLICY IF EXISTS "Products are updatable by authenticated users" ON products;
DROP POLICY IF EXISTS "Promotions are viewable by everyone" ON promotions;
DROP POLICY IF EXISTS "Promotions are manageable by authenticated users" ON promotions;

-- Eliminar triggers antiguos
DROP TRIGGER IF EXISTS product_status_trigger ON products;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

-- Eliminar funciones antiguas
DROP FUNCTION IF EXISTS update_product_status();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Eliminar tablas en orden (respetando foreign keys)
DROP TABLE IF EXISTS inventory_logs CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- ============================================
-- PASO 2: CREAR NUEVA ESTRUCTURA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: stores (Locales/Tiendas)
-- ============================================
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Información básica
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Información del propietario
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- Ubicación
  address TEXT,
  city TEXT DEFAULT 'Samacá',
  department TEXT DEFAULT 'Boyacá',
  country TEXT DEFAULT 'Colombia',
  coordinates JSONB,
  
  -- Contacto y redes
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  facebook TEXT,
  instagram TEXT,
  
  -- Configuración de la tienda
  logo_url TEXT,
  banner_url TEXT,
  primary_color TEXT DEFAULT '#0284c7',
  theme JSONB,
  
  -- Horarios
  business_hours JSONB,
  
  -- Estado y suscripción
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Estadísticas
  total_products INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_sales NUMERIC DEFAULT 0,
  
  -- Metadata
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT stores_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- ============================================
-- TABLA: categories (Categorías por tienda)
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(store_id, slug),
  CONSTRAINT categories_no_self_parent CHECK (id != parent_id)
);

-- ============================================
-- TABLA: products (Productos por categoría)
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  
  price NUMERIC NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC,
  cost NUMERIC,
  sku TEXT,
  barcode TEXT,
  
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  low_stock_threshold INTEGER DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'low_stock', 'out_of_stock', 'discontinued')),
  track_inventory BOOLEAN DEFAULT true,
  
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  
  weight NUMERIC,
  dimensions JSONB,
  material TEXT,
  brand TEXT,
  
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  featured_order INTEGER,
  
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(store_id, slug)
);

-- ============================================
-- TABLA: orders (Pedidos por tienda)
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  
  ticket TEXT UNIQUE NOT NULL,
  
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_notes TEXT,
  
  items JSONB NOT NULL,
  
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  shipping_cost NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'preparing', 'ready', 'shipped', 'delivered', 'cancelled'
  )),
  
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  paid_at TIMESTAMP WITH TIME ZONE,
  
  customer_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: promotions (Promociones por tienda)
-- ============================================
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  code TEXT,
  
  type TEXT NOT NULL CHECK (type IN (
    'lucky_dice', 'happy_hour', 'combo', 'last_units', 'featured', 'coupon', 'flash_sale'
  )),
  
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC,
  discount_min INTEGER,
  discount_max INTEGER,
  
  applies_to TEXT CHECK (applies_to IN ('all', 'categories', 'products')),
  category_ids UUID[],
  product_ids UUID[],
  
  min_purchase_amount NUMERIC,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  start_time TIME,
  end_time TIME,
  
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: inventory_logs (Historial de inventario)
-- ============================================
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN ('entry', 'exit', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  
  reason TEXT,
  reference_type TEXT,
  reference_id UUID,
  
  user_id UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: store_staff (Personal de la tienda)
-- ============================================
CREATE TABLE store_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'staff')),
  
  permissions JSONB,
  
  is_active BOOLEAN DEFAULT true,
  
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(store_id, user_id)
);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.track_inventory THEN
    IF NEW.stock = 0 THEN
      NEW.status = 'out_of_stock';
    ELSIF NEW.stock <= NEW.low_stock_threshold THEN
      NEW.status = 'low_stock';
    ELSE
      NEW.status = 'available';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_status_trigger
  BEFORE INSERT OR UPDATE OF stock ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_status();

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_categories_store ON categories(store_id);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_ticket ON orders(ticket);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stores are viewable by everyone"
  ON stores FOR SELECT USING (status = 'active');

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (is_active = true);

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT WITH CHECK (true);

-- ============================================
-- PASO 3: CREAR TIENDA POR DEFECTO
-- ============================================

INSERT INTO stores (
  name, 
  slug, 
  owner_name, 
  owner_email, 
  owner_phone,
  whatsapp,
  city,
  status
) VALUES (
  'Samacá Store',
  'samaca-store',
  'Administrador',
  'admin@samacastore.com',
  '3123106507',
  '573123106507',
  'Samacá',
  'active'
);

-- ============================================
-- PASO 4: CREAR CATEGORÍAS POR DEFECTO
-- ============================================

INSERT INTO categories (store_id, name, slug, is_active) VALUES
  ((SELECT id FROM stores WHERE slug = 'samaca-store'), 'Ropa', 'ropa', true),
  ((SELECT id FROM stores WHERE slug = 'samaca-store'), 'Zapatos', 'zapatos', true),
  ((SELECT id FROM stores WHERE slug = 'samaca-store'), 'Accesorios', 'accesorios', true);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver tiendas creadas
SELECT id, name, slug, status FROM stores;

-- Ver categorías creadas
SELECT c.name, s.name as store_name 
FROM categories c 
JOIN stores s ON c.store_id = s.id;

-- ============================================
-- ✅ MIGRACIÓN COMPLETADA
-- ============================================

-- Ahora puedes ejecutar el script de productos:
-- scripts/seed-products-multistore.sql
