import { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";

import type { OrderStatus } from "../types/Ordertypes";
import Header from "../components/layout/Header";
import AdminOrderView from "../components/orders/AdminOrderView";
import { useAuthStore } from "../store/authStore";
import UserOrderView from "../components/orders/UserOrderView";

const OrderPage = () => {
  const orders = useOrderStore((state) => state.orders);
  const fetchAllOrders = useOrderStore((state) => state.fetchAllOrders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const loading = useOrderStore((state) => state.isLoading);
  const role = useAuthStore((state) => state.role);
  const fetchMyOrders = useOrderStore((state) => state.fetchMyOrders);
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);

  useEffect(() => {
    if (role === "ADMIN") {
      handleFetchOrdersForAdmin();
    } else {
      console.log("I am in user");
      handleFetchOrdersForUser();
    }
  }, []);

  const handleFetchOrdersForAdmin = async () => {
    await fetchAllOrders();
  };

  const handleFetchOrdersForUser = async () => {
    await fetchMyOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setShowStatusMenu(null);
  };

  return (
    <div>
      <Header />
      {role === "ADMIN" ? (
        <AdminOrderView
          handleFetchOrders={handleFetchOrdersForAdmin}
          loading={loading}
          orders={orders}
          showStatusMenu={showStatusMenu}
          setShowStatusMenu={setShowStatusMenu}
          handleStatusChange={handleStatusChange}
        />
      ) : (
        <UserOrderView loading={loading} orders={orders} />
      )}
    </div>
  );
};

export default OrderPage;
