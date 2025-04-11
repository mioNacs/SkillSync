import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToCloudinary } from '../../utils/cloudinary';
import ImageCropper from './ImageCropper';

const ProfileImage = ({ currentImage, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const fileInputRef = useRef(null);
  const { currentUser, updateUserProfile } = useAuth();

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    console.log('Selected file:', file.name, file.type, file.size);

    // Create a preview and show cropper
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageToCrop(event.target.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob) => {
    try {
      console.log('Crop completed, blob size:', croppedBlob.size);
      
      // Create a file from the blob for upload
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });

      // Create URL for preview
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setPreviewImage(croppedUrl);
      setCroppedImage(croppedFile);
      setShowCropper(false);

      // Automatically start upload after cropping
      await uploadCroppedImage(croppedFile);
    } catch (error) {
      console.error('Error in crop complete handler:', error);
      alert('There was an error processing the image. Please try again.');
      setShowCropper(false);
    }
  };

  const uploadCroppedImage = async (imageFile) => {
    try {
      setUploading(true);
      setUploadProgress(10);
      
      console.log('Starting upload to Cloudinary...');
      
      // Upload to Cloudinary and get the public URL
      setUploadProgress(30);
      const cloudinaryUrl = await uploadImageToCloudinary(imageFile, currentUser.uid);
      console.log('Cloudinary upload successful:', cloudinaryUrl);
      
      setUploadProgress(75);
      
      // Update user profile in Firebase with the Cloudinary URL
      await updateUserProfile(currentUser.uid, { profileImage: cloudinaryUrl });
      console.log('Firebase profile updated with new image URL');
      
      setUploadProgress(100);
      
      // Callback to parent component
      onImageUpdate(cloudinaryUrl);
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      setUploadProgress(0);
      alert('Failed to upload image. Please try again: ' + error.message);
    }
  };

  // Get user initials for avatar placeholder
  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <div className="relative">
        <div 
          onClick={handleImageClick}
          className="h-32 w-32 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 text-4xl font-bold overflow-hidden cursor-pointer relative group"
        >
          {previewImage || currentImage ? (
            <img 
              src={previewImage || currentImage} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              {getInitials()}
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          {/* Loading indicator with progress */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-2"></div>
              <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300 ease-in-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-white text-xs mt-1">{uploadProgress}%</span>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500 block">Click to change</span>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <ImageCropper 
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setImageToCrop(null);
          }}
        />
      )}
    </>
  );
};

export default ProfileImage; 