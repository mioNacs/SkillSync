// src/utils/cloudinary.js
const CLOUDINARY_CLOUD_NAME = 'dealcv1ax';
const CLOUDINARY_UPLOAD_PRESET = 'profile_images_preset'; // Make sure this matches an unsigned preset in your dashboard
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Uploads an image to Cloudinary using an unsigned upload preset
 * and returns the public URL
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID to use as a folder name
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadImageToCloudinary = async (file, userId) => {
  try {
    console.log('Starting Cloudinary upload with preset:', CLOUDINARY_UPLOAD_PRESET);
    
    // Create a FormData object to send to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Keep the form data minimal to avoid issues with unsigned uploads
    // Upload the image
    console.log('Sending request to Cloudinary URL:', CLOUDINARY_URL);
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error response:', errorText);
      throw new Error(`Failed to upload image to Cloudinary: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Cloudinary response:', data);
    
    // Return the secure URL of the uploaded image
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export default { uploadImageToCloudinary }; 