export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  sizes?: string[]
  colors?: string[]
  stock: number
  status: 'available' | 'low_stock' | 'out_of_stock'
  tags?: string[]
  store_id?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  ticket: string
  user_id?: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'reserved' | 'shipped' | 'delivered' | 'cancelled'
  store_id?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export interface Promotion {
  id: string
  title: string
  description: string
  type: 'lucky_dice' | 'happy_hour' | 'combo' | 'last_units' | 'featured'
  discount_min?: number
  discount_max?: number
  start_time?: string
  end_time?: string
  active: boolean
  product_ids?: string[]
  created_at: string
}

export interface InventoryLog {
  id: string
  product_id: string
  type: 'entry' | 'exit' | 'adjustment'
  quantity: number
  reason: string
  created_at: string
}

export interface Store {
  id: string
  user_id: string
  name: string
  description?: string
  address?: string
  city: string
  phone?: string
  whatsapp?: string
  email?: string
  status: 'active' | 'inactive' | 'closed'
  total_sales: number
  total_orders: number
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name: string
  role: 'super_admin' | 'store_admin' | 'user'
  profession?: string
  phone?: string
  preferred_stores?: string[]
  is_active?: boolean
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id?: string
  store_id?: string
  action: string
  entity_type: string
  entity_id?: string
  details?: Record<string, any>
  created_at: string
}

export interface StoreStats {
  id: string
  store_id: string
  total_products: number
  total_orders: number
  total_revenue: number
  total_customers: number
  avg_order_value: number
  last_order_date?: string
  updated_at: string
}

export interface StoreWithStats extends Store {
  stats?: StoreStats
  admin?: {
    email: string
    full_name: string
  }
}
