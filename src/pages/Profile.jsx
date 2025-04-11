import { useState } from 'react'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('skills')
  
  // Sample user data - would come from API/context in real app
  const user = {
    name: 'John Smith',
    title: 'Frontend Developer',
    bio: 'Passionate web developer with 5 years of experience building modern applications.',
    location: 'San Francisco, CA',
    email: 'john.smith@example.com',
    website: 'https://johnsmith.dev',
    skills: [
      { name: 'React', level: 'Expert', years: 4 },
      { name: 'JavaScript', level: 'Expert', years: 5 },
      { name: 'TypeScript', level: 'Intermediate', years: 2 },
      { name: 'Node.js', level: 'Intermediate', years: 3 },
      { name: 'HTML/CSS', level: 'Expert', years: 5 },
      { name: 'TailwindCSS', level: 'Expert', years: 3 },
    ],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'Tech Innovations Inc.',
        duration: '2020 - Present',
        description: 'Lead frontend development for multiple web applications using React and TypeScript.'
      },
      {
        title: 'Frontend Developer',
        company: 'WebSolutions Ltd.',
        duration: '2018 - 2020',
        description: 'Developed responsive web interfaces using modern JavaScript frameworks.'
      }
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'University of Technology',
        year: '2018'
      }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'A full-featured online store with payment processing and inventory management.',
        technologies: ['React', 'Node.js', 'MongoDB'],
        role: 'Frontend Developer'
      },
      {
        name: 'Task Management App',
        description: 'A collaborative project management tool with real-time updates.',
        technologies: ['React', 'Firebase', 'TailwindCSS'],
        role: 'Lead Developer'
      }
    ]
  }

  const tabs = [
    { id: 'skills', label: 'Skills & Expertise' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
  ]
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="h-32 w-32 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 text-4xl font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-lg text-gray-600">{user.title}</p>
                <p className="mt-2 text-gray-600">{user.bio}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.location}
                  </span>
                  
                  <span className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.email}
                  </span>
                  
                  {user.website && (
                    <span className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {user.website}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700">
                  Edit Profile
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50">
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'skills' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Skills & Expertise</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add New Skill</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.skills.map((skill, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{skill.name}</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{skill.years} years experience</p>
                  
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-indigo-600 rounded-full" 
                      style={{ 
                        width: skill.level === 'Expert' ? '90%' : 
                               skill.level === 'Advanced' ? '75%' : 
                               skill.level === 'Intermediate' ? '60%' : '40%' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'experience' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Experience</button>
            </div>
            
            <div className="space-y-6">
              {user.experience.map((exp, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{exp.title}</h3>
                    <span className="text-sm text-gray-500">{exp.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{exp.company}</p>
                  <p className="mt-2 text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Project</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Role: {project.role}</p>
                  <p className="mt-2 text-sm text-gray-700">{project.description}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'education' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Education</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add Education</button>
            </div>
            
            <div className="space-y-6">
              {user.education.map((edu, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                  <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                  <p className="text-sm text-gray-500 mt-1">Graduated: {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile 