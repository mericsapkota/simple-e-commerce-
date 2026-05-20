import React from "react";
import { ProductList } from "../components/products/ProductList";
import { ProductForm } from "../components/products/ProductForm";
import { useProductStore } from "../store/productStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import "./ProductPages.css";

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct } = useProductStore();
  const { setShowCreateModal } = useProductStore();
  const { showCreateModal } = useProductStore();
  const { isAuthenticated, isInitialized, initializeAuth } = useAuthStore();
  const user = useAuthStore((state) => state.user);
  if (!isAuthenticated) {
    navigate("/login");
  }
  if (!isInitialized) {
    console.log(":hi");
    initializeAuth();
  }

  const handleCreateProduct = async (data: {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    quantity: number;
  }) => {
    const result = await createProduct(data);
    if (result) {
      setShowCreateModal(false);
    }
  };

  return (
    <div className="pp-root">
      <Header />
      <ProductList />

      {/* Create Product Modal */}
      {showCreateModal && user?.role === "ADMIN" && (
        <div className="pp-modal-overlay">
          <div className="pp-modal">
            <button onClick={() => setShowCreateModal(false)} className="pp-modal-close">
              <XMarkIcon className="h-5 w-5" />
            </button>
            <ProductForm onSubmit={handleCreateProduct} onCancel={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
