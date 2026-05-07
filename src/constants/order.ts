import { CheckCircle, Clock, RefreshCw, Truck, XCircle } from "lucide-react";

export const OrderStatusValues = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;


export const statusConfig: Record<string, any> = {

  [OrderStatusValues.PENDING]: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Pending"
  },
  [OrderStatusValues.PROCESSING]: {
    color: "bg-blue-100 text-blue-800",
    icon: RefreshCw,
    label: "Processing"
  },
  [OrderStatusValues.SHIPPED]: {
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
    label: "Shipped"
  },
  [OrderStatusValues.DELIVERED]: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    label: "Delivered"
  },
  [OrderStatusValues.CANCELLED]: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    label: "Cancelled"
  }
};