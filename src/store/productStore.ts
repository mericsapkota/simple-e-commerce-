import { create } from "zustand";
import type { Product } from "../types/product";
import { productAPI } from "../services/productApi";

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  showCreateModal: boolean;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: number) => Promise<Product | null>;
  createProduct: (product: Omit<Product, "id">) => Promise<Product | null>;
  updateProduct: (id: number, product: Partial<Omit<Product, "id">>) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  clearError: () => void;

  setShowCreateModal: (show: boolean) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [
    // {
    //   id: 0,
    //   name: "Sample Product",
    //   price: 19.99,
    //   description: "This is a sample product.",
    //   imageUrl: "https://ir.ozone.ru/s3/multimedia-n/6749579255.jpg",
    // },
    // {
    //   id: 1,
    //   name: "Sample Product 2",
    //   price: 29.99,
    //   description: "This is another sample product.",
    //   imageUrl: "https://avatars.mds.yandex.net/get-mpic/4343007/img_id5597015317067740500.jpeg/9hq",
    // },
    // {
    //   id: 2,
    //   name: "Sample Product 3",
    //   price: 39.99,
    //   description: "This is yet another sample product.",
    //   imageUrl: "https://ir.ozone.ru/s3/multimedia-1-7/7354801591.jpg",
    // },
    // {
    //   id: 3,
    //   name: "Sample Product 4",
    //   price: 49.99,
    //   description: "This is yet another sample product.",
    //   imageUrl: "https://n.cdn.cdek.shopping/images/shopping/YfkBTn7fWmnvAXtH.jpg?v=1",
    // },
  ],
  loading: false,
  error: null,
  showCreateModal: false,

  setShowCreateModal: (show) => set({ showCreateModal: show }),

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productAPI.getProducts();
      const productsWithImageUrl: Product[] = products.map((p) => {
        const { image, ...rest } = p as Product as any;
        return { ...(rest as Product), imageUrl: image } as Product;
      });
      set({ products: productsWithImageUrl, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.errors?.[0]?.message || "Failed to fetch products",
        loading: false,
      });
    }
  },

  fetchProduct: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const product = await productAPI.getProduct(id);
      const { image, ...rest } = product as any;
      const productWithImageUrl = { ...(rest as Product), imageUrl: image } as Product;
      set({ loading: false });
      return productWithImageUrl;
    } catch (error: any) {
      set({
        error: error.response?.errors?.[0]?.message || "Failed to fetch product",
        loading: false,
      });
      return null;
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await productAPI.createProduct(productData);

      const { image, ...rest } = newProduct as any;
      const newProductWithImageUrl = { ...(rest as Product), imageUrl: image } as Product;
      set((state) => ({
        products: [newProductWithImageUrl, ...state.products],
        loading: false,
      }));
      return newProductWithImageUrl;
    } catch (error: any) {
      set({
        error: error.response?.errors?.[0]?.message || "Failed to create product",
        loading: false,
      });
      return null;
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await productAPI.updateProduct({ id, ...productData });
      const { image, ...rest } = updatedProduct as any;
      const updatedProductWithImageUrl = { ...(rest as Product), imageUrl: image } as Product;

      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProductWithImageUrl : p)),
        loading: false,
      }));
      return updatedProductWithImageUrl;
    } catch (error: any) {
      set({
        error: error.response?.errors?.[0]?.message || "Failed to update product",
        loading: false,
      });
      return null;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productAPI.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
      return true;
    } catch (error: any) {
      set({
        error: error.response?.errors?.[0]?.message || "Failed to delete product",
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
