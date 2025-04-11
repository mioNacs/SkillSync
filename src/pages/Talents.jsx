import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Talents = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all-talents')
  const [filterSkill, setFilterSkill] = useState('')
  const { userProfile } = useAuth()
  
  // Sample talents data - would come from API in real app
  const talents = [
    {
      id: 1,
      name: 'Alex Johnson',
      title: 'Frontend Developer',
      skills: ['React', 'TypeScript', 'CSS', 'UI Design'],
      bio: 'Passionate frontend developer with 3 years of experience building modern web applications.',
      location: 'Seattle, WA',
      availability: 'Full-time',
      openToRemote: true,
      profileImage: 'https://i.pravatar.cc/150?img=1',
      projects: 8,
      endorsements: 12
    },
    {
      id: 2,
      name: 'Sarah Chen',
      title: 'Full Stack Engineer',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      bio: 'Full stack developer specializing in MERN stack and microservices architecture.',
      location: 'San Francisco, CA',
      availability: 'Contract',
      openToRemote: true,
      profileImage: 'https://i.pravatar.cc/150?img=2',
      projects: 15,
      endorsements: 24
    },
    {
      id: 3,
      name: 'Miguel Rodriguez',
      title: 'Machine Learning Engineer',
      skills: ['Python', 'TensorFlow', 'Data Science', 'AI'],
      bio: 'AI specialist with experience in computer vision and natural language processing.',
      location: 'New York, NY',
      availability: 'Full-time',
      openToRemote: false,
      profileImage: 'https://i.pravatar.cc/150?img=3',
      projects: 6,
      endorsements: 18
    },
    {
      id: 4,
      name: 'Priya Patel',
      title: 'UX/UI Designer',
      skills: ['UI Design', 'User Research', 'Figma', 'Design Systems'],
      bio: 'Creative designer focused on crafting beautiful and intuitive user experiences.',
      location: 'Remote',
      availability: 'Freelance',
      openToRemote: true,
      profileImage: 'https://i.pravatar.cc/150?img=4',
      projects: 22,
      endorsements: 31
    },
    {
      id: 5,
      name: 'David Kim',
      title: 'DevOps Engineer',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      bio: 'Cloud infrastructure specialist with expertise in containerization and deployment automation.',
      location: 'Austin, TX',
      availability: 'Full-time',
      openToRemote: true,
      profileImage: 'https://i.pravatar.cc/150?img=5',
      projects: 11,
      endorsements: 16
    },
    {
      id: 6,
      name: 'Emma Wilson',
      title: 'Mobile Developer',
      skills: ['React Native', 'iOS', 'Android', 'Swift'],
      bio: 'Cross-platform mobile developer building beautiful native-quality apps.',
      location: 'Chicago, IL',
      availability: 'Part-time',
      openToRemote: true,
      profileImage: 'https://i.pravatar.cc/150?img=6',
      projects: 9,
      endorsements: 14
    }
  ]

  // Sample top skills for filtering
  const topSkills = [
    'React', 'JavaScript', 'Python', 'UI Design', 'Node.js', 
    'Data Science', 'AWS', 'React Native', 'Machine Learning'
  ]

  // Sample recommended connections based on user profile
  const recommendedTalents = [
    {
      id: 7,
      name: 'Thomas Wright',
      title: 'Senior React Developer',
      skills: ['React', 'Redux', 'GraphQL', 'TypeScript'],
      bio: 'Experienced frontend developer specializing in complex state management and performance optimization.',
      location: 'Remote',
      matchReason: 'Similar skills and interests',
      profileImage: 'https://i.pravatar.cc/150?img=7',
      matchScore: 92,
      commonSkills: ['React', 'JavaScript']
    },
    {
      id: 8,
      name: 'Jennifer Lee',
      title: 'UX Researcher',
      skills: ['User Testing', 'UI Design', 'Prototyping', 'Design Systems'],
      bio: 'UX researcher with background in psychology and focus on creating accessible interfaces.',
      location: 'Portland, OR',
      matchReason: 'Complementary skills',
      profileImage: 'https://i.pravatar.cc/150?img=8',
      matchScore: 85,
      commonSkills: ['UI Design']
    },
    {
      id: 9,
      name: 'Marcus Jones',
      title: 'Backend Developer',
      skills: ['Node.js', 'Express', 'MongoDB', 'AWS'],
      bio: 'Backend specialist building scalable APIs and microservices.',
      location: 'Denver, CO',
      matchReason: 'Project interests overlap',
      profileImage: 'https://i.pravatar.cc/150?img=9',
      matchScore: 78,
      commonSkills: ['Node.js']
    }
  ]

  // Sample connected talents (would come from user profile data in real app)
  const connectedTalents = [
    {
      id: 10,
      name: 'Olivia Garcia',
      title: 'Product Designer',
      skills: ['UX Design', 'Wireframing', 'Figma', 'User Research'],
      bio: 'Product designer focusing on creating delightful user experiences with an analytical approach.',
      location: 'Miami, FL',
      connectedDate: '2025-03-15',
      profileImage: 'https://i.pravatar.cc/150?img=10',
      lastActive: '2 days ago'
    },
    {
      id: 11,
      name: 'Jordan Smith',
      title: 'Fullstack Developer',
      skills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL'],
      bio: 'Full-stack engineer building web applications with modern technologies.',
      location: 'Boston, MA',
      connectedDate: '2025-03-22',
      profileImage: 'https://i.pravatar.cc/150?img=11',
      lastActive: '5 days ago'
    }
  ]
  
  // Filter talents based on search query and skill filter
  const filteredTalents = talents.filter(talent => {
    const matchesSearch = searchQuery === '' || 
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.skills.some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
    const matchesSkillFilter = filterSkill === '' || 
      talent.skills.some(skill => skill === filterSkill)
      
    return matchesSearch && matchesSkillFilter
  })

  // Get user role from profile
  const userRole = userProfile?.role || 'member'
  const isMentor = userRole === 'mentor'
  const isRecruiter = userRole === 'recruiter'
  
  // Action button text based on role
  const getActionButtonText = () => {
    if (isMentor) return 'Offer Mentorship'
    if (isRecruiter) return 'Contact for Hiring'
    return 'Connect'
  }
  
  // Action button url based on role
  const getActionButtonUrl = (talentId) => {
    if (isMentor) return `/offer-mentorship?talentId=${talentId}`
    if (isRecruiter) return `/contact-talents?talentId=${talentId}`
    return `/connect-talents?talentId=${talentId}`
  }

  return (
    <div>
      <div className="bg-indigo-700 text-white rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Talent Directory</h1>
        <p className="mb-4 text-indigo-100">Discover skilled professionals to collaborate with, learn from, and hire</p>
        
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            className="block w-full p-3 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Search by name, skills, or role" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Skills filter chips */}
      <div className="mb-6 overflow-x-auto scrollbar-thin">
        <div className="flex space-x-2 pb-2">
          <button
            onClick={() => setFilterSkill('')}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              filterSkill === '' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Skills
          </button>
          
          {topSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => setFilterSkill(skill)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filterSkill === skill 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all-talents')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'all-talents'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Talents
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'recommended'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setActiveTab('connected')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'connected'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Network
            </button>
          </nav>
        </div>
      </div>
      
      {/* All Talents Tab */}
      {activeTab === 'all-talents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map(talent => (
            <div key={talent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex flex-col items-center text-center mb-4">
                  <img 
                    src={talent.profileImage} 
                    alt={talent.name} 
                    className="w-20 h-20 rounded-full object-cover mb-2"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">{talent.name}</h2>
                  <p className="text-sm text-gray-600">{talent.title}</p>
                  
                  <div className="flex items-center mt-1">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">{talent.location}</span>
                    {talent.openToRemote && <span className="ml-1 text-xs text-indigo-600">(Remote OK)</span>}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 text-center mb-4">{talent.bio}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">{talent.availability}</span>
                  <div className="flex space-x-3">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{talent.projects}</p>
                      <p className="text-xs text-gray-500">Projects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{talent.endorsements}</p>
                      <p className="text-xs text-gray-500">Endorsements</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {talent.skills.map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    to={`/talents/${talent.id}`}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                  >
                    View Profile
                  </Link>
                  <Link 
                    to={getActionButtonUrl(talent.id)}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    {getActionButtonText()}
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTalents.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No talents found matching your search criteria.</p>
              {(searchQuery || filterSkill) && (
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setFilterSkill('')
                  }}
                  className="mt-2 text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Recommended Tab */}
      {activeTab === 'recommended' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedTalents.map(talent => (
            <div key={talent.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-500">
              <div className="p-5">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="relative">
                    <img 
                      src={talent.profileImage} 
                      alt={talent.name} 
                      className="w-20 h-20 rounded-full object-cover mb-2"
                    />
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">{talent.name}</h2>
                  <p className="text-sm text-gray-600">{talent.title}</p>
                  
                  <div className="flex items-center mt-1">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">{talent.location}</span>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">{talent.matchReason}</span>
                    <span className="font-medium text-green-800">{talent.matchScore}% match</span>
                  </div>
                  {talent.commonSkills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-green-800">Common skills: {talent.commonSkills.join(', ')}</p>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 text-center mb-4">{talent.bio}</p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {talent.skills.map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    to={`/talents/${talent.id}`}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                  >
                    View Profile
                  </Link>
                  <Link 
                    to={getActionButtonUrl(talent.id)}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    {getActionButtonText()}
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {recommendedTalents.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800">Complete your profile to get personalized talent recommendations!</p>
                <Link to="/profile" className="mt-2 inline-block text-indigo-600 font-medium hover:text-indigo-800">
                  Update Profile →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Connected Tab */}
      {activeTab === 'connected' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectedTalents.map(talent => (
            <div key={talent.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="relative">
                    <img 
                      src={talent.profileImage} 
                      alt={talent.name} 
                      className="w-20 h-20 rounded-full object-cover mb-2"
                    />
                    <div className={`absolute bottom-2 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      talent.lastActive.includes('day') ? 'bg-gray-400' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">{talent.name}</h2>
                  <p className="text-sm text-gray-600">{talent.title}</p>
                  
                  <div className="flex items-center mt-1">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">{talent.location}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 text-center mb-4">{talent.bio}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-gray-500">Connected since {new Date(talent.connectedDate).toLocaleDateString()}</span>
                  <span className="text-xs text-gray-500">Last active: {talent.lastActive}</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {talent.skills.map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    to={`/talents/${talent.id}`}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                  >
                    View Profile
                  </Link>
                  <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700">
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {connectedTalents.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">You haven't connected with any talents yet.</p>
                <button 
                  onClick={() => setActiveTab('all-talents')}
                  className="mt-2 text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Browse Talents →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Talents