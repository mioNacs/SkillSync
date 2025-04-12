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

// Hook to get a single user profile
export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const userDocRef = doc(db, 'users', userId);

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(userDocRef, 
      (doc) => {
        if (doc.exists()) {
          setProfile({
            id: doc.id,
            ...doc.data()
          });
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching user profile:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { profile, loading, error };
};

// Hook to get all users, optionally filtered by role
export const useUsers = (role = null, limit = 50) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    let usersQuery;
    const usersRef = collection(db, 'users');
    
    if (role) {
      usersQuery = query(
        usersRef, 
        where('role', '==', role),
        firestoreLimit(limit)
      );
    } else {
      usersQuery = query(
        usersRef, 
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit)
      );
    }

    const unsubscribe = onSnapshot(
      usersQuery, 
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [role, limit]);

  return { users, loading, error };
};

// Hook to search users by skills, name or bio
export const useSearchUsers = (searchTerm, role = null, limit = 50) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Normalize search term
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    // We use a client-side filtering approach because Firestore doesn't support
    // array contains with another query condition in the same composite index
    const fetchAndFilterUsers = async () => {
      try {
        let usersQuery;
        const usersRef = collection(db, 'users');
        
        if (role) {
          usersQuery = query(
            usersRef, 
            where('role', '==', role),
            firestoreLimit(limit)
          );
        } else {
          usersQuery = query(
            usersRef, 
            firestoreLimit(limit)
          );
        }

        const querySnapshot = await getDocs(usersQuery);
        
        // Filter users client-side
        const filteredUsers = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(user => {
            // Check name match
            if (user.name?.toLowerCase().includes(normalizedSearchTerm)) {
              return true;
            }
            
            // Check bio match
            if (user.bio?.toLowerCase().includes(normalizedSearchTerm)) {
              return true;
            }
            
            // Check skills match
            if (user.skills?.some(skill => {
              if (typeof skill === 'string') {
                return skill.toLowerCase().includes(normalizedSearchTerm);
              } else if (typeof skill === 'object' && skill.name) {
                return skill.name.toLowerCase().includes(normalizedSearchTerm);
              }
              return false;
            })) {
              return true;
            }
            
            return false;
          });
          
        setUsers(filteredUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error searching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAndFilterUsers();
  }, [searchTerm, role, limit]);

  return { users, loading, error };
};

export default useUsers; 