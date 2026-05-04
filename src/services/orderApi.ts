import { gql } from "graphql-request";
import { graphqlClient } from "./graphql";
import type { CreateOrderInput, CreateOrderResponse, Order } from "../types/Ordertypes";

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder(
    $user_id: ID!
    $shipping_address: String!
    $payment_method: String!
    $product_id: ID!
    $quantity: Int!
    $price: Float!
  ) {
    createOrder(
      user_id: $user_id
      shipping_address: $shipping_address
      payment_method: $payment_method
      product_id: $product_id
      quantity: $quantity
      price: $price
    ) {
      id
      user_id
      order_date
      total_amount
      status
      shipping_address
      payment_method
      created_at
      updated_at
      order_items {
        id
        product_id
        quantity
        price
        subtotal
      }
    }
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_MY_ORDERS_QUERY = gql`
  query GetMyOrders($user_id: ID!) {
    ordersByUser(user_id: $user_id) {
      id
      order_date
      total_amount
      status
      shipping_address
      payment_method
      created_at
      order_items {
        id
        product_id
        quantity
        price
        subtotal
      }
    }
  }
`;

// ─── API Functions ────────────────────────────────────────────────────────────

export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
  const data = await graphqlClient.request<CreateOrderResponse>(CREATE_ORDER_MUTATION, input);
  return data.createOrder;
};

export const getMyOrders = async (user_id: string): Promise<Order[]> => {
  const data = await graphqlClient.request<{ ordersByUser: Order[] }>(GET_MY_ORDERS_QUERY, { user_id });
  return data.ordersByUser;
};
