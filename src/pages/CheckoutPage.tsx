import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Loader, AlertCircle } from "lucide-react";
import Header from "../components/layout/Header";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import toast from "react-hot-toast";
import {
  clearPendingEsewaOrder,
  createEsewaPaymentRequest,
  extractEsewaEncodedData,
  loadPendingEsewaOrder,
  savePendingEsewaOrder,
  submitEsewaPayment,
  verifyEsewaPayment,
} from "../services/paymentApi";

type PaymentMethod = "CASH_ON_DELIVERY" | "ESEWA";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCartStore();
  const { submitOrder } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [isEsewaReturnProcessing, setIsEsewaReturnProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH_ON_DELIVERY");
  const [shippingAddress, setShippingAddress] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const esewaSecretKey = import.meta.env.VITE_ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
  const esewaProductCode = import.meta.env.VITE_ESEWA_PRODUCT_CODE || "EPAYTEST";

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 5.99 : 0;
  const tax = items.length > 0 ? subtotal * 0.08 : 0;
  const total = subtotal + shipping + tax;

  const getEsewaEncodedData = () => extractEsewaEncodedData(location.search);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-gray-600 mt-2">Add items to your cart to proceed with checkout.</p>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!shippingAddress.trim()) {
      errors.shippingAddress = "Shipping address is required";
    } else if (shippingAddress.trim().length < 10) {
      errors.shippingAddress = "Shipping address must be at least 10 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const encodedData = getEsewaEncodedData();
    if (!encodedData || isEsewaReturnProcessing) return;

    const processEsewaReturn = async () => {
      setIsEsewaReturnProcessing(true);
      setLoading(true);
      try {
        if (!esewaSecretKey) {
          toast.error("Missing eSewa secret key configuration.");
          return;
        }

        const pendingOrder = loadPendingEsewaOrder();
        if (!pendingOrder) {
          toast.error("No pending eSewa order found.");
          return;
        }

        const verification = await verifyEsewaPayment(encodedData, esewaSecretKey);
        if (verification.responsePayload.transaction_uuid !== pendingOrder.transaction_uuid) {
          toast.error("Transaction verification mismatch.");
          return;
        }

        for (const item of pendingOrder.items) {
          await submitOrder({
            product_id: item.id,
            quantity: item.quantity,
            shipping_address: pendingOrder.shipping_address,
            payment_method: "ESEWA",
            payment_status: verification.paymentStatus,
          });
        }

        clearPendingEsewaOrder();
        clearCart();

        toast.success(
          verification.paymentStatus === "PAID"
            ? "Payment verified! Order placed."
            : "Payment recorded. Order updated.",
        );
        navigate("/orders");
      } catch (error: any) {
        console.error("Esewa verification error:", error);
        toast.error(error?.message || "Failed to verify eSewa payment.");
      } finally {
        setLoading(false);
        setIsEsewaReturnProcessing(false);
      }
    };

    processEsewaReturn();
  }, [location.search, esewaSecretKey, isEsewaReturnProcessing]);

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    if (paymentMethod === "ESEWA") {
      if (!esewaSecretKey) {
        toast.error("Missing eSewa secret key configuration.");
        return;
      }

      setLoading(true);
      try {
        const amount = Number(subtotal.toFixed(2));
        const taxAmount = Number(tax.toFixed(2));
        const deliveryCharge = Number(shipping.toFixed(2));

        const { request, transaction_uuid, total_amount } = await createEsewaPaymentRequest({
          amount,
          tax_amount: taxAmount,
          product_delivery_charge: deliveryCharge,
          product_code: esewaProductCode,
          success_url: `${window.location.origin}/checkout`,
          failure_url: `${window.location.origin}/checkout`,
          secret_key: esewaSecretKey,
        });

        savePendingEsewaOrder({
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
          shipping_address: shippingAddress,
          transaction_uuid,
          total_amount,
          tax_amount: taxAmount,
          amount,
          product_delivery_charge: deliveryCharge,
          product_code: esewaProductCode,
        });

        submitEsewaPayment(request);
      } catch (error: any) {
        console.error("Esewa initiation error:", error);
        toast.error(error?.message || "Failed to initiate eSewa payment.");
      } finally {
        setLoading(false);
        // setIsEsewaReturnProcessing(true);
      }
      return;
    }

    setLoading(true);
    try {
      for (const item of items) {
        await submitOrder({
          product_id: item.id,
          quantity: item.quantity,
          shipping_address: shippingAddress,
          payment_method: "CASH_ON_DELIVERY",
          payment_status: "PENDING",
        });
      }

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: number) => `NPR${value.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    if (formErrors.shippingAddress) {
                      setFormErrors({ ...formErrors, shippingAddress: "" });
                    }
                  }}
                  placeholder="Enter your complete shipping address..."
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                    formErrors.shippingAddress ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.shippingAddress && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.shippingAddress}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition"
                  style={{ borderColor: paymentMethod === "CASH_ON_DELIVERY" ? "#16a34a" : undefined }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === "CASH_ON_DELIVERY"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mt-1 w-4 h-4 text-green-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when your order arrives at your doorstep</p>
                  </div>
                </label>

                {/* Esewa */}
                <label
                  className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition"
                  style={{ borderColor: paymentMethod === "ESEWA" ? "#16a34a" : undefined }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="ESEWA"
                    checked={paymentMethod === "ESEWA"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mt-1 w-4 h-4 text-green-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Esewa Digital Wallet</p>
                    <p className="text-sm text-gray-600">Secure online payment using Esewa</p>
                  </div>
                </label>
              </div>

              {paymentMethod === "ESEWA" && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    You will be redirected to Esewa to complete the payment securely.
                  </p>
                </div>
              )}
            </div>

            {/* Order Items Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">{formatPrice(shipping)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax (8%)</span>
                <span className="font-semibold text-gray-900">{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={loading || !shippingAddress.trim()}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? "Processing..." : "Place Order"}
            </button>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Your order is secure and encrypted. By clicking "Place Order", you agree to our terms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
