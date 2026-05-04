// store/orderStore.ts

import { create } from "zustand";
import { ordersAPI } from "../services/orderApi";
import type { Order, CreateOrderInput } from "../types/Ordertypes";

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  fetchUserOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  createOrder: (orderData: CreateOrderInput) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchUserOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await ordersAPI.getUserOrders();
      set({ orders, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersAPI.getOrderById(orderId);
      set({ currentOrder: order, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createOrder: async (orderData: CreateOrderInput) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await ordersAPI.createOrder(orderData);
      set((state) => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        isLoading: false,
      }));
      return newOrder;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  cancelOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const cancelledOrder = await ordersAPI.cancelOrder(orderId);
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status: cancelledOrder.status } : order,
        ),
        currentOrder:
          state.currentOrder?.id === orderId
            ? { ...state.currentOrder, status: cancelledOrder.status }
            : state.currentOrder,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
