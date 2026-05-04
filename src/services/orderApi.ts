// services/ordersApi.ts

import { graphqlClient } from "./graphql";
import type { Order, CreateOrderInput } from "../types/Ordertypes";

export const ordersAPI = {
  // Get all orders for current user
  getUserOrders: async (): Promise<Order[]> => {
    const query = `
      query GetUserOrders {
        getUserOrders {
          id
          order_date
          total_amount
          status
          shipping_address
          payment_method
          created_at
          updated_at
          items {
            id
            quantity
            price
            subtotal
            product_id
            product {
              id
              name
              price
              image
            }
          }
        }
      }
    `;

    const response = await graphqlClient.request<{ getUserOrders: Order[] }>(query);
    return response.getUserOrders;
  },

  // Get single order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const query = `
      query GetOrder($orderId: String!) {
        getOrder(orderId: $orderId) {
          id
          order_date
          total_amount
          status
          shipping_address
          payment_method
          created_at
          updated_at
          items {
            id
            quantity
            price
            subtotal
            product_id
            product {
              id
              name
              price
              image
            }
          }
        }
      }
    `;

    const variables = { orderId };
    const response = await graphqlClient.request<{ getOrder: Order }>(query, variables);
    return response.getOrder;
  },

  // Create new order - SIMPLE VERSION
  createOrder: async (input: CreateOrderInput): Promise<Order> => {
    const mutation = `
      mutation CreateOrder($input: OrderInput!) {
        createOrder(input: $input) {
          id
          order_date
          total_amount
          status
          shipping_address
          payment_method
          created_at
        }
      }
    `;

    const variables = { input };
    const response = await graphqlClient.request<{ createOrder: Order }>(mutation, variables);
    return response.createOrder;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const mutation = `
      mutation CancelOrder($orderId: String!) {
        cancelOrder(orderId: $orderId) {
          id
          status
          updated_at
        }
      }
    `;

    const variables = { orderId };
    const response = await graphqlClient.request<{ cancelOrder: Order }>(mutation, variables);
    return response.cancelOrder;
  },
};
