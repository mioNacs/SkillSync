import { useState } from 'react'
import { Link } from 'react-router-dom'

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('skills')
  
  // Sample data - would come from API in real app
  const skills = [
    { 
      id: 1, 
      name: 'React', 
      category: 'Frontend',
      description: 'A JavaScript library for building user interfaces',
      popularity: 95,
      learningResources: 12,
      projects: 156,
      mentors: 48,
      relatedSkills: ['JavaScript', 'Redux', 'React Router']
    },
    { 
      id: 2, 
      name: 'Machine Learning', 
      category: 'AI',
      description: 'The study of computer algorithms that improve automatically through experience',
      popularity: 92,
      learningResources: 34,
      projects: 127,
      mentors: 36,
      relatedSkills: ['Python', 'Data Science', 'TensorFlow']
    },
    { 
      id: 3, 
      name: 'Node.js', 
      category: 'Backend',
      description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
      popularity: 89,
      learningResources: 21,
      projects: 143,
      mentors: 39,
      relatedSkills: ['JavaScript', 'Express', 'MongoDB']
    },
    { 
      id: 4, 
      name: 'Python', 
      category: 'Programming Language',
      description: 'A programming language that lets you work quickly and integrate systems more effectively',
      popularity: 91,
      learningResources: 45,
      projects: 189,
      mentors: 54,
      relatedSkills: ['Django', 'Flask', 'Data Science']
    },
    { 
      id: 5, 
      name: 'UX Design', 
      category: 'Design',
      description: 'Process of creating products that provide meaningful and relevant experiences to users',
      popularity: 87,
      learningResources: 23,
      projects: 98,
      mentors: 31,
      relatedSkills: ['UI Design', 'User Research', 'Wireframing']
    },
    { 
      id: 6, 
      name: 'Docker', 
      category: 'DevOps',
      description: 'Platform for developing, shipping, and running applications in containers',
      popularity: 88,
      learningResources: 19,
      projects: 112,
      mentors: 28,
      relatedSkills: ['Kubernetes', 'CI/CD', 'Microservices']
    }
  ]
  
  const categories = [
    { name: 'Frontend', count: 32, color: 'blue' },
    { name: 'Backend', count: 28, color: 'green' },
    { name: 'AI', count: 24, color: 'purple' },
    { name: 'DevOps', count: 21, color: 'orange' },
    { name: 'Design', count: 19, color: 'pink' },
    { name: 'Mobile', count: 16, color: 'red' },
    { name: 'Data Science', count: 23, color: 'indigo' },
    { name: 'Cybersecurity', count: 18, color: 'gray' }
  ]
  
  const learningPaths = [
    { 
      id: 1, 
      title: 'Front-End Developer', 
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Redux', 'TypeScript'],
      duration: '6 months',
      difficulty: 'Intermediate',
      description: 'Master modern front-end development from HTML basics to advanced React applications'
    },
    { 
      id: 2, 
      title: 'Machine Learning Specialist', 
      skills: ['Python', 'Data Science', 'TensorFlow', 'Neural Networks', 'Statistics'],
      duration: '9 months',
      difficulty: 'Advanced',
      description: 'Learn the fundamentals of machine learning and how to build intelligent applications'
    },
    { 
      id: 3, 
      title: 'Full-Stack JavaScript Developer', 
      skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
      duration: '8 months',
      difficulty: 'Intermediate',
      description: 'Become proficient in both front-end and back-end development using JavaScript'
    }
  ]
  
  const filteredSkills = searchQuery ? 
    skills.filter(skill => 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) : skills
  
  const filteredLearningPaths = searchQuery ?
    learningPaths.filter(path => 
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) : learningPaths

  return (
    <div>
      <div className="bg-indigo-700 text-white rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Explore Skills & Learning Paths</h1>
        <p className="mb-4 text-indigo-100">Discover in-demand skills, find learning resources, and connect with collaborators</p>
        
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            className="block w-full p-3 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Search for skills, technologies, or learning paths" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('skills')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'skills'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'categories'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('learning-paths')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'learning-paths'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Learning Paths
            </button>
          </nav>
        </div>
      </div>
      
      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <div key={skill.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{skill.name}</h2>
                    <p className="text-sm text-gray-500">{skill.category}</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {skill.popularity}% popularity
                  </span>
                </div>
                
                <p className="mt-3 text-gray-600">{skill.description}</p>
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-lg font-semibold text-indigo-600">{skill.projects}</p>
                    <p className="text-xs text-gray-500">Projects</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-lg font-semibold text-indigo-600">{skill.mentors}</p>
                    <p className="text-xs text-gray-500">Mentors</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-lg font-semibold text-indigo-600">{skill.learningResources}</p>
                    <p className="text-xs text-gray-500">Resources</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Related Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.relatedSkills.map((related, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {related}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-5 flex justify-between">
                  <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700">
                    Add to Profile
                  </button>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                    Find Mentors
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredSkills.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No skills found matching your search criteria.</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`bg-white border-l-4 border-${category.color}-500 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow`}
            >
              <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
              <p className="mt-1 text-gray-500">{category.count} skills</p>
              
              <Link to={`/explore?category=${category.name}`} className="mt-4 inline-block text-indigo-600 text-sm font-medium hover:text-indigo-800">
                Explore {category.name} Skills →
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* Learning Paths Tab */}
      {activeTab === 'learning-paths' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredLearningPaths.map(path => (
            <div key={path.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-600 p-4 text-white">
                <h2 className="text-xl font-semibold">{path.title}</h2>
                <div className="flex justify-between mt-1 text-indigo-100 text-sm">
                  <span>{path.duration}</span>
                  <span>{path.difficulty}</span>
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-gray-600">{path.description}</p>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Skills Covered:</h3>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-5 flex justify-between">
                  <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700">
                    Start Learning Path
                  </button>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLearningPaths.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No learning paths found matching your search criteria.</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Explore 