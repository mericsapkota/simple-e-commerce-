import React, { useState } from "react";
import { ProductList } from "../components/products/ProductList";
import { ProductForm } from "../components/products/ProductForm";
import { useProductStore } from "../store/productStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const ProductsPage: React.FC = () => {
  // const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { createProduct } = useProductStore();
  const { setShowCreateModal } = useProductStore();
  const { showCreateModal } = useProductStore();
  const { isAuthenticated, isInitialized, initializeAuth } = useAuthStore();

  if (!isAuthenticated) {
    navigate("/login");
  }
  if (!isInitialized) {
    console.log(":hi");
    initializeAuth();
  }

  const handleCreateProduct = async (data: { name: string; price: number; description: string; imageUrl: string }) => {
    const result = await createProduct(data);
    if (result) {
      setShowCreateModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ProductList />

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 w-full bg-black/80  h-svh flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6  min-w-lg mx-4 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <ProductForm onSubmit={handleCreateProduct} onCancel={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}

      {/* Button to open modal - you can also add this in ProductList */}
      {!showCreateModal && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};
