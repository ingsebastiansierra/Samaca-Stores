-- ============================================
-- SCHEMA MEJORADO - SISTEMA MULTI-TIENDA
-- Samacá Store - Plataforma para múltiples locales
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
  slug TEXT UNIQUE NOT NULL, -- URL amigable: samaca-store.com/tienda/nombre-tienda
  description TEXT,
  
  -- Información del propietario
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id), -- Usuario de Supabase Auth
  
  -- Ubicación
  address TEXT,
  city TEXT DEFAULT 'Samacá',
  department TEXT DEFAULT 'Boyacá',
  country TEXT DEFAULT 'Colombia',
  coordinates JSONB, -- {lat: 5.123, lng: -73.456}
  
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
  theme JSONB, -- Configuración de colores y estilos
  
  -- Horarios
  business_hours JSONB, -- {monday: {open: "09:00", close: "18:00"}, ...}
  
  -- Estado y suscripción
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Estadísticas
  total_products INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_sales NUMERIC DEFAULT 0,
  
  -- Metadata
  settings JSONB, -- Configuraciones adicionales
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices
  CONSTRAINT stores_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- ============================================
-- TABLA: categories (Categorías por tienda)
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  
  -- Información de la categoría
  name TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL: /tienda/categoria-nombre
  description TEXT,
  image_url TEXT,
  icon TEXT, -- Nombre del icono (lucide-react)
  
  -- Jerarquía (categorías padre/hijo)
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Orden y visibilidad
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
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
  
  -- Información básica
  name TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL: /tienda/producto-nombre
  description TEXT,
  short_description TEXT,
  
  -- Precio e inventario
  price NUMERIC NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC, -- Precio antes de descuento
  cost NUMERIC, -- Costo del producto (privado)
  sku TEXT, -- Código del producto
  barcode TEXT,
  
  -- Stock
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  low_stock_threshold INTEGER DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'low_stock', 'out_of_stock', 'discontinued')),
  track_inventory BOOLEAN DEFAULT true,
  
  -- Variantes
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  
  -- Características adicionales
  weight NUMERIC, -- Peso en gramos
  dimensions JSONB, -- {length, width, height} en cm
  material TEXT,
  brand TEXT,
  
  -- SEO y marketing
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  
  -- Visibilidad
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  featured_order INTEGER,
  
  -- Estadísticas
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(store_id, slug)
);

-- ============================================
-- TABLA: orders (Pedidos por tienda)
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  
  -- Ticket único
  ticket TEXT UNIQUE NOT NULL,
  
  -- Cliente
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  -- Dirección de entrega
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_notes TEXT,
  
  -- Items del pedido
  items JSONB NOT NULL, -- [{product_id, name, price, quantity, size, color}, ...]
  
  -- Montos
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  shipping_cost NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  
  -- Estado del pedido
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Pendiente
    'confirmed',    -- Confirmado
    'preparing',    -- Preparando
    'ready',        -- Listo para entrega
    'shipped',      -- Enviado
    'delivered',    -- Entregado
    'cancelled'     -- Cancelado
  )),
  
  -- Pago
  payment_method TEXT, -- cash, transfer, card
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Notas
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: promotions (Promociones por tienda)
-- ============================================
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  
  -- Información
  title TEXT NOT NULL,
  description TEXT,
  code TEXT, -- Código de cupón (opcional)
  
  -- Tipo de promoción
  type TEXT NOT NULL CHECK (type IN (
    'lucky_dice',
    'happy_hour',
    'combo',
    'last_units',
    'featured',
    'coupon',
    'flash_sale'
  )),
  
  -- Descuento
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC,
  discount_min INTEGER, -- Para lucky_dice
  discount_max INTEGER, -- Para lucky_dice
  
  -- Aplicabilidad
  applies_to TEXT CHECK (applies_to IN ('all', 'categories', 'products')),
  category_ids UUID[],
  product_ids UUID[],
  
  -- Condiciones
  min_purchase_amount NUMERIC,
  max_uses INTEGER, -- Límite de usos
  uses_count INTEGER DEFAULT 0,
  
  -- Vigencia
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  start_time TIME, -- Para happy_hour
  end_time TIME,   -- Para happy_hour
  
  -- Estado
  active BOOLEAN DEFAULT true,
  
  -- Metadata
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
  
  -- Movimiento
  type TEXT NOT NULL CHECK (type IN ('entry', 'exit', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  
  -- Razón
  reason TEXT,
  reference_type TEXT, -- 'order', 'manual', 'return'
  reference_id UUID, -- ID del pedido u otra referencia
  
  -- Usuario que realizó el cambio
  user_id UUID REFERENCES auth.users(id),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: store_staff (Personal de la tienda)
-- ============================================
CREATE TABLE store_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Rol
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'staff')),
  
  -- Permisos
  permissions JSONB, -- {products: true, orders: true, reports: false, ...}
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(store_id, user_id)
);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar status del producto según stock
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

-- Función para actualizar estadísticas de la tienda
CREATE OR REPLACE FUNCTION update_store_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'products' THEN
    UPDATE stores 
    SET total_products = (SELECT COUNT(*) FROM products WHERE store_id = NEW.store_id)
    WHERE id = NEW.store_id;
  ELSIF TG_TABLE_NAME = 'orders' THEN
    UPDATE stores 
    SET 
      total_orders = (SELECT COUNT(*) FROM orders WHERE store_id = NEW.store_id),
      total_sales = (SELECT COALESCE(SUM(total), 0) FROM orders WHERE store_id = NEW.store_id AND status = 'delivered')
    WHERE id = NEW.store_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_store_products_stats
  AFTER INSERT OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_store_stats();

CREATE TRIGGER update_store_orders_stats
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_store_stats();

-- ============================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- ============================================

-- Stores
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_stores_owner ON stores(user_id);

-- Categories
CREATE INDEX idx_categories_store ON categories(store_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Products
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_slug ON products(store_id, slug);

-- Orders
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_ticket ON orders(ticket);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_phone);
CREATE INDEX idx_orders_date ON orders(created_at DESC);

-- Inventory Logs
CREATE INDEX idx_inventory_store ON inventory_logs(store_id);
CREATE INDEX idx_inventory_product ON inventory_logs(product_id);
CREATE INDEX idx_inventory_date ON inventory_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_staff ENABLE ROW LEVEL SECURITY;

-- Políticas para STORES (públicas para lectura)
CREATE POLICY "Stores are viewable by everyone"
  ON stores FOR SELECT
  USING (status = 'active');

CREATE POLICY "Store owners can update their stores"
  ON stores FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para CATEGORIES (públicas para lectura)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Store staff can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM store_staff 
      WHERE store_id = categories.store_id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

-- Políticas para PRODUCTS (públicas para lectura)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Store staff can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM store_staff 
      WHERE store_id = products.store_id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

-- Políticas para ORDERS
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM store_staff 
      WHERE store_id = orders.store_id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Store staff can manage orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM store_staff 
      WHERE store_id = orders.store_id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE stores IS 'Tiendas/locales registrados en la plataforma';
COMMENT ON TABLE categories IS 'Categorías de productos por tienda';
COMMENT ON TABLE products IS 'Productos de cada tienda';
COMMENT ON TABLE orders IS 'Pedidos realizados en cada tienda';
COMMENT ON TABLE promotions IS 'Promociones y descuentos por tienda';
COMMENT ON TABLE inventory_logs IS 'Historial de movimientos de inventario';
COMMENT ON TABLE store_staff IS 'Personal y permisos de cada tienda';
