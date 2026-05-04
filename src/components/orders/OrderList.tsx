import { useEffect } from "react";
import { useOrderStore } from "../../store/orderStore";
import { useAuthStore } from "../../store/authStore";
import type { Order } from "../../types/Ordertypes";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-gray-400">#{order.id.slice(0, 8)}</span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}
        >
          {order.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">Date</span>
          <span>{new Date(order.order_date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Payment</span>
          <span>{order.payment_method.replace(/_/g, " ")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Address</span>
          <span className="text-right max-w-[60%] truncate">{order.shipping_address}</span>
        </div>
      </div>

      {order.order_items && order.order_items.length > 0 && (
        <div className="border-t border-gray-100 pt-2 space-y-1">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-500">
                {item.quantity} × Rs. {item.price.toLocaleString()}
              </span>
              <span className="font-medium">Rs. {item.subtotal.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-100">
        <span>Total</span>
        <span>Rs. {order.total_amount.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function OrderList() {
  const { orders, isLoading, error, fetchMyOrders } = useOrderStore();
  const user = useAuthStore((state) => (state as any).user);

  useEffect(() => {
    if (user?.id) fetchMyOrders(user.id);
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 text-sm">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-12 text-gray-400 text-sm">No orders yet.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
