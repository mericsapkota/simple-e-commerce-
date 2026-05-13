import React, { useState } from "react";
import type { Product } from "../../types/product";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { uploadImageToCloudinary } from "../../utils/fileUpload";
import toast from "react-hot-toast";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    quantity: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    quantity: initialData?.quantity || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [newImage, setNewImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    const loadingToast = toast.loading("Uploading...");
    e.preventDefault();
    setLoading(true);

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

    try {
      if (newImage) {
        if (!selectedFile) {
          setError("Product image is required");
          setLoading(false);
          return;
        }
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
        formData.imageUrl = uploadResult.url;
      }

      await onSubmit(formData);
      toast.success("Product saved successfully", { id: loadingToast });
    } catch (err: any) {
      setError(err.message || "Failed to save product");
      toast.error("Failed to save product", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pp-form-card">
      <h3 className="pp-form-title">{initialData?.id ? "Edit Product" : "Create New Product"}</h3>

      <form onSubmit={handleSubmit} className="pp-form">
        <div className="pp-form-group">
          <label className="pp-label">Product Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="pp-input"
            placeholder="Enter product name"
          />
        </div>

        <div className="pp-form-group">
          <label className="pp-label">Image</label>
          <label htmlFor="file-upload" className="pp-file-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="pp-file-preview" />
            ) : (
              <div className="pp-file-placeholder">
                <PhotoIcon className="h-8 w-8" />
                <span>Click to upload</span>
              </div>
            )}
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setNewImage(true);
              setImagePreview(file ? URL.createObjectURL(file) : "");
              setSelectedFile(file || null);
            }}
          />
        </div>

        <div className="pp-form-row">
          <div className="pp-form-group">
            <label className="pp-label">Price *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value),
                })
              }
              className="pp-input"
              placeholder="0.00"
            />
          </div>
          <div className="pp-form-group">
            <label className="pp-label">Quantity *</label>
            <input
              type="number"
              required
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value),
                })
              }
              className="pp-input"
              placeholder="0"
            />
          </div>
        </div>

        <div className="pp-form-group">
          <label className="pp-label">Description *</label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="pp-input pp-textarea"
            placeholder="Enter product description"
          />
        </div>

        {error && <div className="pp-form-error">{error}</div>}

        <div className="pp-form-actions">
          <button type="submit" disabled={loading} className="pp-submit-btn">
            {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
          </button>
          <button type="button" onClick={onCancel} className="pp-cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
