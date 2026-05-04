export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type PaymentMethod = "ESEWA" | "KHALTI" | "CASH_ON_DELIVERY";

// types/Ordertypes.ts

// Minimal product info for orders
export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  product_id: string;
  product: OrderProduct;
}

export interface Order {
  id: string;
  order_date: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: string;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
}

// This is all you need to create an order - just product IDs and quantities!
export interface CreateOrderInput {
  shipping_address: string;
  payment_method: PaymentMethod;
  total_amount: number;
  items: {
    product_id: string; // Just the product ID
    quantity: number; // How many
    price: number; // Price at time of purchase
  }[];
}
