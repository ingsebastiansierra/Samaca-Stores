// This file now re-exports useCart with a compatible API
// to maintain backward compatibility with existing code

import { useCart, type CartItem as UseCartItem } from '@/lib/hooks/useCart'

// Export the CartItem type for compatibility
export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

// Create a wrapper hook that adapts useCart to the old API
export const useCartStore = () => {
  const cart = useCart()

  return {
    items: cart.items,

    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      // Convert old format to new format
      cart.addItem({
        product: {
          id: item.productId,
          name: item.name,
          price: item.price,
          images: [item.image],
          store_id: '', // Will be set by the product data
        },
        quantity: item.quantity || 1,
        size: item.size,
        color: item.color,
      })
    },

    removeItem: (id: string) => {
      cart.removeItem(id)
    },

    updateQuantity: (id: string, quantity: number) => {
      cart.updateQuantity(id, quantity)
    },

    clearCart: () => {
      cart.clear()
    },

    getTotalItems: () => {
      return cart.getItemCount()
    },

    getTotalPrice: () => {
      return cart.getTotal()
    },
  }
}
