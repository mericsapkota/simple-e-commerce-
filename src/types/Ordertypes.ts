export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "CASH_ON_DELIVERY" | "CREDIT_CARD" | "ESEWA" | "KHALTI";
export type PaymentStatus = "FAILED" | "PAID" | "PENDING";

export interface OrderItem {
  id: string;
  order_id: string;
  product: {
    id: string;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_date: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface CreateOrderInput {
  shipping_address: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  product_id: string;
  quantity: number;
}

export interface UpdateOrderInput {
  id: string;
  shipping_address?: string;
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  status?: OrderStatus;
  quantity?: number;
}

export interface CreateOrderResponse {
  createOrder: Order;
}

export interface UpdateOrderResponse {
  id: string;
  status: OrderStatus;
  updated_at: string;
  shipping_address?: string;
}
