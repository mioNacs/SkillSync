import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import { useAuth } from '../../context/AuthContext';

const ChatButton = ({ otherUserId, otherUserName, otherUserPhoto, buttonText = "Chat" }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const { currentUser } = useAuth();

  // Don't render button if viewing own profile
  if (currentUser?.uid === otherUserId) {
    return null;
  }

  // Toggle chat window
  const toggleChat = () => {
    setChatOpen(prev => !prev);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg 
          className="mr-2 h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        {buttonText}
      </button>

      {chatOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="h-[80vh]">
              <ChatInterface
                otherUserId={otherUserId}
                otherUserName={otherUserName}
                otherUserPhoto={otherUserPhoto}
                onClose={toggleChat}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton; 