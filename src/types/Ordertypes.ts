export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "CASH_ON_DELIVERY" | "CREDIT_CARD" | "ESEWA" | "KHALTI";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
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
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface CreateOrderInput {
  user_id: string;
  shipping_address: string;
  payment_method: PaymentMethod;
  product_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderResponse {
  createOrder: Order;
}
