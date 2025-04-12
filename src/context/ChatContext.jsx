import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useChat from '../hooks/useChat';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

// Modified hook to avoid conditional hook calls
export const useChatContext = (otherUserId = null) => {
  const context = useContext(ChatContext);
  
  // We always return the context without conditional hooks
  return context;
};

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const chatHook = useChat(); // For global conversations list
  const { conversations } = chatHook;
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Calculate total unread messages whenever conversations change
  useEffect(() => {
    try {
      if (conversations && currentUser) {
        const totalUnread = conversations.reduce((total, conversation) => {
          try {
            return total + (conversation.unreadCount?.[currentUser.uid] || 0);
          } catch (err) {
            console.error('Error calculating unread count for conversation:', err);
            return total;
          }
        }, 0);
        setUnreadMessagesCount(totalUnread);
      } else {
        setUnreadMessagesCount(0);
      }
    } catch (err) {
      console.error('Error in chat context useEffect:', err);
      setUnreadMessagesCount(0);
    }
  }, [conversations, currentUser]);

  // Value to provide to the chat context
  const value = {
    ...chatHook,
    unreadMessagesCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider; 