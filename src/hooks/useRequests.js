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
  getDocs,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const useRequests = () => {
  const { currentUser, userProfile } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get connection request button text based on roles
  const getRequestButtonText = (fromRole, toRole) => {
    if (fromRole === 'learner' && toRole === 'mentor') {
      return 'Request Mentorship';
    } else if (fromRole === 'mentor' && toRole === 'learner') {
      return 'Invite to Session';
    } else if (fromRole === 'recruiter') {
      return 'Offer Opportunity';
    } else if ((fromRole === 'mentor' || fromRole === 'learner') && toRole === 'recruiter') {
      return 'Apply';
    } else {
      return 'Connect';
    }
  };

  // Send a connection request
  const sendRequest = async (toUserId, toRole, message = '') => {
    if (!currentUser || !userProfile) return;

    try {
      // Check if there's already a request in either direction
      const existingRequestQuery = query(
        collection(db, 'requests'),
        where('fromId', 'in', [currentUser.uid, toUserId]),
        where('toId', 'in', [currentUser.uid, toUserId])
      );
      
      const querySnapshot = await getDocs(existingRequestQuery);
      
      if (!querySnapshot.empty) {
        throw new Error('A connection request already exists between these users');
      }

      // Create a new request
      const requestData = {
        fromId: currentUser.uid,
        toId: toUserId,
        fromRole: userProfile.role,
        toRole: toRole,
        status: 'pending',
        timestamp: serverTimestamp(),
        message: message || ''
      };

      await addDoc(collection(db, 'requests'), requestData);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Accept a connection request
  const acceptRequest = async (requestId) => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'accepted',
        responseTimestamp: serverTimestamp()
      });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reject a connection request
  const rejectRequest = async (requestId) => {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'rejected',
        responseTimestamp: serverTimestamp()
      });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Cancel a sent request
  const cancelRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'requests', requestId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get connection status between current user and another user
  const getConnectionStatus = async (otherUserId) => {
    if (!currentUser) return null;
    
    try {
      const requestsQuery = query(
        collection(db, 'requests'),
        where('fromId', 'in', [currentUser.uid, otherUserId]),
        where('toId', 'in', [currentUser.uid, otherUserId])
      );
      
      const querySnapshot = await getDocs(requestsQuery);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const request = querySnapshot.docs[0];
      const requestData = request.data();
      
      return {
        id: request.id,
        ...requestData,
        isIncoming: requestData.toId === currentUser.uid
      };
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Load all connections and requests
  useEffect(() => {
    if (!currentUser) {
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setConnections([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to incoming requests
    const incomingQuery = query(
      collection(db, 'requests'),
      where('toId', '==', currentUser.uid)
    );

    const incomingUnsubscribe = onSnapshot(incomingQuery, async (snapshot) => {
      const requests = [];
      
      for (const doc of snapshot.docs) {
        const request = { id: doc.id, ...doc.data() };
        
        // Get the sender's name and profile image
        try {
          const senderDoc = await getDoc(doc(db, 'users', request.fromId));
          if (senderDoc.exists()) {
            const senderData = senderDoc.data();
            request.senderName = senderData.name;
            request.senderProfileImage = senderData.profileImage;
          }
        } catch (err) {
          console.error('Error fetching sender data:', err);
        }
        
        requests.push(request);
      }
      
      setIncomingRequests(requests);
    }, (err) => {
      console.error('Error fetching incoming requests:', err);
      setError(err.message);
    });

    // Subscribe to outgoing requests
    const outgoingQuery = query(
      collection(db, 'requests'),
      where('fromId', '==', currentUser.uid)
    );

    const outgoingUnsubscribe = onSnapshot(outgoingQuery, async (snapshot) => {
      const requests = [];
      
      for (const doc of snapshot.docs) {
        const request = { id: doc.id, ...doc.data() };
        
        // Get the recipient's name and profile image
        try {
          const recipientDoc = await getDoc(doc(db, 'users', request.toId));
          if (recipientDoc.exists()) {
            const recipientData = recipientDoc.data();
            request.recipientName = recipientData.name;
            request.recipientProfileImage = recipientData.profileImage;
          }
        } catch (err) {
          console.error('Error fetching recipient data:', err);
        }
        
        requests.push(request);
      }
      
      setOutgoingRequests(requests);
    }, (err) => {
      console.error('Error fetching outgoing requests:', err);
      setError(err.message);
    });

    // Get all accepted connections
    const connectionsQuery = query(
      collection(db, 'requests'),
      where('status', '==', 'accepted'),
      where('fromId', 'in', [currentUser.uid]),
    );

    const connectionsUnsubscribe = onSnapshot(connectionsQuery, async (snapshot) => {
      const acceptedConnections = [];
      
      for (const doc of snapshot.docs) {
        const connection = { id: doc.id, ...doc.data() };
        
        // Get connected user data
        const otherUserId = connection.fromId === currentUser.uid ? connection.toId : connection.fromId;
        
        try {
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            connection.connectedUser = {
              id: otherUserId,
              name: userData.name,
              role: userData.role,
              profileImage: userData.profileImage
            };
          }
        } catch (err) {
          console.error('Error fetching connection user data:', err);
        }
        
        acceptedConnections.push(connection);
      }
      
      // Also get connections where the current user is the recipient
      const incomingConnections = query(
        collection(db, 'requests'),
        where('status', '==', 'accepted'),
        where('toId', '==', currentUser.uid)
      );
      
      const incomingConnectionsSnapshot = await getDocs(incomingConnections);
      
      for (const doc of incomingConnectionsSnapshot.docs) {
        const connection = { id: doc.id, ...doc.data() };
        
        // Get connected user data
        try {
          const userDoc = await getDoc(doc(db, 'users', connection.fromId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            connection.connectedUser = {
              id: connection.fromId,
              name: userData.name,
              role: userData.role,
              profileImage: userData.profileImage
            };
          }
        } catch (err) {
          console.error('Error fetching connection user data:', err);
        }
        
        acceptedConnections.push(connection);
      }
      
      setConnections(acceptedConnections);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching connections:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => {
      incomingUnsubscribe();
      outgoingUnsubscribe();
      connectionsUnsubscribe();
    };
  }, [currentUser]);

  return {
    incomingRequests,
    outgoingRequests,
    connections,
    loading,
    error,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    getConnectionStatus,
    getRequestButtonText
  };
};

export default useRequests;
