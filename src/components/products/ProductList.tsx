import React, { useEffect, useState, useMemo, use } from "react";
import { useProductStore } from "../../store/productStore";
import { ProductCard } from "./ProductCard";
import { MagnifyingGlassCircleIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "../../store/authStore";
import { useOrderStore } from "../../store/orderStore";
import { getRole } from "../../services/authApi";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export const ProductList: React.FC = () => {
  const { products, loading, error, fetchProducts } = useProductStore();
  const { setShowCreateModal } = useProductStore();
  const { isInitialized } = useAuthStore();
  const orders = useOrderStore((state) => state.orders);
  const role = useAuthStore((state) => state.role);
  const getRole = useAuthStore((state) => state.getRole);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    console.log(isInitialized, "isInitialized");
    fetchProducts();
    getRole();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [orders]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) => product.name?.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query),
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name?.localeCompare(b.name ?? "") ?? 0);
        break;
      case "name-desc":
        result.sort((a, b) => b.name?.localeCompare(a.name ?? "") ?? 0);
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, sortBy]);

  if (loading && products.length === 0) {
    return (
      <div className="pp-loading">
        <div className="pp-spinner" />
        <p className="pp-loading-text">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pp-error">
        <p className="pp-error-text">{error}</p>
        <button onClick={() => fetchProducts()} className="pp-error-retry">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="pp-container">
      <div className="pp-header">
        <div>
          <h1 className="pp-title">Products</h1>
          <p className="pp-subtitle">
            {filteredAndSortedProducts.length} product
            {filteredAndSortedProducts.length !== 1 ? "s" : ""} available
          </p>
        </div>
        {role === "ADMIN" && (
          <button onClick={() => setShowCreateModal(true)} className="pp-add-btn">
            <PlusIcon className="h-5 w-5" />
            Add Product
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="pp-empty">
          <div className="pp-empty-icon">📦</div>
          <p className="pp-empty-title">No products yet</p>
          <p className="pp-empty-text">Create your first product to get started!</p>
        </div>
      ) : (
        <div>
          <div className="pp-toolbar">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="pp-select">
              <option value="default">Sort By</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>

            <div className="pp-search-wrap relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute z-10 top-2.5 left-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pp-search"
              ></input>
            </div>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="pp-empty">
              <p className="pp-empty-title">No results found</p>
              <p className="pp-empty-text">No products match your search.</p>
              <button onClick={() => setSearchQuery("")} className="pp-clear-btn">
                Clear search
              </button>
            </div>
          ) : (
            <div className="pp-grid">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
