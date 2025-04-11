import { useState } from 'react'

const Notifications = () => {
  const [filter, setFilter] = useState('all')
  
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'mentor',
      title: 'New mentor request',
      description: 'Sarah Williams wants to connect with you',
      time: '10 minutes ago',
      isNew: true,
      actions: [
        { label: 'Accept', primary: true },
        { label: 'Decline', primary: false }
      ]
    },
    {
      id: 2,
      type: 'project',
      title: 'Project invitation',
      description: 'You\'ve been invited to join "AI Learning Platform"',
      time: '1 hour ago',
      isNew: true,
      actions: [
        { label: 'View', primary: true }
      ]
    },
    {
      id: 3,
      type: 'verification',
      title: 'Profile verification complete',
      description: 'Your profile has been verified and is now visible to mentors',
      time: '2 hours ago',
      isNew: false,
      actions: []
    },
    {
      id: 4,
      type: 'skill',
      title: 'Skill endorsed',
      description: 'Mike Johnson endorsed your React skills',
      time: '1 day ago',
      isNew: false,
      actions: [
        { label: 'View Profile', primary: true }
      ]
    },
    {
      id: 5,
      type: 'message',
      title: 'New message',
      description: 'You received a new message from Emily Chen',
      time: '2 days ago',
      isNew: false,
      actions: [
        { label: 'Reply', primary: true }
      ]
    },
    {
      id: 6,
      type: 'project',
      title: 'Project update',
      description: 'Virtual Reality Classroom project has been updated',
      time: '3 days ago',
      isNew: false,
      actions: [
        { label: 'View', primary: true }
      ]
    }
  ]
  
  const getIconForType = (type) => {
    switch (type) {
      case 'mentor':
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
      case 'skill':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      case 'message':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
      case 'mentor': return 'bg-indigo-100 text-indigo-600'
      case 'project': return 'bg-purple-100 text-purple-600'
      case 'verification': return 'bg-green-100 text-green-600'
      case 'skill': return 'bg-blue-100 text-blue-600'
      case 'message': return 'bg-yellow-100 text-yellow-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter)
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your connections, projects, and mentorship opportunities.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="border-b">
          <div className="flex overflow-x-auto scrollbar-thin px-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('mentor')} 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${filter === 'mentor' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Mentors
            </button>
            <button 
              onClick={() => setFilter('project')} 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${filter === 'project' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setFilter('skill')} 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${filter === 'skill' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Skills
            </button>
            <button 
              onClick={() => setFilter('message')} 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${filter === 'message' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Messages
            </button>
          </div>
        </div>
        
        <div className="divide-y">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <p className="text-gray-500">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors duration-200 flex items-start">
                <div className={`h-10 w-10 rounded-full ${getColorForType(notification.type)} flex-shrink-0 flex items-center justify-center mr-3`}>
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                    {notification.isNew && (
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">{notification.time}</p>
                    {notification.actions.length > 0 && (
                      <div className="flex space-x-1">
                        {notification.actions.map((action, i) => (
                          <button 
                            key={i}
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
            ))
          )}
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <p>You're all caught up! Check back later for more updates.</p>
      </div>
    </div>
  )
}

export default Notifications 