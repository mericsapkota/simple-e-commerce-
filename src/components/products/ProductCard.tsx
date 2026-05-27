import React, { useState } from "react";
import type { Product } from "../../types/product";
import { useProductStore } from "../../store/productStore";
import { PencilIcon, TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { ProductForm } from "./ProductForm";
import { useAuthStore } from "../../store/authStore";
import { useOrderStore } from "../../store/orderStore";
import { useCartStore } from "../../store/cartStore";
import toast from "react-hot-toast";
import { Circle, CircleCheck } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteProduct, updateProduct } = useProductStore();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const role = user?.role;
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(product.id);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      totalQuantity: product.quantity,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart!`);
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
    <div className="pp-card h-max">
      <div className="pp-card-img-wrap">
        <img src={product.imageUrl} alt={product.name} className="pp-card-img" />
        {product.quantity === 0 && <div className="pp-card-badge pp-card-badge--oos">Out of Stock</div>}
        {product.quantity > 0 && product.quantity <= 5 && (
          <div className="pp-card-badge pp-card-badge--low">Only {product.quantity} left</div>
        )}
      </div>
      <div className="pp-card-body">
        <h3 className="pp-card-title">{product.name}</h3>
        <p className="pp-card-desc">{product.description}</p>
        <div className="pp-card-footer">
          <div className="pp-card-price-wrap">
            <span className="pp-card-price">${product.price.toFixed(2)}</span>
            <span className="pp-card-stock">{product.quantity > 0 ? `${product.quantity} in stock` : "Sold out"}</span>
          </div>
        </div>
        <div className="pp-card-actions  ">
          {role === "ADMIN" ? (
            <>
              <div className="flex justify-between mt-5">
                <button onClick={() => setIsEditing(true)} className="pp-icon-btn pp-icon-btn--edit" title="Edit">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button onClick={handleDelete} className="pp-icon-btn pp-icon-btn--delete" title="Delete">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="flex mt-4  gap-5 x justify-between">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  className="pp-order-btn"
                  title="Add to Cart"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() =>
                    openAddOrderModal(product.id, product.price, product.name, product.imageUrl, product.quantity)
                  }
                  disabled={product.quantity === 0}
                  className="pp-order-btn"
                  title="Add to Order"
                >
                  <CircleCheck className="w-4 h-4" />
                  Direct Place Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
