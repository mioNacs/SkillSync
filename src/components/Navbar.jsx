import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useNotifications from '../hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'

const Navbar = ({ toggleSidebar, scrolled }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)
  const profileButtonRef = useRef(null)
  const notificationsMenuRef = useRef(null)
  const notificationsButtonRef = useRef(null)

  const { currentUser, userProfile, logout, isAuthenticated } = useAuth()
  const { 
    notifications,
    loading: notificationsLoading,
    error: notificationsError,
    markAsRead,
    acceptConnectionRequest,
    declineConnectionRequest
  } = useNotifications()
  const navigate = useNavigate()
  
  // Get unread notifications count
  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0
  
  // Handle clicks outside the profile menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle profile menu outside clicks
      if (
        showProfileMenu &&
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false)
      }

      // Handle notifications menu outside clicks
      if (
        showNotifications &&
        notificationsMenuRef.current && 
        !notificationsMenuRef.current.contains(event.target) &&
        notificationsButtonRef.current &&
        !notificationsButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu, showNotifications])

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev)
    if (showNotifications) setShowNotifications(false)
  }
  
  // Toggle notifications menu
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev)
    if (showProfileMenu) setShowProfileMenu(false)
  }
  
  // Handle accepting a connection request
  const handleAcceptRequest = async (notification, e) => {
    e.stopPropagation()
    try {
      await acceptConnectionRequest(notification.id, notification.requestId)
    } catch (error) {
      console.error('Error accepting request:', error)
    }
  }
  
  // Handle declining a connection request
  const handleDeclineRequest = async (notification, e) => {
    e.stopPropagation()
    try {
      await declineConnectionRequest(notification.id, notification.requestId)
    } catch (error) {
      console.error('Error declining request:', error)
    }
  }
  
  // Handle viewing a project
  const handleViewProject = (projectId) => {
    setShowNotifications(false)
    navigate(`/projects/${projectId}`)
  }
  
  // Handle viewing a profile
  const handleViewProfile = (userId) => {
    setShowNotifications(false)
    navigate(`/profile/${userId}`)
  }
  
  // Mark notification as read on click
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id)
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }
  }
  
  const getIconForType = (type) => {
    switch (type) {
      case 'connection':
      case 'connection_accepted':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      case 'project':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
      case 'verification':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )
    }
  }
  
  const getColorForType = (type) => {
    switch (type) {
      case 'connection': 
      case 'connection_accepted': 
        return 'bg-indigo-100 text-indigo-600'
      case 'project': 
        return 'bg-purple-100 text-purple-600'
      case 'verification': 
        return 'bg-green-100 text-green-600'
      default: 
        return 'bg-gray-100 text-gray-600'
    }
  }
  
  // Get notification actions based on type
  const getNotificationActions = (notification) => {
    switch (notification.type) {
      case 'connection':
        return [
          { 
            label: 'Accept', 
            primary: true, 
            action: (e) => handleAcceptRequest(notification, e) 
          },
          { 
            label: 'Decline', 
            primary: false, 
            action: (e) => handleDeclineRequest(notification, e) 
          }
        ]
      case 'project':
        return [
          { 
            label: 'View', 
            primary: true, 
            action: () => handleViewProject(notification.projectId) 
          }
        ]
      case 'connection_accepted':
        return [
          { 
            label: 'View Profile', 
            primary: true, 
            action: () => handleViewProfile(notification.fromId) 
          }
        ]
      default:
        return []
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  return (
    <nav className={`${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-indigo-700'} fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Only show the sidebar toggle button for authenticated users */}
            {isAuthenticated && (
              <button 
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-md hover:bg-indigo-800 text-white transition-colors duration-200"
                aria-label="Toggle sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <Link to="/" className="flex items-center">
              {/* Updated logo design */}
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-2 flex flex-col">
                {/* Updated font style */}
                <span className={`font-bold text-lg tracking-wider ${scrolled ? 'text-indigo-700' : 'text-white'} transition-colors duration-300`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                  SkillSync
                </span>
                {/* Added "by BitLinguals" subscript */}
                <span className={`text-[10px] -mt-1 italic ${scrolled ? 'text-indigo-500' : 'text-indigo-200'} transition-colors duration-300`}>
                  by BitLinguals
                </span>
              </div>
            </Link>
          </div>
          
          {/* Only show navigation links for authenticated users */}
          {isAuthenticated && (
            <div className={`hidden md:flex items-center space-x-6 ${scrolled ? 'text-gray-700' : 'text-white'} transition-colors duration-300`}>
              <Link to="/explore" className="hover:text-indigo-400 transition-colors duration-200">Explore</Link>
              <Link to="/projects" className="hover:text-indigo-400 transition-colors duration-200">Projects</Link>
              <Link to="/mentorship" className="hover:text-indigo-400 transition-colors duration-200">Mentorship</Link>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button 
                    ref={notificationsButtonRef}
                    className={`p-2 rounded-md ${scrolled ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-indigo-800 text-white'} transition-all duration-200`}
                    onClick={toggleNotifications}
                    aria-label="Notifications"
                    aria-expanded={showNotifications}
                    aria-haspopup="true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div 
                      ref={notificationsMenuRef}
                      className="absolute right-0 mt-2 w-96 bg-gray-50 rounded-lg shadow-xl border overflow-hidden z-50 animate-slideDown"
                    >
                      <div className="px-4 py-3 border-b bg-gray-100">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                      </div>
                      
                      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
                        {notificationsLoading ? (
                          <div className="flex justify-center items-center p-8">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-indigo-500 border-r-transparent"></div>
                            <span className="ml-2 text-gray-600">Loading...</span>
                          </div>
                        ) : notificationsError ? (
                          <div className="p-4 text-center">
                            <p className="text-sm text-gray-700">Error loading notifications</p>
                            <p className="text-xs text-gray-500 mt-1">Please try again later</p>
                            <div className="mt-3">
                              <Link 
                                to="/notifications" 
                                onClick={toggleNotifications}
                                className="text-xs text-indigo-600 hover:underline"
                              >
                                View all notifications
                              </Link>
                            </div>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="mt-2 text-gray-600">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.slice(0, 3).map(notification => {
                            const actions = getNotificationActions(notification);
                            
                            return (
                              <div 
                                key={notification.id} 
                                className="p-4 border-b hover:bg-white transition-colors duration-200 cursor-pointer flex items-start"
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <div className={`h-10 w-10 rounded-full ${getColorForType(notification.type)} flex-shrink-0 flex items-center justify-center mr-3`}>
                                  {getIconForType(notification.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                    {!notification.isRead && (
                                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">New</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                                  <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-400">{notification.time}</p>
                                    {actions.length > 0 && (
                                      <div className="flex space-x-1">
                                        {actions.map((action, i) => (
                                          <button 
                                            key={i}
                                            onClick={action.action}
                                            className={`text-xs ${action.primary 
                                              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            } px-2 py-1 rounded transition-colors`}
                                          >
                                            {action.label}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      
                      <Link to="/notifications" onClick={toggleNotifications} className="block py-3 px-4 text-center border-t text-indigo-600 hover:bg-indigo-50 transition-colors">
                        View All Notifications
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button
                    ref={profileButtonRef}
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-1 focus:outline-none"
                    aria-expanded={showProfileMenu}
                    aria-haspopup="true"
                  >
                    <div className={`h-8 w-8 rounded-full ${scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500 text-white'} flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out ${showProfileMenu ? 'ring-2 ring-indigo-300' : ''}`}>
                      {userProfile?.profileImage ? (
                        <img 
                          src={userProfile.profileImage} 
                          alt={userProfile.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-bold">
                          {currentUser?.displayName 
                            ? `${currentUser.displayName.charAt(0).toUpperCase()}${
                                currentUser.displayName.split(' ')[1] 
                                  ? currentUser.displayName.split(' ')[1].charAt(0).toUpperCase() 
                                  : ''
                              }`
                            : 'U'
                          }
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {showProfileMenu && (
                    <div 
                      ref={profileMenuRef}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn border border-gray-200"
                    >
                      <div className="p-3 border-b">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {userProfile?.name || currentUser?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Your Profile
                        </Link>
                        <Link 
                          to="/profile/settings" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          Settings
                        </Link>
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                    scrolled 
                    ? 'text-indigo-600 hover:bg-indigo-50' 
                    : 'text-white hover:bg-indigo-800'
                  } transition-colors duration-200`}
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                    scrolled 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-white text-indigo-700 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar