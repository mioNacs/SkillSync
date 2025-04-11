import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onIdTokenChanged,
  getIdToken
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshToken, setRefreshToken] = useState(null);

  // Sign up with email and password
  const signup = async (email, password, name, role = 'member') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: role,
        skills: [],
        interests: [],
        bio: '',
        profileCompleted: false,
        createdAt: new Date().toISOString(),
        profileImage: null
      });

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if this is first sign in
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email,
          role: 'member',
          skills: [],
          interests: [],
          bio: '',
          profileCompleted: false,
          createdAt: new Date().toISOString(),
          profileImage: user.photoURL || null
        });
      }
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get user data from Firestore
  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData);
        return userData;
      }
      return null;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (uid, data) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      const updatedProfile = { ...userProfile, ...data };
      setUserProfile(updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Token refresh function
  const refreshUserToken = async (user) => {
    if (user) {
      const token = await getIdToken(user, true);
      localStorage.setItem('authToken', token);
      
      // Set a timeout to refresh the token before it expires (every 20 minutes)
      const tokenRefreshTimeout = setTimeout(() => {
        refreshUserToken(user);
      }, auth.tokenRefreshTime); // 20 minutes in milliseconds
      
      return () => clearTimeout(tokenRefreshTimeout);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch user data from Firestore whenever auth state changes
          await getUserData(user.uid);
          
          // Refresh the token and set up automatic refresh
          refreshUserToken(user);
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        // Clear token from localStorage if user is logged out
        localStorage.removeItem('authToken');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Set up token refresh listener
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        // Get new token and store it
        const token = await getIdToken(user);
        setRefreshToken(token);
        localStorage.setItem('authToken', token);
      } else {
        setRefreshToken(null);
        localStorage.removeItem('authToken');
      }
    });

    return unsubscribe;
  }, []);

  // Try to restore user session on page reload
  useEffect(() => {
    const checkTokenOnRefresh = () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken && !currentUser) {
        // Force refresh when token exists but user state is null
        setLoading(true);
      }
    };

    window.addEventListener('storage', checkTokenOnRefresh);
    window.addEventListener('focus', checkTokenOnRefresh);
    
    return () => {
      window.removeEventListener('storage', checkTokenOnRefresh);
      window.removeEventListener('focus', checkTokenOnRefresh);
    };
  }, [currentUser]);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    googleSignIn,
    getUserData,
    updateUserProfile,
    error,
    setError,
    isAuthenticated: !!currentUser,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};