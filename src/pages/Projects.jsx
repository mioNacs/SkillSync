import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProjects, useSearchProjects } from '../hooks/useProjects'
import { doc, updateDoc, addDoc, collection, arrayUnion, Timestamp, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAddProject, setShowAddProject] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState('')
  const navigate = useNavigate()
  
  // Form state for new project
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Education',
    skills: [],
    skillInput: '',
    lookingFor: [],
    roleInput: '',
    status: 'Planning'
  })
  
  const { currentUser, userProfile } = useAuth()
  
  // Fetch projects from Firestore using the custom hook
  const { projects, loading } = useProjects(null, 20)
  
  // Always call useSearchProjects - don't use it conditionally
  const { projects: searchResults, loading: searchLoading } = useSearchProjects(searchQuery)
  
  // Determine which projects to display
  const projectsToDisplay = searchQuery ? searchResults : projects
  
  useEffect(() => {
    setIsLoading(loading || searchLoading)
  }, [loading, searchLoading])
  
  const categories = ['Education', 'Career', 'Mentorship', 'Research', 'Technology', 'Other']
  const statuses = ['Planning', 'Active', 'Completed']
  
  // Filter projects based on category or status
  const filteredProjects = projectsToDisplay.filter(project => {
    if (filter === 'all') return true
    
    return (
      project.category?.toLowerCase() === filter.toLowerCase() ||
      project.status?.toLowerCase() === filter.toLowerCase()
    )
  })
  
  // Handle adding a skill to the new project
  const handleAddSkill = () => {
    if (newProject.skillInput.trim() && !newProject.skills.includes(newProject.skillInput.trim())) {
      setNewProject({
        ...newProject,
        skills: [...newProject.skills, newProject.skillInput.trim()],
        skillInput: ''
      })
    }
  }
  
  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    setNewProject({
      ...newProject,
      skills: newProject.skills.filter(skill => skill !== skillToRemove)
    })
  }
  
  // Handle adding a role to the new project
  const handleAddRole = () => {
    if (newProject.roleInput.trim() && !newProject.lookingFor.includes(newProject.roleInput.trim())) {
      setNewProject({
        ...newProject,
        lookingFor: [...newProject.lookingFor, newProject.roleInput.trim()],
        roleInput: ''
      })
    }
  }
  
  // Handle removing a role
  const handleRemoveRole = (roleToRemove) => {
    setNewProject({
      ...newProject,
      lookingFor: newProject.lookingFor.filter(role => role !== roleToRemove)
    })
  }
  
  // Handle creating a new project
  const handleCreateProject = async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    try {
      setIsLoading(true)
      
      // Format project data for submission
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        technologies: newProject.skills,
        lookingFor: newProject.lookingFor,
        status: newProject.status,
        creatorId: currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        members: [currentUser.uid],
        teamSize: 1
      }
      
      // Add the project to Firestore
      const docRef = await addDoc(collection(db, 'projects'), projectData)
      
      // If the user doesn't have a projects array, create one
      if (!userProfile.projects) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          projects: [docRef.id]
        })
      } else {
        // Add project ID to user's projects array
        await updateDoc(doc(db, 'users', currentUser.uid), {
          projects: arrayUnion(docRef.id)
        })
      }
      
      // Reset form and show success message
      setNewProject({
        title: '',
        description: '',
        category: 'Education',
        skills: [],
        skillInput: '',
        lookingFor: [],
        roleInput: '',
        status: 'Planning'
      })
      
      setShowAddProject(false)
      setShowSuccessMessage('Project created successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage('')
      }, 3000)
      
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle joining a project
  const handleJoinProject = async (projectId) => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    try {
      setIsLoading(true)
      
      // First get the project to find the owner/creator
      const projectRef = doc(db, 'projects', projectId)
      const projectSnap = await getDoc(projectRef)
      
      if (!projectSnap.exists()) {
        throw new Error('Project not found')
      }
      
      const projectData = projectSnap.data()
      const projectOwnerId = projectData.creatorId
      
      // Add user to project members array
      await updateDoc(projectRef, {
        members: arrayUnion(currentUser.uid),
        teamSize: projects.find(p => p.id === projectId)?.teamSize + 1 || 1
      })
      
      // Add project to user's projects array
      await updateDoc(doc(db, 'users', currentUser.uid), {
        projects: arrayUnion(projectId)
      })
      
      // Create notification for project owner if it's not the current user
      if (projectOwnerId && projectOwnerId !== currentUser.uid) {
        // Get user info
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          
          // Create the notification
          await addDoc(collection(db, 'notifications'), {
            userId: projectOwnerId,
            type: 'project',
            title: 'New project member',
            description: `${userData.name || 'Someone'} has joined your project "${projectData.name || projectData.title}"`,
            projectId,
            memberId: currentUser.uid,
            memberName: userData.name,
            memberProfileImage: userData.profileImage,
            projectTitle: projectData.name || projectData.title,
            isRead: false,
            createdAt: serverTimestamp()
          })
        }
      }
      
      setShowSuccessMessage('You have successfully joined the project!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage('')
      }, 3000)
      
    } catch (error) {
      console.error('Error joining project:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Check if user is already a member of a project
  const isProjectMember = (project) => {
    return project.members?.includes(currentUser?.uid)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button 
          onClick={() => setShowAddProject(true)} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Project
        </button>
      </div>
      
      {/* Success message */}
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex justify-between items-center">
          <span>{showSuccessMessage}</span>
          <button
            onClick={() => setShowSuccessMessage('')} 
            className="text-green-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Create Project Form Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Create New Project</h2>
                <button
                  onClick={() => setShowAddProject(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateProject}>
                <div className="space-y-4">
                  {/* Project Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title*
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter a clear title for your project"
                    />
                  </div>
                  
                  {/* Project Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description*
                    </label>
                    <textarea
                      required
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Describe your project, its goals, and what you hope to achieve"
                    ></textarea>
                  </div>
                  
                  {/* Project Category and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={newProject.status}
                        onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Technologies/Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies/Skills
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newProject.skillInput}
                        onChange={(e) => setNewProject({...newProject, skillInput: e.target.value})}
                        className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Add technologies or skills needed"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newProject.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1.5 text-indigo-600 hover:text-indigo-800"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Looking For */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Looking For (Roles Needed)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newProject.roleInput}
                        onChange={(e) => setNewProject({...newProject, roleInput: e.target.value})}
                        className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Add roles you're looking for"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                      />
                      <button
                        type="button"
                        onClick={handleAddRole}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newProject.lookingFor.map((role, index) => (
                        <span 
                          key={index}
                          className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                        >
                          {role}
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(role)}
                            className="ml-1.5 text-green-600 hover:text-green-800"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddProject(false)}
                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Create Project
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="search" 
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="Search for projects, skills, or keywords" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
              value={filter}
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>{category}</option>
              ))}
            </select>
            
            <select 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
              value={filter}
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status.toLowerCase()}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading projects...</span>
        </div>
      )}
      
      {/* Project Results */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">{project.title || project.name}</h2>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      project.status === 'Active' ? 'bg-green-100 text-green-800' :
                      project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status || 'Active'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">
                    by {project.creator?.name || 'Anonymous'} · {project.teamSize || project.members?.length || 1} member{(project.teamSize || project.members?.length || 1) !== 1 ? 's' : ''}
                  </p>
                  <p className="mt-3 text-gray-600 line-clamp-3">{project.description}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.technologies || project.skills || []).slice(0, 5).map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                    {(project.technologies || project.skills || []).length > 5 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                        +{(project.technologies || project.skills || []).length - 5} more
                      </span>
                    )}
                  </div>
                  
                  {(project.lookingFor || []).length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700">Looking for:</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(project.lookingFor || []).map((role, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <Link 
                      to={`/projects/${project.id}`}
                      className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                    >
                      View Details
                    </Link>
                    {project.status !== 'Completed' && (
                      isProjectMember(project) ? (
                        <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                          You're a Member
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleJoinProject(project.id)}
                          className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
                        >
                          Join Project
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-gray-500">
                {searchQuery || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Be the first to create a project and start collaborating!'}
              </p>
              {(searchQuery || filter !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setFilter('all')
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Projects 