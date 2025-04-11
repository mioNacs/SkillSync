import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  
  // Sample data - would come from API in real app
  const projects = [
    { 
      id: 1, 
      title: 'AI Learning Platform', 
      description: 'A platform that uses AI to personalize learning experiences for students.',
      skills: ['React', 'Node.js', 'Machine Learning', 'MongoDB'], 
      owner: 'Jane Doe', 
      members: 5,
      category: 'Education',
      status: 'Active',
      looking: ['Frontend Developer', 'ML Engineer']
    },
    { 
      id: 2, 
      title: 'Virtual Reality Classroom', 
      description: 'An immersive VR environment for remote learning and collaboration.',
      skills: ['Unity', 'C#', '3D Modeling', 'VR Development'], 
      owner: 'John Smith', 
      members: 3,
      category: 'Education',
      status: 'Active',
      looking: ['3D Artist', 'VR Developer']
    },
    { 
      id: 3, 
      title: 'Skill Assessment Tool', 
      description: 'A tool to analyze skills and suggest learning paths based on career goals.',
      skills: ['Python', 'Data Analysis', 'Machine Learning', 'React'], 
      owner: 'Alex Johnson', 
      members: 4,
      category: 'Career',
      status: 'Planning',
      looking: ['Data Scientist', 'Backend Developer']
    },
    { 
      id: 4, 
      title: 'Peer Mentorship App', 
      description: 'An app connecting students with peer mentors for learning support.',
      skills: ['React Native', 'Firebase', 'Node.js'], 
      owner: 'Sarah Williams', 
      members: 4,
      category: 'Mentorship',
      status: 'Active',
      looking: ['Mobile Developer', 'UX Designer']
    },
    { 
      id: 5, 
      title: 'Interactive Study Materials', 
      description: 'Interactive, gamified study materials for various subjects.',
      skills: ['JavaScript', 'HTML/CSS', 'Game Design'], 
      owner: 'Michael Brown', 
      members: 2,
      category: 'Education',
      status: 'Completed',
      looking: []
    }
  ]
  
  const categories = ['All', 'Education', 'Career', 'Mentorship', 'Research', 'Technology']
  const statuses = ['All', 'Active', 'Planning', 'Completed']
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filter === 'all' || project.category.toLowerCase() === filter.toLowerCase() ||
                          project.status.toLowerCase() === filter.toLowerCase()
    
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700">
          Create Project
        </button>
      </div>
      
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
              {categories.map((category, index) => (
                <option key={index} value={category.toLowerCase()}>{category}</option>
              ))}
            </select>
            
            <select 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
              value={filter}
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
            >
              <option value="all">All Statuses</option>
              {statuses.map((status, index) => (
                <option key={index} value={status.toLowerCase()}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Project Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{project.title}</h2>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    project.status === 'Active' ? 'bg-green-100 text-green-800' :
                    project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mt-1">by {project.owner} · {project.members} members</p>
                <p className="mt-3 text-gray-600">{project.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
                
                {project.looking.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700">Looking for:</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.looking.map((role, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex justify-between">
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                    View Details
                  </button>
                  {project.status !== 'Completed' && (
                    <button className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
                      Join Project
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-500">No projects found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects 