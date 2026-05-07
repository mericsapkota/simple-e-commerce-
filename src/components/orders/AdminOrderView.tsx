import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  MoreVertical,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import { OrderStatusValues, statusConfig } from "../../constants/order";
import { formatDate } from "../../utils/helper";

const AdminOrderView = ({
  handleFetchOrders,
  loading,
  orders,
  showStatusMenu,
  setShowStatusMenu,
  handleStatusChange,
}: any) => {
  return (
    <div className="min-h-screen   p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex  justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black bg-clip-text ">My Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </div>

        {/* Orders Grid */}
        {loading && orders.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status]?.icon || AlertCircle;
                const statusInfo = statusConfig[order.status] || statusConfig[OrderStatusValues.PENDING];

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Order Header */}
                    <div className="bg-blue-400  p-4 text-white">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="w-5 h-5" />
                          <span className="font-semibold">Order #{order.id.slice(-8)}</span>
                        </div>
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setShowStatusMenu(showStatusMenu === order.id ? null : order.id)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{statusInfo.label}</span>
                            <MoreVertical className="w-3 h-3" />
                          </motion.button>

                          {/* Status Change Menu */}
                          {showStatusMenu === order.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                              {Object.values(OrderStatusValues).map((status) => {
                                const Icon = statusConfig[status].icon;
                                return (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(order.id, status as any)}
                                    className={`w-full px-4 py-2 text-left  flex items-center gap-2 cursor-pointer transition-colors`}
                                  >
                                    <Icon className="w-4 h-4" />
                                    <span>{statusConfig[status].label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6">
                      {/* Order Items Image */}
                      {order.order_items && order.order_items[0] && (
                        <div className="flex justify-center mb-4">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            className="h-32 w-32 object-cover rounded-lg shadow-md"
                            src={order.order_items[0].product.image}
                            alt="Product"
                          />
                        </div>
                      )}

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Order Status</p>
                              <p className="font-medium text-gray-800">{order.status}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Order Date</p>
                              <p className="font-medium text-gray-800">{formatDate(order.order_date)}</p>
                            </div>
                          </div>
                          {order.updated_at && (
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-500">Status Updated At</p>
                                <p className="font-medium text-gray-800">{formatDate(order.updated_at)}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-2">
                            <CreditCard className="w-4 h-4 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Payment Method</p>
                              <p className="font-medium text-gray-800 capitalize">{order.payment_method}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Shipping Address</p>
                              <p className="font-medium text-gray-800 text-sm">{order.shipping_address}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Created At</p>
                              <p className="font-medium text-gray-800 text-sm">{formatDate(order.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Amount:</span>
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                          >
                            ${order.total_amount}
                          </motion.span>
                        </div>
                      </div>

                      {/* View Details Button */}
                    </div>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-500">Start shopping to see your orders here</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderView;
