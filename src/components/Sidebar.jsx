import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  const { currentUser, userProfile, isAuthenticated } = useAuth()
  
  // Get user role for conditional rendering
  const userRole = userProfile?.role || 'member'
  const isMentor = userRole === 'mentor'
  const isRecruiter = userRole === 'recruiter'
  const isLearner = userRole === 'member' || userRole === 'learner'
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Projects', path: '/projects', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    // Only show Jobs section to learners (not mentors or recruiters)
    ...(isMentor || isRecruiter ? [] : [{ 
      name: 'Jobs', 
      path: '/jobs', 
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' 
    }]),
    // Show Talents section to all users
    { 
      name: 'Talents', 
      path: '/talents', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' 
    },
    { name: 'Mentorship', path: '/mentorship', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Explore', path: '/explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  ]
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (userProfile?.name) {
      return userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    if (currentUser?.email) {
      return currentUser.email[0].toUpperCase()
    }
    return 'U'
  }
  
  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`${isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed inset-0 bg-black z-20 transition-opacity duration-300 md:hidden`}
        onClick={() => document.dispatchEvent(new CustomEvent('toggleSidebar'))}
      ></div>
      
      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed top-0 left-0 h-full w-72 bg-white border-r z-30 shadow-lg md:shadow-none overflow-hidden transition-transform duration-300 ease-in-out`}>
        {/* Fixed height sidebar content with scrollable interior */}
        <div className="h-full flex flex-col pt-16">
          <div className="p-4 flex-1 overflow-y-auto scrollbar-thin">
            <div className="border-b pb-4 mb-6 flex flex-col items-center md:items-center">
              {/* Updated logo design */}
              
              {/* Updated font style with custom typography */}
              <h2 className="text-2xl font-bold text-indigo-800 tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                SkillSync
              </h2>
              {/* Added "by BitLinguals" subscript */}
              <p className="text-xs text-indigo-500 -mt-1 mb-1 italic font-medium">
                by BitLinguals
              </p>
              <p className="text-sm text-gray-600">Connecting skills & people</p>
              
              {isAuthenticated && (
                <div className="mt-3 text-center md:text-left w-full">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {userProfile?.profileImage ? (
                          <img 
                            src={userProfile.profileImage} 
                            alt={userProfile.name || currentUser.displayName} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                            {getUserInitials()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {userProfile?.name || currentUser?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userProfile?.title || (
                            isMentor ? 'Mentor' : 
                            isRecruiter ? 'Recruiter' : 
                            'Learner'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <nav>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.name}>
                      <Link 
                        to={item.path} 
                        className={`flex items-center p-3 rounded-lg text-sm transition-all duration-200 ${
                          isActive 
                            ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={item.icon} />
                        </svg>
                        <span>{item.name}</span>
                        {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            
            {/* Role-specific actions */}
            {isAuthenticated && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xs uppercase text-gray-500 font-medium mb-2 px-3">Quick Actions</h3>
                <ul className="space-y-1">
                  {isMentor && (
                    <li>
                      <Link to="/offer-mentorship" className="flex items-center p-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                        <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Offer Mentorship to Talents</span>
                      </Link>
                    </li>
                  )}
                  
                  {isRecruiter && (
                    <li>
                      <Link to="/contact-talents" className="flex items-center p-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                        <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Contact Talents for Hiring</span>
                      </Link>
                    </li>
                  )}
                  
                  {isLearner && (
                    <li>
                      <Link to="/connect-talents" className="flex items-center p-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                        <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>Connect with Talents</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar