import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  addDoc, 
  orderBy, 
  doc, 
  getDoc, 
  onSnapshot, 
  serverTimestamp, 
  updateDoc,
  getDocs,
  limit,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for handling chat functionality between connected users
 */
const useChat = (otherUserId = null) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);

  // Get or create a conversation between two users
  const getOrCreateConversation = async (userId, otherUserId) => {
    if (!userId || !otherUserId) return null;

    try {
      // Check if a conversation already exists between these users
      const conversationsQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId)
      );
      
      const querySnapshot = await getDocs(conversationsQuery);
      
      // Find conversations that include the other user
      let existingConversation = null;
      querySnapshot.forEach((docSnap) => {
        const conversationData = docSnap.data();
        if (conversationData.participants.includes(otherUserId)) {
          existingConversation = { id: docSnap.id, ...conversationData };
        }
      });
      
      if (existingConversation) {
        return existingConversation.id;
      }
      
      // If no conversation exists, create a new one
      const conversationData = {
        participants: [userId, otherUserId],
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTimestamp: serverTimestamp(),
        unreadCount: {
          [userId]: 0,
          [otherUserId]: 0
        }
      };
      
      const newConversationRef = await addDoc(collection(db, 'conversations'), conversationData);
      return newConversationRef.id;
    } catch (err) {
      setChatError(`Error getting or creating conversation: ${err.message}`);
      console.error('Error getting or creating conversation:', err);
      return null;
    }
  };

  // Send a message in the conversation
  const sendMessage = async (content, attachment = null) => {
    if (!currentUser || !otherUserId || !conversationId) {
      setChatError('Cannot send message: Missing user or conversation information');
      return false;
    }

    try {
      const messageData = {
        conversationId,
        senderId: currentUser.uid,
        content,
        timestamp: serverTimestamp(),
        isRead: false
      };

      if (attachment) {
        messageData.attachment = attachment;
      }

      // Add the message to the messages collection
      await addDoc(collection(db, 'messages'), messageData);

      // Update the conversation with last message information
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: content,
        lastMessageTimestamp: serverTimestamp(),
        [`unreadCount.${otherUserId}`]: increment(1)
      });

      return true;
    } catch (err) {
      setChatError(`Error sending message: ${err.message}`);
      console.error('Error sending message:', err);
      return false;
    }
  };

  // Mark all messages in the conversation as read
  const markMessagesAsRead = async () => {
    if (!currentUser || !conversationId) return;

    try {
      // Update the unread count for the current user
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`unreadCount.${currentUser.uid}`]: 0
      });

      // Get unread messages from the other user
      const unreadMessagesQuery = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        where('senderId', '==', otherUserId),
        where('isRead', '==', false)
      );

      const unreadSnapshot = await getDocs(unreadMessagesQuery);
      
      // Mark each message as read
      const markReadPromises = unreadSnapshot.docs.map(docSnap => {
        const messageRef = doc(db, 'messages', docSnap.id);
        return updateDoc(messageRef, { isRead: true });
      });

      await Promise.all(markReadPromises);
      return true;
    } catch (err) {
      setChatError(`Error marking messages as read: ${err.message}`);
      console.error('Error marking messages as read:', err);
      return false;
    }
  };

  // Load user conversations
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setConversationsLoading(false);
      return;
    }

    setConversationsLoading(true);

    try {
      const conversationsQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', currentUser.uid),
        orderBy('lastMessageTimestamp', 'desc')
      );

      const unsubscribe = onSnapshot(conversationsQuery, async (snapshot) => {
        const conversationsData = [];
        
        for (const docSnap of snapshot.docs) {
          const conversation = { id: docSnap.id, ...docSnap.data() };
          
          // Get the other participant's information
          const otherParticipantId = conversation.participants.find(id => id !== currentUser.uid);
          if (otherParticipantId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', otherParticipantId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                conversation.otherUser = {
                  id: otherParticipantId,
                  name: userData.name,
                  profileImage: userData.profileImage,
                  role: userData.role
                };
              }
            } catch (err) {
              console.error(`Error fetching user data for ${otherParticipantId}:`, err);
            }
          }
          
          conversationsData.push(conversation);
        }
        
        setConversations(conversationsData);
        setConversationsLoading(false);
      }, (err) => {
        console.error('Error fetching conversations:', err);
        setChatError(`Error loading conversations: ${err.message}`);
        setConversationsLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up conversations query:', err);
      setChatError(`Error setting up conversations query: ${err.message}`);
      setConversationsLoading(false);
      return () => {};
    }
  }, [currentUser]);

  // Load messages for a specific conversation
  useEffect(() => {
    if (!currentUser || !otherUserId) {
      setMessages([]);
      setChatLoading(false);
      return;
    }

    const setupChat = async () => {
      try {
        // Get or create conversation between the two users
        const convId = await getOrCreateConversation(currentUser.uid, otherUserId);
        if (!convId) {
          setChatError('Could not establish conversation');
          setChatLoading(false);
          return () => {};
        }
        
        setConversationId(convId);
        
        // Subscribe to messages in this conversation
        const messagesQuery = query(
          collection(db, 'messages'),
          where('conversationId', '==', convId),
          orderBy('timestamp', 'asc'),
          limit(100)
        );
        
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messagesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date()
          }));
          
          setMessages(messagesData);
          setChatLoading(false);
          
          // Mark messages as read if they're from the other user
          if (messagesData.some(msg => msg.senderId === otherUserId && !msg.isRead)) {
            markMessagesAsRead();
          }
        }, (err) => {
          console.error('Error fetching messages:', err);
          setChatError(`Error loading messages: ${err.message}`);
          setChatLoading(false);
        });
        
        return unsubscribe;
      } catch (err) {
        console.error('Error setting up chat:', err);
        setChatError(`Error setting up chat: ${err.message}`);
        setChatLoading(false);
        return () => {};
      }
    };
    
    setChatLoading(true);
    const unsubscribePromise = setupChat();
    
    return () => {
      if (unsubscribePromise && typeof unsubscribePromise.then === 'function') {
        unsubscribePromise.then(unsubscribe => {
          if (unsubscribe) unsubscribe();
        });
      }
    };
  }, [currentUser, otherUserId]);

  return {
    // Messages for a specific conversation
    messages,
    chatLoading,
    chatError,
    sendMessage,
    markMessagesAsRead,
    conversationId,
    
    // List of all user conversations
    conversations,
    conversationsLoading,
    getOrCreateConversation
  };
};

export default useChat; 