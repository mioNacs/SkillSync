import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useRequests from '../../hooks/useRequests';
import { useAuth } from '../../context/AuthContext';

const ConnectionButton = ({ targetUser }) => {
  const { userProfile } = useAuth();
  const { 
    sendRequest, 
    acceptRequest, 
    rejectRequest, 
    cancelRequest, 
    getConnectionStatus, 
    getRequestButtonText 
  } = useRequests();
  
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);
  
  useEffect(() => {
    const fetchConnectionStatus = async () => {
      if (!targetUser?.id || !userProfile) {
        setLoading(false);
        return;
      }
      
      try {
        const status = await getConnectionStatus(targetUser.id);
        setConnectionStatus(status);
      } catch (error) {
        console.error('Error fetching connection status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnectionStatus();
  }, [targetUser?.id, userProfile, getConnectionStatus]);
  
  if (loading) {
    return (
      <button 
        className="bg-gray-200 text-gray-400 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-1"
        disabled
      >
        <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading
      </button>
    );
  }
  
  // If current user is viewing their own profile
  if (targetUser?.id === userProfile?.uid) {
    return null;
  }
  
  // Handle send request
  const handleSendRequest = async () => {
    if (showMessageInput) {
      try {
        await sendRequest(targetUser.id, targetUser.role, message);
        toast.success('Request sent successfully!');
        setShowMessageInput(false);
        setMessage('');
        
        // Update connection status
        const status = await getConnectionStatus(targetUser.id);
        setConnectionStatus(status);
      } catch (error) {
        toast.error(error.message || 'Failed to send request');
      }
    } else {
      setShowMessageInput(true);
    }
  };
  
  // Handle cancel request
  const handleCancelRequest = async () => {
    try {
      await cancelRequest(connectionStatus.id);
      toast.success('Request cancelled');
      setConnectionStatus(null);
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };
  
  // Handle accept request
  const handleAcceptRequest = async () => {
    try {
      await acceptRequest(connectionStatus.id);
      toast.success('Request accepted');
      
      // Update connection status
      const status = await getConnectionStatus(targetUser.id);
      setConnectionStatus(status);
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };
  
  // Handle reject request
  const handleRejectRequest = async () => {
    try {
      await rejectRequest(connectionStatus.id);
      toast.success('Request rejected');
      
      // Update connection status
      const status = await getConnectionStatus(targetUser.id);
      setConnectionStatus(status);
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };
  
  // If no connection exists yet
  if (!connectionStatus) {
    const buttonText = getRequestButtonText(userProfile?.role, targetUser?.role);
    
    if (showMessageInput) {
      return (
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Add a message (optional)"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSendRequest}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 text-sm"
            >
              Send
            </button>
            <button
              onClick={() => setShowMessageInput(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <button
        onClick={handleSendRequest}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 text-sm flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
        </svg>
        {buttonText}
      </button>
    );
  }
  
  // If a connection request already exists
  if (connectionStatus.status === 'pending') {
    if (connectionStatus.isIncoming) {
      // For incoming requests
      return (
        <div className="flex gap-2">
          <button
            onClick={handleAcceptRequest}
            className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 text-sm"
          >
            Accept
          </button>
          <button
            onClick={handleRejectRequest}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 text-sm"
          >
            Reject
          </button>
        </div>
      );
    } else {
      // For outgoing requests
      return (
        <button
          onClick={handleCancelRequest}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Cancel Request
        </button>
      );
    }
  }
  
  // If the connection is accepted
  if (connectionStatus.status === 'accepted') {
    return (
      <button
        className="bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-1"
        disabled
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
        </svg>
        Connected
      </button>
    );
  }
  
  // If the connection is rejected
  if (connectionStatus.status === 'rejected') {
    return (
      <button
        onClick={handleSendRequest}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 text-sm flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
        </svg>
        Request Again
      </button>
    );
  }
  
  return null;
};

export default ConnectionButton;
