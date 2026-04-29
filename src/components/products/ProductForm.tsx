import React, { useState } from "react";
import type { Product } from "../../types/product";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { uploadImageToCloudinary } from "../../utils/fileUpload";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: { name: string; price: number; description: string; imageUrl: string }) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  console.log(initialData);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      setLoading(false);
      return;
    }
    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }
    if (!selectedFile) {
      setError("Product image is required");
      setLoading(false);
      return;
    }
    try {
      // Upload image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(selectedFile, {
        cloudName: "dngpjau3d",
        uploadPreset: "intern",
        folder: "ecommerce",
        maxSizeMB: 5,
      });

      if (!uploadResult.success) {
        setError(uploadResult.error || "Image upload failed");
        setLoading(false);
        return;
      }

      // Create product with the image URL
      const productData = {
        ...formData,
        imageUrl: uploadResult.url,
      };

      await onSubmit(productData);
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">{initialData?.id ? "Edit Product" : "Create New Product"}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>

          <label
            htmlFor="file-upload"
            className="flex items-center justify-center h-50 w-50 rounded-md border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-md" />
            ) : (
              <PhotoIcon className="h-6 w-6 text-gray-400" />
            )}
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              setImagePreview(file ? URL.createObjectURL(file) : "");
              setSelectedFile(file || null);
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product description"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
