import { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ toggleSidebar, scrolled }) => {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <nav className={`${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-indigo-700'} fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-indigo-800 text-white transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className={`font-bold text-xl ${scrolled ? 'text-indigo-700' : 'text-white'} transition-colors duration-300`}>SkillSync</span>
            </Link>
          </div>
          
          <div className={`hidden md:flex items-center space-x-6 ${scrolled ? 'text-gray-700' : 'text-white'} transition-colors duration-300`}>
            <Link to="/explore" className="hover:text-indigo-400 transition-colors duration-200">Explore</Link>
            <Link to="/projects" className="hover:text-indigo-400 transition-colors duration-200">Projects</Link>
            <Link to="/mentorship" className="hover:text-indigo-400 transition-colors duration-200">Mentorship</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className={`p-2 rounded-md ${scrolled ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-indigo-800 text-white'} transition-all duration-200`}
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-gray-50 rounded-lg shadow-xl border overflow-hidden z-50 animate-slideDown">
                  <div className="px-4 py-3 border-b bg-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  
                  <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
                    <div className="p-4 border-b hover:bg-white transition-colors duration-200 cursor-pointer flex items-start">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-800">New mentor request</p>
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">New</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Sarah Williams wants to connect with you</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-400">10 minutes ago</p>
                          <div className="flex space-x-1">
                            <button className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors">Accept</button>
                            <button className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors">Decline</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-b hover:bg-white transition-colors duration-200 cursor-pointer flex items-start">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center text-purple-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-800">Project invitation</p>
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">New</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">You've been invited to join "AI Learning Platform"</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-400">1 hour ago</p>
                          <div className="flex space-x-1">
                            <button className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors">View</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-b hover:bg-white transition-colors duration-200 cursor-pointer flex items-start">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Profile verification complete</p>
                        <p className="text-xs text-gray-600 mt-1">Your profile has been verified and is now visible to mentors</p>
                        <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/notifications" onClick={() => setShowNotifications(false)} className="block py-3 px-4 text-center border-t text-indigo-600 hover:bg-indigo-50 transition-colors">
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/profile" className="flex items-center space-x-1 group">
              <div className={`h-8 w-8 rounded-full ${scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500 text-white'} flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out group-hover:ring-2 group-hover:ring-indigo-300`}>
                <span className="font-bold">JS</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 