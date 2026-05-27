import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalQuantity: number;
  imageUrl?: string;
};

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (newItem) =>
          set((state) => {
            const existingItem = state.items.find((item) => item.id === newItem.id);
            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item,
                ),
              };
            }
            return { items: [...state.items, newItem] };
          }),

        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          })),

        updateQuantity: (id, quantity) =>
          set((state) => ({
            items: state.items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
          })),

        clearCart: () => set({ items: [] }),

        getTotalItems: () => {
          return get().items.reduce((sum, item) => sum + item.quantity, 0);
        },

        getTotalPrice: () => {
          return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
      }),
      {
        name: "cart-storage",
      },
    ),
    { name: "cart" },
  ),
);
