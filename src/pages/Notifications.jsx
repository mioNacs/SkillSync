import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useNotifications from '../hooks/useNotifications';
import { toast, Toaster } from 'react-hot-toast';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    acceptConnectionRequest, 
    declineConnectionRequest 
  } = useNotifications();
  
  // Add a read effect - when a notification page is viewed, mark older notifications as read
  useEffect(() => {
    const markOldNotificationsAsRead = async () => {
      if (notifications && notifications.length > 0) {
        // Mark notifications older than a day as read
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        for (const notification of notifications) {
          if (
            !notification.isRead && 
            notification.createdAt && 
            notification.createdAt.toDate && 
            notification.createdAt.toDate() < oneDayAgo
          ) {
            try {
              await markAsRead(notification.id);
            } catch (err) {
              console.error('Error marking notification as read:', err);
            }
          }
        }
      }
    };
    
    markOldNotificationsAsRead();
  }, [notifications, markAsRead]);
  
  // Handle accepting a connection request
  const handleAcceptRequest = async (notification) => {
    try {
      await acceptConnectionRequest(notification.id, notification.requestId);
      toast.success('Connection request accepted');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };
  
  // Handle declining a connection request
  const handleDeclineRequest = async (notification) => {
    try {
      await declineConnectionRequest(notification.id, notification.requestId);
      toast.success('Connection request declined');
    } catch (error) {
      console.error('Error declining request:', error);
      toast.error('Failed to decline request');
    }
  };
  
  // Handle viewing a project
  const handleViewProject = (projectId) => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };
  
  // Handle viewing a profile
  const handleViewProfile = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };
  
  // Mark notification as read when an action is taken
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };
  
  const getIconForType = (type) => {
    switch (type) {
      case 'connection':
      case 'connection_accepted':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'project':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'verification':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'skill':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'message':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };
  
  const getColorForType = (type) => {
    switch (type) {
      case 'connection': 
      case 'connection_accepted': 
        return 'bg-indigo-100 text-indigo-600';
      case 'project': 
        return 'bg-purple-100 text-purple-600';
      case 'verification': 
        return 'bg-green-100 text-green-600';
      case 'skill': 
        return 'bg-blue-100 text-blue-600';
      case 'message': 
        return 'bg-yellow-100 text-yellow-600';
      default: 
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Get notification actions based on type
  const getNotificationActions = (notification) => {
    switch (notification.type) {
      case 'connection':
        return [
          { 
            label: 'Accept', 
            primary: true, 
            action: () => handleAcceptRequest(notification) 
          },
          { 
            label: 'Decline', 
            primary: false, 
            action: () => handleDeclineRequest(notification) 
          }
        ];
      case 'project':
        return [
          { 
            label: 'View Project', 
            primary: true, 
            action: () => handleViewProject(notification.projectId) 
          }
        ];
      case 'connection_accepted':
        return [
          { 
            label: 'View Profile', 
            primary: true, 
            action: () => handleViewProfile(notification.fromId) 
          }
        ];
      default:
        return [];
    }
  };
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type.startsWith(filter));
  
  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-right" />
      
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
              onClick={() => setFilter('connection')} 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${filter === 'connection' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Connections
            </button>
            <button 
              onClick={() => setFilter('project')} 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${filter === 'project' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Projects
            </button>
          </div>
        </div>
        
        <div className="divide-y">
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500">Error loading notifications: {error}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <p className="text-gray-500">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const actions = getNotificationActions(notification);
              
              return (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors duration-200 flex items-start ${notification.isRead ? 'opacity-70' : ''}`}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                action.action();
                              }}
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
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <p>You're all caught up! Check back later for more updates.</p>
      </div>
    </div>
  );
};

export default Notifications; 