import { gql } from "graphql-request";
import { graphqlClient } from "./graphql";
import type {
  CreateOrderInput,
  UpdateOrderInput,
  CreateOrderResponse,
  Order,
  UpdateOrderResponse,
} from "../types/Ordertypes";

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      user {
        id
      }
      order_date
      total_amount
      status
      shipping_address
      payment_method
      created_at
      updated_at
      order_items {
        id
        product {
          id
        }
        quantity
        price
        subtotal
      }
    }
  }
`;

export const GET_MY_ORDERS_QUERY = gql`
  query GetMyOrders {
    ordersByUser {
      id
      order_date
      total_amount
      status
      shipping_address
      payment_method
      created_at
      order_items {
        quantity
        product {
          id
          name
          image
        }
        price
        subtotal
      }
    }
  }
`;

export const GET_ORDER_BY_ID_QUERY = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
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

export const UPDATE_ORDER_MUTATION = gql`
  mutation UpdateOrder($id: ID!, $shipping_address: String, $payment_method: String, $status: String, $quantity: Int) {
    updateOrder(
      id: $id
      shipping_address: $shipping_address
      payment_method: $payment_method
      status: $status
      quantity: $quantity
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

const getAllOrdersMutatioin = gql`
  query GetAllOrders {
    getAllOrders {
      id
      order_items {
        product {
          image
          name
        }
      }
      created_at
      status
      updated_at
      shipping_address
      payment_method
      total_amount
    }
  }
`;
const updateMyOrderMutation = gql``;

export const DELETE_ORDER_MUTATION = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      id
    }
  }
`;

const updateOrderStatusMutation = gql`
  mutation UpdateOrderStatus($id: String!, $status: OrderStatus!) {
    updateOrder(id: $id, status: $status) {
      id
      status
      updated_at
    }
  }
`;
export const updateOrderStatus = async (id: string, status: string): Promise<UpdateOrderResponse> => {
  const data = await graphqlClient.request<{ updateOrder: UpdateOrderResponse }>(updateOrderStatusMutation, {
    id,
    status,
  });
  return data.updateOrder;
};

// ─── API Functions ────────────────────────────────────────────────────────────

export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
  const data = await graphqlClient.request<{ createOrder: Order }>(CREATE_ORDER_MUTATION, {
    input: {
      shipping_address: input.shipping_address,
      payment_method: input.payment_method,
      order_items: [
        {
          product_id: input.product_id,
          quantity: input.quantity,
        },
      ],
    },
  });
  return data.createOrder;
};

export const getAllOrders = async () => {
  const data = await graphqlClient.request<{ getAllOrders: Order[] }>(getAllOrdersMutatioin);
  return data.getAllOrders;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const data = await graphqlClient.request<{ ordersByUser: Order[] }>(GET_MY_ORDERS_QUERY);
  return data.ordersByUser;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const data = await graphqlClient.request<{ order: Order }>(GET_ORDER_BY_ID_QUERY, { id });
  return data.order;
};

export const updateOrder = async (input: UpdateOrderInput): Promise<Order> => {
  const data = await graphqlClient.request<{ updateOrder: Order }>(UPDATE_ORDER_MUTATION, input);
  return data.updateOrder;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await graphqlClient.request(DELETE_ORDER_MUTATION, { id });
};
