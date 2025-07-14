import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export default function ImageUpload({ onImageUploaded, currentImage = null, className = "" }) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    if (!token) {
      toast.error('You must be logged in to upload images');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/api/upload/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setUploadedImage(result.imageUrl);
      onImageUploaded?.(result.imageUrl);
      toast.success('Image uploaded successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    onImageUploaded?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Template Image
      </label>
      
      {uploadedImage ? (
        <div className="relative">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <FiImage className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                  {uploading ? 'Uploading...' : 'Click to upload an image'}
                </span>
              </label>
              <input
                ref={fileInputRef}
                id="image-upload"
                name="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          <span>Uploading image...</span>
        </div>
      )}
    </div>
  );
}
