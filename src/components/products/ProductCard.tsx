import React, { useState } from "react";
import type { Product } from "../../types/product";
import { useProductStore } from "../../store/productStore";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ProductForm } from "./ProductForm";
import { useAuthStore } from "../../store/authStore";
import { useOrderStore } from "../../store/orderStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteProduct, updateProduct } = useProductStore();
  const { user } = useAuthStore();

  const role = user?.role;
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(product.id);
    }
  };
  const openAddOrderModal = useOrderStore((state) => state.openAddOrderModal);

  if (isEditing) {
    return (
      <ProductForm
        initialData={product}
        onSubmit={async (data) => {
          await updateProduct(product.id, data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg max-h-max transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <div className="space-x-2">
            {role === "ADMIN" ? (
              <div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>

                <button onClick={handleDelete} className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() =>
                    openAddOrderModal(product.id, product.price, product.name, product.imageUrl, product.quantity)
                  }
                  disabled={product.quantity === 0}
                  className="mt-2 w-full p-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Order
                </button>
                {/* <button className="bg-blue-600 rounded-xl p-2 text-white">Add to cart</button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
