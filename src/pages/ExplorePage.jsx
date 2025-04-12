import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsers, useSearchUsers } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';

const ExplorePage = () => {
  // Get current user for comparison
  const { currentUser } = useAuth();
  
  // State management
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch users based on role and search query - call hooks unconditionally
  const { users: searchResults, loading: searchLoading, error: searchError } = useSearchUsers(
    searchQuery, 
    selectedRole !== 'all' ? selectedRole : null
  );
      
  const { users: allUsers, loading: usersLoading, error: usersError } = useUsers(
    selectedRole !== 'all' ? selectedRole : null
  );
    
  // Determine which users to display
  const filteredUsers = searchQuery ? searchResults : allUsers;
  const isLoading = searchQuery ? searchLoading : usersLoading;
  const error = searchQuery ? searchError : usersError;

  // Function to get role badge color
  const getRoleBadgeColor = (role) => {
    switch((role || 'member')?.toLowerCase()) {
      case 'mentor': return 'bg-purple-100 text-purple-800';
      case 'learner': return 'bg-blue-100 text-blue-800';
      case 'recruiter': return 'bg-green-100 text-green-800';
      case 'member': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to check if a mentor is available
  const isAvailable = (user) => {
    return user.role?.toLowerCase() === 'mentor' && user.available === true;
  };

  // Normalize the role for display
  const normalizeRole = (role) => {
    if (!role) return 'Member';
    
    // Handle the case where role might be null or undefined
    const normalizedRole = role.toLowerCase();
    
    // Map 'member' to 'learner' for profile viewing
    if (normalizedRole === 'member') return 'Learner';
    
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Explore Community</h1>
        <p className="mb-4">Connect with mentors, learners, and recruiters in the SkillSync community</p>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="block w-full p-3 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500" 
              placeholder="Search by name, bio, or skills" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="bg-white text-gray-800 font-medium rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block p-3"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="mentor">Mentors</option>
            <option value="learner">Learners</option>
            <option value="member">Members</option>
            <option value="recruiter">Recruiters</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-10 bg-red-50 rounded-xl">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && (
        <>
          <div className="mb-4">
            <h2 className="font-medium text-gray-700">
              {filteredUsers.length} {selectedRole === 'all' ? 'users' : selectedRole + 's'} found
            </h2>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <div key={user.id} className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 border ${isAvailable(user) ? 'border-green-300' : 'border-gray-200'}`}>
                  {/* Available Indicator */}
                  {isAvailable(user) && (
                    <div className="bg-green-500 text-white text-xs font-bold text-center py-1">
                      Available for Mentoring
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.name || 'User'} 
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-800 font-medium text-xl">
                              {(user.name?.charAt(0) || 'U').toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {user.name || 'Anonymous User'}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {user.title || 'SkillSync Member'}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {normalizeRole(user.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {user.bio || 'No bio provided.'}
                    </p>
                    
                    {user.skills && user.skills.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.slice(0, 5).map((skill, index) => (
                            <span 
                              key={index} 
                              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded"
                            >
                              {typeof skill === 'object' ? skill.name : skill}
                            </span>
                          ))}
                          {user.skills.length > 5 && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                              +{user.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-5 flex justify-end">
                      <Link 
                        to={`/profile/${user.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
                      >
                        {currentUser && currentUser.uid === user.id ? 'Edit Profile' : 'View Profile'}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              <div className="mt-6">
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('all');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExplorePage;