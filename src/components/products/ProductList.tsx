import React, { useEffect } from "react";
import { useProductStore } from "../../store/productStore";
import { ProductCard } from "./ProductCard";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../../store/authStore";

export const ProductList: React.FC = () => {
  const { products, loading, error, fetchProducts } = useProductStore();
  const { setShowCreateModal } = useProductStore();
  const { isInitialized, initializeAuth } = useAuthStore();
  useEffect(() => {
    // const init = async () => {
    //   if (!isInitialized) {
    //     await initializeAuth();
    //     fetchProducts();
    //   }
    // };
    // init();
    console.log(isInitialized, "isInitialized");
    fetchProducts();
  }, [isInitialized]);

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button onClick={() => fetchProducts()} className="mt-2 text-sm text-red-700 hover:text-red-800">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => {
            setShowCreateModal(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found. Create your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
