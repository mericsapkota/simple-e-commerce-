// utils/cloudinaryUpload.ts

interface CloudinaryUploadOptions {
  cloudName: string;
  uploadPreset?: string;
  folder?: string;
  maxSizeMB?: number;
}

interface UploadResponse {
  url: string;
  publicId: string;
  success: boolean;
  error?: string;
}

/**
 * Upload an image to Cloudinary and return the URL
 * @param file - The image file to upload
 * @param options - Cloudinary configuration options
 * @returns Promise with the image URL and public ID
 */
export const uploadImageToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions,
): Promise<UploadResponse> => {
  const { cloudName, uploadPreset = "ml_default", folder = "uploads", maxSizeMB = 5 } = options;

  // Validate file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      url: "",
      publicId: "",
      success: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return {
      url: "",
      publicId: "",
      success: false,
      error: "Invalid file type. Only JPEG, PNG, GIF, WEBP are allowed",
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      success: true,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      url: "",
      publicId: "",
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of image files
 * @param options - Cloudinary configuration options
 * @returns Promise with array of upload responses
 */
export const uploadMultipleImagesToCloudinary = async (
  files: File[],
  options: CloudinaryUploadOptions,
): Promise<UploadResponse[]> => {
  const uploadPromises = files.map((file) => uploadImageToCloudinary(file, options));
  return Promise.all(uploadPromises);
};

/**
 * Get optimized image URL with transformations
 * @param publicId - Cloudinary public ID of the image
 * @param transformations - Optional transformations (width, height, quality, etc.)
 * @returns Optimized Cloudinary URL
 */
export const getOptimizedCloudinaryUrl = (
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "jpg" | "png" | "webp" | "auto";
    crop?: "scale" | "fit" | "fill" | "thumb" | "limit";
  },
  cloudName?: string,
): string => {
  if (!cloudName) {
    // Extract cloud name from public ID URL if needed
    return publicId;
  }

  let transformationString = "";
  if (transformations) {
    const parts = [];
    if (transformations.width) parts.push(`w_${transformations.width}`);
    if (transformations.height) parts.push(`h_${transformations.height}`);
    if (transformations.crop) parts.push(`c_${transformations.crop}`);
    if (transformations.quality) parts.push(`q_${transformations.quality}`);
    if (transformations.format) parts.push(`f_${transformations.format}`);
    transformationString = parts.join(",") + "/";
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}${publicId}`;
};

/**
 * Delete image from Cloudinary (requires backend support)
 * @param publicId - Cloudinary public ID of the image
 * @param cloudName - Your Cloudinary cloud name
 * @returns Promise with deletion status
 */
export const deleteImageFromCloudinary = async (
  publicId: string,
  cloudName: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Note: Cloudinary deletion requires API secret, so this should be done via backend
    // This is just a placeholder - implement actual deletion through your backend API
    const response = await fetch("/api/delete-cloudinary-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId, cloudName }),
    });

    if (!response.ok) {
      throw new Error("Deletion failed");
    }

    return { success: true };
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Deletion failed",
    };
  }
};
