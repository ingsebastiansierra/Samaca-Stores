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
