import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('open-roles')
  const { userProfile } = useAuth()
  
  // Sample job data - would come from API in real app
  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechSolutions Inc.',
      location: 'San Francisco, CA (Remote)',
      skillsRequired: ['React', 'JavaScript', 'HTML/CSS', 'Redux'],
      description: 'We are looking for a skilled Frontend Developer to join our team and help build beautiful, responsive web applications.',
      salary: '$90,000 - $120,000',
      postedDate: '2025-04-08',
      applicants: 24,
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'InnovateSoft',
      location: 'New York, NY',
      skillsRequired: ['React', 'Node.js', 'MongoDB', 'Express'],
      description: 'Seeking a talented Full Stack Engineer to design and develop high-quality web applications using the MERN stack.',
      salary: '$100,000 - $140,000',
      postedDate: '2025-04-10',
      applicants: 18,
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 3,
      title: 'Machine Learning Engineer',
      company: 'AI Innovations',
      location: 'Remote',
      skillsRequired: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'],
      description: 'Join our AI team to develop cutting-edge machine learning models for real-world applications.',
      salary: '$110,000 - $150,000',
      postedDate: '2025-04-05',
      applicants: 31,
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'DesignCraft Studios',
      location: 'Austin, TX (Hybrid)',
      skillsRequired: ['Figma', 'UI Design', 'User Research', 'Prototyping'],
      description: 'Looking for a creative UI/UX Designer to create beautiful and intuitive user interfaces for our clients.',
      salary: '$85,000 - $115,000',
      postedDate: '2025-04-11',
      applicants: 16,
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'CloudFlow Systems',
      location: 'Seattle, WA',
      skillsRequired: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      description: 'Join our DevOps team to build and maintain scalable cloud infrastructure and deployment pipelines.',
      salary: '$95,000 - $135,000',
      postedDate: '2025-04-07',
      applicants: 22,
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 6,
      title: 'Mobile App Developer',
      company: 'MobileFirst Tech',
      location: 'Chicago, IL (Remote)',
      skillsRequired: ['React Native', 'JavaScript', 'iOS', 'Android'],
      description: 'We need a talented Mobile Developer to create cross-platform mobile applications using React Native.',
      salary: '$90,000 - $130,000',
      postedDate: '2025-04-09',
      applicants: 19,
      logo: 'https://via.placeholder.com/50'
    }
  ]

  // Sample recommended jobs based on user skills
  const recommendedJobs = [
    {
      id: 7,
      title: 'React Developer',
      company: 'WebApp Solutions',
      location: 'Boston, MA (Flexible)',
      skillMatch: 92,
      matchedSkills: ['React', 'JavaScript', 'Redux'],
      description: 'Perfect opportunity for a React developer looking to work on cutting-edge web applications.',
      salary: '$95,000 - $125,000',
      postedDate: '2025-04-11',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 8,
      title: 'Frontend Engineer',
      company: 'Creative Digital',
      location: 'Remote',
      skillMatch: 87,
      matchedSkills: ['JavaScript', 'HTML/CSS', 'UI Design'],
      description: 'Join our team to develop beautiful and responsive web interfaces for our clients.',
      salary: '$85,000 - $115,000',
      postedDate: '2025-04-10',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 9,
      title: 'Web Developer',
      company: 'TechStart Inc.',
      location: 'Denver, CO',
      skillMatch: 85,
      matchedSkills: ['JavaScript', 'HTML/CSS', 'React'],
      description: 'Looking for a Web Developer to join our growing team and help build modern web applications.',
      salary: '$80,000 - $110,000',
      postedDate: '2025-04-08',
      logo: 'https://via.placeholder.com/50'
    }
  ]
  
  // Sample applied jobs (would come from user profile data in real app)
  const appliedJobs = [
    {
      id: 10,
      title: 'Senior Frontend Developer',
      company: 'UX Masters',
      location: 'San Francisco, CA (Remote)',
      appliedDate: '2025-04-01',
      status: 'Interview Scheduled',
      nextStep: 'Technical Interview on April 15, 2025',
      logo: 'https://via.placeholder.com/50'
    },
    {
      id: 11,
      title: 'Full Stack JavaScript Developer',
      company: 'CodeWorks',
      location: 'Remote',
      appliedDate: '2025-03-28',
      status: 'Application Under Review',
      nextStep: 'Waiting for hiring manager review',
      logo: 'https://via.placeholder.com/50'
    }
  ]
  
  // Filter jobs based on search query
  const filteredJobs = searchQuery 
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skillsRequired.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) 
    : jobs
  
  // Calculate days ago for job posting
  const getDaysAgo = (dateString) => {
    const posted = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today - posted)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div>
      <div className="bg-indigo-700 text-white rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Job Opportunities</h1>
        <p className="mb-4 text-indigo-100">Find roles that match your skills and career goals</p>
        
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            className="block w-full p-3 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Search for jobs, skills, or companies" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('open-roles')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'open-roles'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Open Roles
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'recommended'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recommended for You
            </button>
            <button
              onClick={() => setActiveTab('applied')}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'applied'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applied Jobs
            </button>
          </nav>
        </div>
      </div>
      
      {/* Open Roles Tab */}
      {activeTab === 'open-roles' && (
        <div className="space-y-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-md" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {getDaysAgo(job.postedDate)} days ago
                      </span>
                    </div>
                    
                    <p className="mt-3 text-gray-600">{job.description}</p>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.map((skill, index) => (
                          <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-5 flex justify-between items-center">
                      <span className="text-gray-600">
                        <span className="font-medium text-gray-900">{job.salary}</span> 
                        <span className="mx-2">•</span> 
                        <span className="text-sm">{job.applicants} applicants</span>
                      </span>
                      <div className="flex space-x-3">
                        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                          Save
                        </button>
                        <Link 
                          to={`/jobs/${job.id}`}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No jobs found matching your search criteria.</p>
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
      
      {/* Recommended Tab */}
      {activeTab === 'recommended' && (
        <div className="space-y-6">
          {recommendedJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-500">
              <div className="p-5">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-md" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                          <span className="ml-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            {job.skillMatch}% Match
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {getDaysAgo(job.postedDate)} days ago
                      </span>
                    </div>
                    
                    <p className="mt-3 text-gray-600">{job.description}</p>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Matched Skills:</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.matchedSkills.map((skill, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-5 flex justify-between items-center">
                      <span className="font-medium text-gray-900">{job.salary}</span>
                      <div className="flex space-x-3">
                        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                          Save
                        </button>
                        <Link 
                          to={`/jobs/${job.id}`}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {recommendedJobs.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800">Add more skills to your profile to receive job recommendations!</p>
                <Link to="/profile/skills" className="mt-2 inline-block text-indigo-600 font-medium hover:text-indigo-800">
                  Update Skills →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Applied Jobs Tab */}
      {activeTab === 'applied' && (
        <div className="space-y-6">
          {appliedJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-md" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded 
                          ${job.status === 'Interview Scheduled' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {job.status}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">Applied {getDaysAgo(job.appliedDate)} days ago</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700">Next Steps:</h3>
                      <p className="text-sm text-gray-600 mt-1">{job.nextStep}</p>
                    </div>
                    
                    <div className="mt-5 flex justify-end space-x-3">
                      <Link 
                        to={`/jobs/applications/${job.id}`}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                      >
                        View Application
                      </Link>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                        Prepare for Interview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {appliedJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't applied to any jobs yet.</p>
              <button 
                onClick={() => setActiveTab('open-roles')}
                className="mt-2 text-indigo-600 font-medium hover:text-indigo-800"
              >
                Browse Open Roles
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Jobs