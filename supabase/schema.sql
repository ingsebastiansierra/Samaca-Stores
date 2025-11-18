-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'low_stock', 'out_of_stock')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reserved', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions Table
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('lucky_dice', 'happy_hour', 'combo', 'last_units', 'featured')),
  discount_min INTEGER,
  discount_max INTEGER,
  start_time TIME,
  end_time TIME,
  active BOOLEAN DEFAULT true,
  product_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Logs Table
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('entry', 'exit', 'adjustment')),
  quantity INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to update product status based on stock
CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock = 0 THEN
    NEW.status = 'out_of_stock';
  ELSIF NEW.stock <= 3 THEN
    NEW.status = 'low_stock';
  ELSE
    NEW.status = 'available';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update product status
CREATE TRIGGER product_status_trigger
BEFORE INSERT OR UPDATE OF stock ON products
FOR EACH ROW
EXECUTE FUNCTION update_product_status();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Products (public read, admin write)
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
USING (true);

CREATE POLICY "Products are insertable by authenticated users"
ON products FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users"
ON products FOR UPDATE
USING (auth.role() = 'authenticated');

-- RLS Policies for Orders
CREATE POLICY "Orders are viewable by owner or admin"
ON orders FOR SELECT
USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Orders are insertable by everyone"
ON orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Orders are updatable by authenticated users"
ON orders FOR UPDATE
USING (auth.role() = 'authenticated');

-- RLS Policies for Promotions (public read, admin write)
CREATE POLICY "Promotions are viewable by everyone"
ON promotions FOR SELECT
USING (active = true);

CREATE POLICY "Promotions are manageable by authenticated users"
ON promotions FOR ALL
USING (auth.role() = 'authenticated');

-- RLS Policies for Inventory Logs (admin only)
CREATE POLICY "Inventory logs are viewable by authenticated users"
ON inventory_logs FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Inventory logs are insertable by authenticated users"
ON inventory_logs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_ticket ON orders(ticket);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_inventory_logs_product_id ON inventory_logs(product_id);
