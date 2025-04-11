import React from 'react';
import { Link } from 'react-router-dom';
import useRequests from '../../hooks/useRequests';
import { formatDistance } from 'date-fns';
import { toast } from 'react-hot-toast';

const RequestsList = () => {
  const { 
    incomingRequests, 
    outgoingRequests, 
    acceptRequest, 
    rejectRequest, 
    cancelRequest, 
    loading, 
    error 
  } = useRequests();
  
  // Handle accept request
  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptRequest(requestId);
      toast.success('Request accepted');
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };
  
  // Handle reject request
  const handleRejectRequest = async (requestId) => {
    try {
      await rejectRequest(requestId);
      toast.success('Request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };
  
  // Handle cancel request
  const handleCancelRequest = async (requestId) => {
    try {
      await cancelRequest(requestId);
      toast.success('Request cancelled');
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
        <p>Error loading requests: {error}</p>
      </div>
    );
  }
  
  if (incomingRequests.length === 0 && outgoingRequests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No connection requests</h3>
        <p className="mt-1 text-sm text-gray-500">You don't have any pending connection requests at the moment.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Incoming Requests */}
      {incomingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">Incoming Requests</h2>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {incomingRequests.map((request) => (
              <li key={request.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {request.senderProfileImage ? (
                      <img 
                        src={request.senderProfileImage} 
                        alt={request.senderName || 'User'} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
                        {request.senderName ? request.senderName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {request.senderName || 'User'}
                        <span className="ml-2 text-sm font-normal text-gray-500 capitalize">
                          ({request.fromRole})
                        </span>
                      </h3>
                      
                      <p className="mt-1 text-sm text-gray-500">
                        {request.message || `Wants to connect with you as a ${request.toRole}`}
                      </p>
                      
                      <p className="mt-1 text-xs text-gray-400">
                        {formatTimestamp(request.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Outgoing Requests */}
      {outgoingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">Outgoing Requests</h2>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {outgoingRequests.map((request) => (
              <li key={request.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {request.recipientProfileImage ? (
                      <img 
                        src={request.recipientProfileImage} 
                        alt={request.recipientName || 'User'} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
                        {request.recipientName ? request.recipientName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {request.recipientName || 'User'}
                        <span className="ml-2 text-sm font-normal text-gray-500 capitalize">
                          ({request.toRole})
                        </span>
                      </h3>
                      
                      <p className="mt-1 text-sm text-gray-500">
                        {request.message || `You requested to connect as a ${request.fromRole}`}
                      </p>
                      
                      <div className="mt-1 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {formatTimestamp(request.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCancelRequest(request.id)}
                    className="text-gray-600 hover:text-red-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
