import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import useChat from '../../hooks/useChat';
import ChatInterface from './ChatInterface';
import { useAuth } from '../../context/AuthContext';

const ConversationsList = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const { conversations, conversationsLoading, chatError } = useChat();
  const { currentUser } = useAuth();

  // Format timestamp for last message
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  // Open chat with a specific user
  const openChat = (conversation) => {
    setActiveConversation({
      userId: conversation.otherUser.id,
      name: conversation.otherUser.name,
      photo: conversation.otherUser.profileImage,
      role: conversation.otherUser.role
    });
  };

  // Close the active chat
  const closeChat = () => {
    setActiveConversation(null);
  };
  
  // Handle empty state
  if (conversationsLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading conversations...</p>
      </div>
    );
  }

  if (chatError) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{chatError}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No conversations yet</h3>
        <p className="mt-1 text-gray-500">
          Connect with mentors and learners to start chatting
        </p>
      </div>
    );
  }

  // Show active chat or conversations list
  if (activeConversation) {
    return (
      <div className="h-[75vh]">
        <ChatInterface 
          otherUserId={activeConversation.userId}
          otherUserName={activeConversation.name}
          otherUserPhoto={activeConversation.photo}
          onClose={closeChat}
        />
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 px-4 py-3">Messages</h2>
      
      <div className="max-h-[70vh] overflow-y-auto">
        {conversations.map((conversation) => {
          const otherUser = conversation.otherUser || {};
          const unreadCount = conversation.unreadCount?.[currentUser?.uid] || 0;
          
          return (
            <div 
              key={conversation.id}
              onClick={() => openChat(conversation)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex-shrink-0 overflow-hidden">
                  {otherUser.profileImage ? (
                    <img src={otherUser.profileImage} alt={otherUser.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-bold text-indigo-700">
                      {otherUser.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {otherUser.name || 'User'}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTimestamp)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage || 'Start a conversation'}
                    </p>
                    
                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs font-medium text-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {otherUser.role || 'User'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationsList; 