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
  selectedProductQuantity: number | null;
  selectedProductImageUrl: string | null;

  // Actions
  openAddOrderModal: (productId: string, price: number, name: string, imageUrl: string, quantity: number) => void;
  closeAddOrderModal: () => void;
  fetchMyOrders: (user_id: string) => Promise<void>;
  submitOrder: (input: CreateOrderInput) => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  isAddOrderModalOpen: false,
  selectedProductId: null,
  selectedProductPrice: null,
  selectedProductName: null,
  selectedProductImageUrl: null,
  selectedProductQuantity: null,

  openAddOrderModal: (productId, price, name, imageUrl, quantity) =>
    set({
      isAddOrderModalOpen: true,
      selectedProductId: productId,
      selectedProductPrice: price,
      selectedProductName: name,
      selectedProductImageUrl: imageUrl,
      selectedProductQuantity: quantity,
    }),

  closeAddOrderModal: () =>
    set({
      isAddOrderModalOpen: false,
      selectedProductId: null,
      selectedProductPrice: null,
      selectedProductName: null,
      selectedProductImageUrl: null,
      selectedProductQuantity: null,
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
    const { selectedProductQuantity } = get();
    if (selectedProductQuantity !== null && input.quantity > selectedProductQuantity) {
      set({ error: "Requested quantity exceeds available stock", isLoading: false });
      return;
    }
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
