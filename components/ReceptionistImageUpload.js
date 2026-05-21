"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";

// Cloudinary environment variables
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_KEY;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// File validation rules
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ReceptionistImageUpload({
  name = "profileImage",
  disabled = false,
  initialImageUrl = "",
  error = "",
}) {
  // File input reference
  const inputRef = useRef(null);

  // Component states
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [uploadError, setUploadError] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Validate selected image
  const validateFile = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Please upload JPG, PNG or WEBP image.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Image size must be under 2MB.";
    }

    return "";
  };

  // Handle image upload
  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file
    const validationError = validateFile(file);

    if (validationError) {
      setUploadError(validationError);
      event.target.value = "";
      return;
    }

    // Check Cloudinary configuration
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setUploadError("Cloudinary is not configured properly.");
      event.target.value = "";
      return;
    }

    // Prepare form data
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append(
      "folder",
      "hospital-management-system/receptionists"
    );

    // Start uploading
    setIsUploading(true);
    setUploadError("");
    setStatus("Uploading image...");

    try {
      // Upload image to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      // Handle upload failure
      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message || "Upload failed.");
      }

      // Save uploaded image URL
      setImageUrl(result.secure_url);
      setStatus("Profile uploaded successfully.");
    } catch (error) {
      setUploadError(error.message);
      setStatus("");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  // Remove uploaded image
  const handleRemove = () => {
    setImageUrl("");
    setUploadError("");
    setStatus("");
  };

  // Helper message
  const helperMessage = uploadError || error || status;

  return (
    <div className="md:col-span-1 flex flex-col items-center justify-center space-y-4">
      {/* Hidden input field for form submission */}
      <input type="hidden" name={name} value={imageUrl} />

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_FILE_TYPES.join(",")}
        className="sr-only"
        disabled={disabled || isUploading}
        onChange={handleUpload}
      />

      {/* Upload Area */}
      <button
        type="button"
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
        className="relative w-40 h-40 rounded-full bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden cursor-pointer group hover:border-[#137fec] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {/* Show uploaded image */}
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt="Receptionist profile"
              fill
              sizes="160px"
              className="object-cover"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-xs font-bold uppercase tracking-wider">
                Change Photo
              </p>
            </div>
          </>
        ) : isUploading ? (
          <>
            {/* Loading state */}
            <Loader2 className="w-10 h-10 text-[#137fec] animate-spin" />

            <p className="text-xs text-[#137fec] font-bold uppercase tracking-wider mt-2">
              Uploading
            </p>
          </>
        ) : (
          <>
            {/* Default upload UI */}
            <Camera className="w-12 h-12 text-gray-400 group-hover:text-[#137fec] group-hover:scale-110 transition-transform" />

            <p className="text-xs text-gray-400 group-hover:text-[#137fec] font-bold uppercase tracking-wider mt-2">
              Upload Profile
            </p>
          </>
        )}
      </button>

      {/* Remove button */}
      {imageUrl ? (
        <button
          type="button"
          disabled={disabled || isUploading}
          onClick={handleRemove}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-70"
        >
          <Trash2 className="w-4 h-4" />
          Remove Photo
        </button>
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">
          Supported formats: JPG, PNG, WEBP. Max size 2MB.
        </p>
      )}

      {/* Status / Error Message */}
      {helperMessage ? (
        <p
          className={`text-xs text-center px-4 ${
            uploadError || error
              ? "text-red-500"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {helperMessage}
        </p>
      ) : null}
    </div>
  );
}