import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, logout, getUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          console.log("Fetching data for user:", currentUser.uid);
          const data = await getUserData(currentUser.uid);
          console.log("User data retrieved:", data);
          setUserData(data);
          
          // If no data exists, create the user document
          if (!data) {
            console.log("No user data found, creating default profile");
            // This could happen if the user was authenticated but the Firestore document wasn't created
            await setDoc(doc(db, 'users', currentUser.uid), {
              uid: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email,
              skills: [],
              goals: ''
            });
            
            // Fetch the newly created data
            const newData = await getUserData(currentUser.uid);
            setUserData(newData);
          }
        }
      } catch (error) {
        setError('Failed to load user data: ' + error.message);
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };
    
    fetchUserData();
  }, [currentUser, getUserData]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {userData?.name || currentUser?.displayName || currentUser?.email}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">User Information</h3>
                <p><span className="font-medium">Email:</span> {userData?.email || currentUser?.email}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Your Skills</h3>
                {userData?.skills && userData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Goals</h2>
            <p className="text-gray-700">{userData?.goals || "No goals set yet."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;