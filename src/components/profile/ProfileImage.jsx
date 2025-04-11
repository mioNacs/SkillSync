import { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

const ProfileImage = ({ currentImage, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const { currentUser, updateUserProfile } = useAuth();

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
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

    try {
      setUploading(true);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-images/${currentUser.uid}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile with new image URL
      await updateUserProfile(currentUser.uid, { profileImage: downloadURL });
      
      // Callback to parent component
      onImageUpdate(downloadURL);
      
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      alert('Failed to upload image. Please try again.');
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
        
        {/* Loading indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
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
  );
};

export default ProfileImage; 