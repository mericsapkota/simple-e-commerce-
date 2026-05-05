import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrderStore } from "../../store/orderStore";
import { useAuthStore } from "../../store/authStore";
import type { CreateOrderInput, PaymentMethod } from "../../types/Ordertypes";
import { XMarkIcon } from "@heroicons/react/24/outline";

const PAYMENT_METHOD_VALUES = ["CASH_ON_DELIVERY", "CREDIT_CARD", "ESEWA", "KHALTI"] as const;

const createOrderSchema = (maxQuantity: number | null) =>
  z.object({
    quantity: z
      .number()
      .int()
      .min(1, "Minimum quantity is 1")
      .refine(
        (value) => maxQuantity === null || value <= maxQuantity,
        maxQuantity === null ? undefined : { message: `Quantity cannot exceed available stock (${maxQuantity})` },
      ),
    shipping_address: z.string().trim().min(10, "Please enter a complete address"),
    payment_method: z.enum(PAYMENT_METHOD_VALUES),
  });

type FormValues = z.infer<ReturnType<typeof createOrderSchema>>;

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "ESEWA", label: "eSewa" },
  { value: "KHALTI", label: "Khalti" },
];

export default function AddOrderModal() {
  const {
    isAddOrderModalOpen,
    selectedProductId,
    selectedProductPrice,
    selectedProductName,
    selectedProductImageUrl,
    selectedProductQuantity,
    isLoading,
    error,
    closeAddOrderModal,
    submitOrder,
    clearError,
  } = useOrderStore();

  // Adjust this selector to match your authStore shape
  const user = useAuthStore((state) => (state as any).user);

  const orderSchema = createOrderSchema(selectedProductQuantity);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
      shipping_address: "",
      payment_method: "CASH_ON_DELIVERY",
    },
    mode: "all",
  });

  const quantity = watch("quantity");
  const unitPrice = selectedProductPrice ?? 0;
  const total = (Number(quantity) || 0) * unitPrice;

  // Reset form whenever modal opens
  useEffect(() => {
    if (isAddOrderModalOpen) {
      reset({ quantity: 1, shipping_address: "", payment_method: "CASH_ON_DELIVERY" });
      clearError();
    }
  }, [isAddOrderModalOpen]);

  if (!isAddOrderModalOpen) return null;

  const onSubmit = (data: FormValues) => {
    if (!selectedProductId || !user?.id) return;

    const input: CreateOrderInput = {
      user_id: user.id,
      product_id: selectedProductId,
      quantity: Number(data.quantity),
      price: unitPrice,
      shipping_address: data.shipping_address,
      payment_method: data.payment_method,
    };

    submitOrder(input);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAddOrderModal();
      }}
    >
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl mx-4">
        {/* Header */}
        <div className="flex  justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Place Order</h2>
            {selectedProductName && (
              <p className="text-sm text-gray-500 mt-0.5 truncate max-w-xs">{selectedProductName}</p>
            )}
            {selectedProductImageUrl && (
              <img
                src={selectedProductImageUrl}
                alt={selectedProductName || ""}
                className="w-full h-32 object-cover mt-2 rounded"
              />
            )}
            {selectedProductQuantity !== null && (
              <p className="text-sm text-gray-500 mt-1">Available Stock: {selectedProductQuantity}</p>
            )}
          </div>
          <button
            onClick={closeAddOrderModal}
            className="p-1.5 rounded-lg h-max text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              max={selectedProductQuantity || ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>}
          </div>

          {/* Shipping Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
            <textarea
              rows={2}
              placeholder="Enter your full delivery address"
              {...register("shipping_address")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
            {errors.shipping_address && touchedFields.shipping_address && (
              <p className="mt-1 text-xs text-red-500">{errors.shipping_address.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white">
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.value} value={pm.value}>
                  {pm.label}
                </option>
              ))}
            </select>
            {errors.payment_method && <p className="mt-1 text-xs text-red-500">{errors.payment_method.message}</p>}
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Unit Price</span>
              <span>Rs. {unitPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Quantity</span>
              <span>× {Number(quantity) || 0}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 pt-1.5 border-t border-gray-200">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeAddOrderModal}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Placing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
