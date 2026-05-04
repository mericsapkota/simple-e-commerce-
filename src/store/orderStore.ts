import { create } from "zustand";
import type { Order, CreateOrderInput } from "../types/Ordertypes";
import { createOrder, getMyOrders } from "../services/orderApi";

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  // Modal state
  isAddOrderModalOpen: boolean;
  selectedProductId: string | null;
  selectedProductPrice: number | null;
  selectedProductName: string | null;

  // Actions
  openAddOrderModal: (productId: string, price: number, name: string) => void;
  closeAddOrderModal: () => void;
  fetchMyOrders: (user_id: string) => Promise<void>;
  submitOrder: (input: CreateOrderInput) => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  isAddOrderModalOpen: false,
  selectedProductId: null,
  selectedProductPrice: null,
  selectedProductName: null,

  openAddOrderModal: (productId, price, name) =>
    set({
      isAddOrderModalOpen: true,
      selectedProductId: productId,
      selectedProductPrice: price,
      selectedProductName: name,
    }),

  closeAddOrderModal: () =>
    set({
      isAddOrderModalOpen: false,
      selectedProductId: null,
      selectedProductPrice: null,
      selectedProductName: null,
    }),

  fetchMyOrders: async (user_id) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await getMyOrders(user_id);
      set({ orders, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to fetch orders", isLoading: false });
    }
  },

  submitOrder: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await createOrder(input);
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
        isAddOrderModalOpen: false,
        selectedProductId: null,
        selectedProductPrice: null,
        selectedProductName: null,
      }));
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to create order", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
