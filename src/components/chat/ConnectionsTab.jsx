import React, { useState } from 'react';
import useRequests from '../../hooks/useRequests';
import useChat from '../../hooks/useChat';
import ChatInterface from './ChatInterface';
import { useAuth } from '../../context/AuthContext';

const ConnectionsTab = () => {
  const { connections, loading, error } = useRequests();
  const { currentUser } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [startingChat, setStartingChat] = useState(false);
  
  // Handle starting a chat with a connection
  const startChat = async (connection) => {
    if (!connection.connectedUser || startingChat) return;
    
    try {
      setStartingChat(true);
      
      // Set active chat immediately for better UX
      setActiveChat({
        userId: connection.connectedUser.id,
        name: connection.connectedUser.name,
        photo: connection.connectedUser.profileImage,
        role: connection.connectedUser.role
      });
      
      setStartingChat(false);
    } catch (err) {
      console.error('Error starting chat:', err);
      setStartingChat(false);
    }
  };
  
  // Close the active chat
  const closeChat = () => {
    setActiveChat(null);
  };
  
  // Display loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your connections...</p>
      </div>
    );
  }
  
  // Display error state
  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error loading connections: {error}</p>
      </div>
    );
  }
  
  // Display no connections state
  if (!connections || connections.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No connections yet</h3>
        <p className="mt-1 text-gray-500">
          Connect with mentors and learners to start chatting
        </p>
      </div>
    );
  }
  
  // Show active chat or connections list
  if (activeChat) {
    return (
      <div className="h-[75vh]">
        <ChatInterface 
          otherUserId={activeChat.userId}
          otherUserName={activeChat.name}
          otherUserPhoto={activeChat.photo}
          onClose={closeChat}
        />
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-200">
      <div className="px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Your Connections</h2>
        <span className="text-sm text-gray-500">Total: {connections.length}</span>
      </div>
      
      <div className="max-h-[70vh] overflow-y-auto">
        {connections.map((connection) => {
          const user = connection.connectedUser || {};
          const isCurrentUserSender = connection.fromId === currentUser?.uid;
          const otherUserRole = isCurrentUserSender ? connection.toRole : connection.fromRole;
          
          return (
            <div key={connection.id} className="border-b border-gray-100 last:border-b-0">
              <div 
                onClick={() => startChat(connection)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <div className="flex items-center">
                  {/* Profile Image */}
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex-shrink-0 overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-indigo-700">
                        {user.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900">
                      {user.name || 'User'}
                    </h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {otherUserRole || 'Connection'}
                    </p>
                  </div>
                  
                  {/* Chat Button */}
                  <button 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      startChat(connection);
                    }}
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionsTab; 