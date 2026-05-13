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
    <div className="pp-card">
      <div className="pp-card-img-wrap">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="pp-card-img"
        />
        {product.quantity === 0 && (
          <div className="pp-card-badge pp-card-badge--oos">Out of Stock</div>
        )}
        {product.quantity > 0 && product.quantity <= 5 && (
          <div className="pp-card-badge pp-card-badge--low">
            Only {product.quantity} left
          </div>
        )}
      </div>
      <div className="pp-card-body">
        <h3 className="pp-card-title">{product.name}</h3>
        <p className="pp-card-desc">{product.description}</p>
        <div className="pp-card-footer">
          <div className="pp-card-price-wrap">
            <span className="pp-card-price">
              ${product.price.toFixed(2)}
            </span>
            <span className="pp-card-stock">
              {product.quantity > 0
                ? `${product.quantity} in stock`
                : "Sold out"}
            </span>
          </div>
          <div className="pp-card-actions">
            {role === "ADMIN" ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="pp-icon-btn pp-icon-btn--edit"
                  title="Edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="pp-icon-btn pp-icon-btn--delete"
                  title="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  openAddOrderModal(
                    product.id,
                    product.price,
                    product.name,
                    product.imageUrl,
                    product.quantity
                  )
                }
                disabled={product.quantity === 0}
                className="pp-order-btn"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
