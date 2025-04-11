import React from 'react';
import { Link } from 'react-router-dom';
import useRequests from '../../hooks/useRequests';

const ConnectionsList = () => {
  const { connections, loading, error } = useRequests();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
        <p>Error loading connections: {error}</p>
      </div>
    );
  }
  
  if (connections.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No connections yet</h3>
        <p className="mt-1 text-sm text-gray-500">Start connecting with mentors, learners, and recruiters to grow your network.</p>
      </div>
    );
  }
  
  // Group connections by role
  const groupedConnections = connections.reduce((groups, connection) => {
    const role = connection.connectedUser?.role || 'other';
    if (!groups[role]) {
      groups[role] = [];
    }
    groups[role].push(connection);
    return groups;
  }, {});
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedConnections).map(([role, connectionsList]) => (
        <div key={role} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800 capitalize">{role}s</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {connectionsList.map((connection) => (
              <Link 
                key={connection.id} 
                to={`/profile/${connection.connectedUser?.id}`}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
              >
                {connection.connectedUser?.profileImage ? (
                  <img
                    src={connection.connectedUser.profileImage}
                    alt={connection.connectedUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
                    {connection.connectedUser?.name ? connection.connectedUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{connection.connectedUser?.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{connection.connectedUser?.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectionsList;
