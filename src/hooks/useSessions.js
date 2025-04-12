import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  onSnapshot,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

// Hook to get a single session
export const useSession = (sessionId) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setSession(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const sessionDocRef = doc(db, 'sessions', sessionId);

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(sessionDocRef, 
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const sessionData = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          };
          
          // Get mentor info
          if (sessionData.mentorId) {
            try {
              const mentorDocRef = doc(db, 'users', sessionData.mentorId);
              const mentorDoc = await getDoc(mentorDocRef);
              if (mentorDoc.exists()) {
                sessionData.mentor = {
                  id: mentorDoc.id,
                  name: mentorDoc.data().name,
                  profileImage: mentorDoc.data().profileImage
                };
              }
            } catch (err) {
              console.error('Error fetching session mentor:', err);
            }
          }
          
          // Get learner info
          if (sessionData.learnerId) {
            try {
              const learnerDocRef = doc(db, 'users', sessionData.learnerId);
              const learnerDoc = await getDoc(learnerDocRef);
              if (learnerDoc.exists()) {
                sessionData.learner = {
                  id: learnerDoc.id,
                  name: learnerDoc.data().name,
                  profileImage: learnerDoc.data().profileImage
                };
              }
            } catch (err) {
              console.error('Error fetching session learner:', err);
            }
          }
          
          setSession(sessionData);
        } else {
          setSession(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching session:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sessionId]);

  return { session, loading, error };
};

// Hook to get all sessions for the current user (either as mentor or learner)
export const useMySessions = (status = null, limit = 20) => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Create a compound query for sessions where the user is either mentor or learner
    const sessionsRef = collection(db, 'sessions');
    let sessionsQuery;
    
    if (status) {
      // Query for specific status
      sessionsQuery = query(
        sessionsRef,
        where('participants', 'array-contains', currentUser.uid),
        where('status', '==', status),
        orderBy('scheduledAt', 'desc'),
        firestoreLimit(limit)
      );
    } else {
      // Query for all sessions
      sessionsQuery = query(
        sessionsRef,
        where('participants', 'array-contains', currentUser.uid),
        orderBy('scheduledAt', 'desc'),
        firestoreLimit(limit)
      );
    }

    const unsubscribe = onSnapshot(
      sessionsQuery, 
      async (snapshot) => {
        const sessionsPromises = snapshot.docs.map(async (doc) => {
          const sessionData = {
            id: doc.id,
            ...doc.data()
          };
          
          // Get mentor info if not the current user
          if (sessionData.mentorId && sessionData.mentorId !== currentUser.uid) {
            try {
              const mentorDocRef = doc(db, 'users', sessionData.mentorId);
              const mentorDoc = await getDoc(mentorDocRef);
              if (mentorDoc.exists()) {
                sessionData.mentor = {
                  id: mentorDoc.id,
                  name: mentorDoc.data().name,
                  profileImage: mentorDoc.data().profileImage
                };
              }
            } catch (err) {
              console.error('Error fetching session mentor:', err);
            }
          }
          
          // Get learner info if not the current user
          if (sessionData.learnerId && sessionData.learnerId !== currentUser.uid) {
            try {
              const learnerDocRef = doc(db, 'users', sessionData.learnerId);
              const learnerDoc = await getDoc(learnerDocRef);
              if (learnerDoc.exists()) {
                sessionData.learner = {
                  id: learnerDoc.id,
                  name: learnerDoc.data().name,
                  profileImage: learnerDoc.data().profileImage
                };
              }
            } catch (err) {
              console.error('Error fetching session learner:', err);
            }
          }
          
          return sessionData;
        });
        
        const sessionsData = await Promise.all(sessionsPromises);
        setSessions(sessionsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching sessions:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, status, limit]);

  return { sessions, loading, error };
};

// Hook to get all sessions for a specific user (either as mentor or learner)
export const useUserSessions = (userId, role = 'both', status = null, limit = 10) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Determine which field to query based on role
    const sessionsRef = collection(db, 'sessions');
    let sessionsQuery;
    
    if (status) {
      // Query with status filter
      if (role === 'mentor') {
        sessionsQuery = query(
          sessionsRef,
          where('mentorId', '==', userId),
          where('status', '==', status),
          orderBy('scheduledAt', 'desc'),
          firestoreLimit(limit)
        );
      } else if (role === 'learner') {
        sessionsQuery = query(
          sessionsRef,
          where('learnerId', '==', userId),
          where('status', '==', status),
          orderBy('scheduledAt', 'desc'),
          firestoreLimit(limit)
        );
      } else {
        // 'both' role - we'll need to fetch separately and combine
        const mentorQuery = query(
          sessionsRef,
          where('mentorId', '==', userId),
          where('status', '==', status),
          orderBy('scheduledAt', 'desc'),
          firestoreLimit(limit)
        );
        
        const learnerQuery = query(
          sessionsRef,
          where('learnerId', '==', userId),
          where('status', '==', status),
          orderBy('scheduledAt', 'desc'),
          firestoreLimit(limit)
        );
        
        // Fetch both queries and merge results
        const fetchBothRoles = async () => {
          try {
            const [mentorSnapshot, learnerSnapshot] = await Promise.all([
              getDocs(mentorQuery),
              getDocs(learnerQuery)
            ]);
            
            const mentorSessions = mentorSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            const learnerSessions = learnerSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            // Combine, deduplicate, and sort sessions
            const allSessions = [...mentorSessions, ...learnerSessions]
              .filter((session, index, self) => 
                index === self.findIndex(s => s.id === session.id)
              )
              .sort((a, b) => {
                const dateA = a.scheduledAt?.toDate?.() || new Date(a.scheduledAt);
                const dateB = b.scheduledAt?.toDate?.() || new Date(b.scheduledAt);
                return dateB - dateA;
              })
              .slice(0, limit);
              
            // Fetch additional user info
            const sessionsWithUserInfo = await Promise.all(
              allSessions.map(async (session) => {
                // Get mentor info
                if (session.mentorId && session.mentorId !== userId) {
                  try {
                    const mentorDocRef = doc(db, 'users', session.mentorId);
                    const mentorDoc = await getDoc(mentorDocRef);
                    if (mentorDoc.exists()) {
                      session.mentor = {
                        id: mentorDoc.id,
                        name: mentorDoc.data().name,
                        profileImage: mentorDoc.data().profileImage
                      };
                    }
                  } catch (err) {
                    console.error('Error fetching session mentor:', err);
                  }
                }
                
                // Get learner info
                if (session.learnerId && session.learnerId !== userId) {
                  try {
                    const learnerDocRef = doc(db, 'users', session.learnerId);
                    const learnerDoc = await getDoc(learnerDocRef);
                    if (learnerDoc.exists()) {
                      session.learner = {
                        id: learnerDoc.id,
                        name: learnerDoc.data().name,
                        profileImage: learnerDoc.data().profileImage
                      };
                    }
                  } catch (err) {
                    console.error('Error fetching session learner:', err);
                  }
                }
                
                return session;
              })
            );
            
            setSessions(sessionsWithUserInfo);
            setLoading(false);
          } catch (err) {
            console.error('Error fetching sessions:', err);
            setError(err.message);
            setLoading(false);
          }
        };
        
        fetchBothRoles();
        return; // Skip the rest of the function since we've handled both roles
      }
    } else {
      // Query without status filter
      if (role === 'mentor') {
        sessionsQuery = query(
          sessionsRef,
          where('mentorId', '==', userId),
          orderBy('scheduledAt', 'desc'),
          firestoreLimit(limit)
        );
      } else if (role === 'learner') {
        sessionsQuery = query(
          sessionsRef,
          where('learnerId', '==', userId),
          orderBy('scheduledAt', 'desc'),
          firestoreLimit(limit)
        );
      } else {
        // 'both' role - use participants array for more efficient query
        sessionsQuery = query(
          sessionsRef,
          where('participants', 'array-contains', userId),
          orderBy('scheduledAt', 'desc'),
          firestoreLimit(limit)
        );
      }
    }

    const unsubscribe = onSnapshot(
      sessionsQuery, 
      async (snapshot) => {
        const sessionsPromises = snapshot.docs.map(async (doc) => {
          const sessionData = {
            id: doc.id,
            ...doc.data()
          };
          
          // Get mentor info
          if (sessionData.mentorId && sessionData.mentorId !== userId) {
            try {
              const mentorDocRef = doc(db, 'users', sessionData.mentorId);
              const mentorDoc = await getDoc(mentorDocRef);
              if (mentorDoc.exists()) {
                sessionData.mentor = {
                  id: mentorDoc.id,
                  name: mentorDoc.data().name,
                  profileImage: mentorDoc.data().profileImage
                };
              }
            } catch (err) {
              console.error('Error fetching session mentor:', err);
            }
          }
          
          // Get learner info
          if (sessionData.learnerId && sessionData.learnerId !== userId) {
            try {
              const learnerDocRef = doc(db, 'users', sessionData.learnerId);
              const learnerDoc = await getDoc(learnerDocRef);
              if (learnerDoc.exists()) {
                sessionData.learner = {
                  id: learnerDoc.id,
                  name: learnerDoc.data().name,
                  profileImage: learnerDoc.data().profileImage
                };
              }
            } catch (err) {
              console.error('Error fetching session learner:', err);
            }
          }
          
          return sessionData;
        });
        
        const sessionsData = await Promise.all(sessionsPromises);
        setSessions(sessionsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching sessions:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, role, status, limit]);

  return { sessions, loading, error };
};

export default useSessions; 