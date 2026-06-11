import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Header from "../components/layout/Header";
import { useCartStore } from "../store/cartStore";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useCartStore();

  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = items.length > 0 ? 5.99 : 0;
    const tax = items.length > 0 ? subtotal * 0.08 : 0;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [items]);

  const formatPrice = (value: number) => `NPR${value.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-600">Review your items before checkout.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 bg-white rounded-lg shadow p-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Browse products and add your favorites to get started.</p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center mt-6 px-5 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4">
                  <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 text-gray-500 hover:text-gray-800 disabled:text-gray-300"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-semibold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.totalQuantity}
                          className="p-2 text-gray-500 hover:text-gray-800"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{formatPrice(item.price)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">{formatPrice(summary.shipping)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-900">{formatPrice(summary.tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">{formatPrice(summary.total)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
              <p className="mt-3 text-xs text-gray-500 text-center">Secure checkout powered by Lumina</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
