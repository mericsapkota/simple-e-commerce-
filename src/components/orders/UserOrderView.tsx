import React, { useEffect, useState } from "react";
import type { Order } from "../../types/Ordertypes";
import { Loader2, Package, MapPin, CreditCard, Calendar, Eye, PencilIcon } from "lucide-react";
import { statusConfig } from "../../constants/order";
import { updateMyOrder, updateOrderStatus } from "../../services/orderApi";
import toast from "react-hot-toast";
import { useOrderStore } from "../../store/orderStore";
interface Props {
  orders: Order[];
  loading: boolean;
}

const UserOrderView = ({ orders, loading }: Props) => {
  const [editingShippingId, setOpenEditShippingId] = useState<string | null>(null);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [shippingAddress, setShippingAddress] = useState("");

  const handleOpenEditShippingAddress = (id: string) => {
    if (editingShippingId === id) {
      setOpenEditShippingId(null);
    } else {
      setOpenEditShippingId(id);
    }
  };

  const cancelOrderr = useOrderStore((state) => state.cancelOrder);
  const cancelOrder = (id: string) => {
    cancelOrderr(id);
  };

  const updateOrder = async (id: string, shipping_address: string) => {
    console.log("updating");
    try {
      await updateMyOrder({ id, shipping_address });

      setOpenEditShippingId(null);
      window.location.reload(); // Refresh the page to show updated data, can be optimized by updating state instead of full reload
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 relative z-10" />
        </div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading your orders...</p>
        <p className="text-sm text-gray-400 mt-1">Please wait a moment</p>
      </div>
    );
  }

  if (orders?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in slide-in-from-bottom-5 duration-500">
        <div className="relative">
          <div className="absolute inset-0  bg-blue-500  rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Package className="h-24 w-24 text-blue-600 relative z-10 animate-bounce" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-700 mt-6">No orders yet</h3>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          Looks like you haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <button
          onClick={() => (window.location.href = "/products")}
          className="mt-6 px-6 py-2  bg-blue-500   text-white rounded-lg  transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 animate-in slide-in-from-top-5 duration-500">
        <h2 className="text-3xl font-bold  text-blue-600  ">My Orders</h2>
        <p className="text-gray-600 mt-2">
          You have {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="space-y-6">
        {orders.map((order, index) => {
          const status = statusConfig[order.status] || statusConfig.PENDING;
          const StatusIcon = status.icon;

          return (
            <div
              key={order.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-scroll border border-gray-100 animate-in slide-in-from-bottom-5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order #{order.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{formatDate(order.order_date)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color} transition-all duration-300`}
                    >
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {status.label}
                    </div>
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-2 py-1 hover:bg-red-800 text-sm bg-red-400 text-white rounded-full transition-all duration-300 cursor-pointer hover:scale-101"
                        title="Cancel Order"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {/* Total Amount */}
                  <div className="flex items-start gap-3 group/item">
                    <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg group-hover/item:bg-green-200 transition-all duration-300">
                      <span className="text-xl">$</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-800">${order.total_amount?.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-start gap-3 group/item">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover/item:bg-blue-200 transition-all duration-300">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</p>
                      <p className="text-gray-800 font-medium capitalize">{order.payment_method?.replace("_", " ")}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="flex items-start gap-2   group/item md:col-span-2 lg:col-span-1">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover/item:bg-orange-200 transition-all duration-300">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between ">
                        <p className="text-xs text-gray-500 uppercase tracking-wide ">Shipping Address</p>
                        {order.status === "PENDING" && (
                          <div
                            className="flex items-center gap-1"
                            onClick={() => handleOpenEditShippingAddress(order.id)}
                          >
                            <PencilIcon
                              className={`h-4 w-4  cursor-pointer ${
                                editingShippingId === order.id ? "text-red-600" : "text-blue-600"
                              }`}
                            />
                            <p
                              className={`text-xs cursor-pointer ${
                                editingShippingId === order.id ? "text-red-600" : "text-blue-600"
                              }`}
                            >
                              Edit
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center ">
                        {editingShippingId === order.id ? (
                          <div className="flex gap-2 items-center mt-2">
                            <input
                              type="text"
                              defaultValue={order.shipping_address}
                              onChange={(e) => setShippingAddress(e.target.value)}
                              className="border w-[250px] border-gray-300 ps-2 rounded-sm "
                            />
                            <button
                              onClick={() => updateOrder(order.id, shippingAddress)}
                              className="bg-green-600 rounded-sm p-1 text-white cursor-pointer hover:bg-green-700 transition-all duration-300"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <p className="text-gray-800 text-sm break-all max-w-[350px] ">{order.shipping_address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order Items ({order.order_items.length})
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {order.order_items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <span className="text-sm text-gray-700">
                            {item.product?.name} x{item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.order_items.length > 3 && (
                        <div className="bg-gray-100 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-600">+{order.order_items.length - 3} more items</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 flex items-center gap-1">
                  View Order Details
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default UserOrderView;
