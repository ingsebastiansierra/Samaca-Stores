import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    store_id: string;
    store?: {
      id: string;
      name: string;
      slug: string;
      whatsapp?: string;
    };
  };
  quantity: number;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getStoreGroups: () => Record<string, CartItem[]>;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Buscar si ya existe el mismo producto con las mismas variantes
          const existingIndex = state.items.findIndex(
            (i) =>
              i.product.id === item.product.id &&
              i.size === item.size &&
              i.color === item.color
          );

          if (existingIndex >= 0) {
            // Actualizar cantidad
            const newItems = [...state.items];
            newItems[existingIndex].quantity += item.quantity;
            return { items: newItems };
          }

          // Agregar nuevo item con ID único
          const newItem: CartItem = {
            ...item,
            id: `${item.product.id}-${item.size || 'no-size'}-${item.color || 'no-color'}-${Date.now()}`,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clear: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getStoreGroups: () => {
        const groups: Record<string, CartItem[]> = {};

        get().items.forEach((item) => {
          const storeId = item.product.store_id;
          if (!groups[storeId]) {
            groups[storeId] = [];
          }
          groups[storeId].push(item);
        });

        return groups;
      },
    }),
    {
      name: 'samaca-cart-storage',
    }
  )
);
