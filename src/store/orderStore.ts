import { create } from "zustand";
import type { Order, CreateOrderInput, OrderStatus } from "../types/Ordertypes";
import { createOrder, cancelOrder, getAllOrders, getMyOrders, updateOrderStatus } from "../services/orderApi";
import { devtools } from "zustand/middleware";

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

  // isViewOrderModalOpen: boolean;
  // selectedOrder: Order | null;

  // Actions
  openAddOrderModal: (productId: string, price: number, name: string, imageUrl: string, quantity: number) => void;
  closeAddOrderModal: () => void;
  // openViewOrderModal: (order: Order) => void;
  // closeViewOrderModal: () => void;
  fetchMyOrders: () => Promise<void>;
  submitOrder: (input: CreateOrderInput) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  clearError: () => void;
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  devtools(
    (set, get) => ({
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

      fetchMyOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const orders = await getMyOrders();
          console.log("orders", orders);
          set({ orders, isLoading: false });
        } catch (err: any) {
          console.log("err", err);
          set({ error: err?.message ?? "Failed to fetch orders", isLoading: false });
        }
      },
      fetchAllOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const orders = await getAllOrders();
          set({ orders, isLoading: false });
        } catch (err: any) {
          console.log("err", err);
          set({ error: err?.message ?? "Failed to fetch orders", isLoading: false });
        }
      },

      updateOrderStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
          const updatedOrder = await updateOrderStatus(id, status);
          console.log("updatedOrder", updatedOrder);
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === id ? { ...o, status: updatedOrder.status, updated_at: updatedOrder.updated_at } : o,
            ),
            isLoading: false,
          }));
        } catch (err: any) {
          console.log("err", err);
          set({ error: err?.message ?? "Failed to update order status", isLoading: false });
        }
      },

      cancelOrder: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const order = await cancelOrder(id);
          set((state) => ({
            orders: state.orders.map((o) => (o.id === id ? order : o)),
            isLoading: false,
          }));
        } catch (err: any) {
          console.log("err", err);
          set({ error: err?.message ?? "Failed to cancel order", isLoading: false });
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
          console.log("err", err);
          set({ error: err?.message ?? "Failed to create order", isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: "order" },
  ),
);
