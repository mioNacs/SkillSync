import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, logout, getUserData, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch user data if the user is authenticated
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
        } else {
          // User is not authenticated, set loading to false
          setLoading(false);
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

  if (loading && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  // Guest dashboard for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight sm:text-5xl md:text-6xl">
              Welcome to SkillSync
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-gray-700 sm:text-xl md:mt-5 md:max-w-3xl">
              Connect, learn, and grow with a community of skilled professionals, mentors, and job opportunities.
            </p>
            
            <div className="mt-10 flex justify-center gap-4 flex-col sm:flex-row">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Sign up
                </Link>
              </div>
              <div className="mt-3 sm:mt-0">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>

          {/* Features section */}
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Connect with Talents</h3>
                <p className="mt-2 text-base text-gray-600">
                  Build your network with skilled professionals and discover collaboration opportunities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Find Mentorship</h3>
                <p className="mt-2 text-base text-gray-600">
                  Learn from industry experts who can guide you on your professional journey.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Discover Opportunities</h3>
                <p className="mt-2 text-base text-gray-600">
                  Explore job postings tailored to your skills and career aspirations.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial section */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Join thousands of professionals</h2>
              <p className="mt-4 text-lg text-gray-600 italic">
                "SkillSync helped me connect with the perfect mentor who guided me through my career transition into tech. The community support is incredible!"
              </p>
              <div className="mt-4">
                <p className="font-medium text-gray-900">Alex Johnson</p>
                <p className="text-sm text-gray-600">Frontend Developer</p>
              </div>
            </div>
          </div>

          {/* CTA section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Ready to boost your career?</h2>
            <div className="mt-6">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original dashboard for authenticated users
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