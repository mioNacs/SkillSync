import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

/**
 * Hook to manage user notifications
 */
const useNotifications = () => {
  const { currentUser, userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a new notification
  const createNotification = async (data) => {
    if (!data.userId) {
      throw new Error('User ID is required for notification');
    }

    try {
      const notificationData = {
        ...data,
        isRead: false,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'notifications'), notificationData);
      return true;
    } catch (err) {
      console.error('Error creating notification:', err);
      throw err;
    }
  };

  // Create connection request notification
  const createConnectionRequestNotification = async (requestId, toUserId, fromUserId, fromRole, toRole) => {
    try {
      // Get sender info
      const senderDoc = await getDoc(doc(db, 'users', fromUserId));
      if (!senderDoc.exists()) {
        throw new Error('Sender user not found');
      }
      const senderData = senderDoc.data();

      // Determine notification message based on roles
      let title, description;
      if (fromRole === 'learner' && toRole === 'mentor') {
        title = 'New mentorship request';
        description = `${senderData.name} has requested mentorship from you`;
      } else if (fromRole === 'mentor' && toRole === 'learner') {
        title = 'New mentorship invitation';
        description = `${senderData.name} has invited you to connect as a mentee`;
      } else {
        title = 'New connection request';
        description = `${senderData.name} wants to connect with you`;
      }

      await createNotification({
        userId: toUserId,
        type: 'connection',
        title,
        description,
        requestId,
        fromId: fromUserId,
        fromRole,
        toRole,
        senderName: senderData.name,
        senderProfileImage: senderData.profileImage
      });

      return true;
    } catch (err) {
      console.error('Error creating connection notification:', err);
      throw err;
    }
  };

  // Create project join notification
  const createProjectJoinNotification = async (projectId, projectOwnerId, userId) => {
    try {
      // Get project info
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }
      const projectData = projectDoc.data();

      // Get user info
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      const userData = userDoc.data();

      await createNotification({
        userId: projectOwnerId,
        type: 'project',
        title: 'New project member',
        description: `${userData.name} has joined your project "${projectData.name || projectData.title}"`,
        projectId,
        memberId: userId,
        memberName: userData.name,
        memberProfileImage: userData.profileImage,
        projectTitle: projectData.name || projectData.title
      });

      return true;
    } catch (err) {
      console.error('Error creating project join notification:', err);
      throw err;
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  };

  // Accept connection request from notification
  const acceptConnectionRequest = async (notificationId, requestId) => {
    try {
      // Update the request status
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'accepted',
        responseTimestamp: serverTimestamp()
      });

      // Mark the notification as read
      await markAsRead(notificationId);
      
      return true;
    } catch (err) {
      console.error('Error accepting connection request:', err);
      throw err;
    }
  };

  // Decline/reject connection request from notification
  const declineConnectionRequest = async (notificationId, requestId) => {
    try {
      // Update the request status
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'rejected',
        responseTimestamp: serverTimestamp()
      });

      // Mark the notification as read
      await markAsRead(notificationId);
      
      return true;
    } catch (err) {
      console.error('Error declining connection request:', err);
      throw err;
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  // Fetch user notifications
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Query to get user's notifications
    // Using try-catch to handle potential Firestore index errors
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(
        notificationsQuery,
        (snapshot) => {
          const notificationsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            time: formatTimestamp(doc.data().createdAt)
          }));
          
          setNotifications(notificationsData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching notifications:', err);
          
          // Check if it's a Firestore index error
          if (err.code === 'failed-precondition' && err.message.includes('index')) {
            setError('This feature requires a Firestore index. Please create a composite index for notifications on userId and createdAt fields.');
            
            // Fallback: fetch notifications without ordering
            const fallbackQuery = query(
              collection(db, 'notifications'),
              where('userId', '==', currentUser.uid),
              limit(50)
            );
            
            // Subscribe to fallback query
            return onSnapshot(
              fallbackQuery,
              (fallbackSnapshot) => {
                // Sort manually client-side
                const fallbackData = fallbackSnapshot.docs
                  .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    time: formatTimestamp(doc.data().createdAt)
                  }))
                  .sort((a, b) => {
                    // Sort by createdAt in descending order if available
                    if (!a.createdAt) return 1;
                    if (!b.createdAt) return -1;
                    return b.createdAt.seconds - a.createdAt.seconds;
                  });
                
                setNotifications(fallbackData);
                setLoading(false);
              },
              (fallbackErr) => {
                console.error('Error with fallback notifications query:', fallbackErr);
                setError(fallbackErr.message);
                setLoading(false);
              }
            );
          } else {
            setError(err.message);
          }
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up notifications query:', err);
      setError(err.message);
      setLoading(false);
      return () => {};
    }
  }, [currentUser]);

  return {
    notifications,
    loading,
    error,
    createNotification,
    createConnectionRequestNotification,
    createProjectJoinNotification,
    markAsRead,
    deleteNotification,
    acceptConnectionRequest,
    declineConnectionRequest
  };
};

export default useNotifications; 