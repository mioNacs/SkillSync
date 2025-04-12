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
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar