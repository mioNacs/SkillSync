import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SkillCard from '../components/SkillCard'
import ProjectCard from '../components/ProjectCard'
import MentorCard from '../components/MentorCard'

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  // Sample data - would come from API in real app
  const recommendedProjects = [
    { id: 1, title: 'AI Learning Platform', skills: ['React', 'Node.js', 'Machine Learning'], owner: 'Jane Doe', members: 5 },
    { id: 2, title: 'Virtual Reality Classroom', skills: ['Unity', 'C#', '3D Modeling'], owner: 'John Smith', members: 3 },
  ]
  
  const recommendedMentors = [
    { id: 1, name: 'Dr. Emily Chen', skills: ['AI', 'Python', 'Data Science'], experience: '10+ years', rating: 4.9 },
    { id: 2, name: 'Mark Johnson', skills: ['Web Development', 'React', 'JavaScript'], experience: '8 years', rating: 4.7 },
  ]
  
  const trendingSkills = [
    { id: 1, name: 'React', category: 'Frontend', popularity: 95 },
    { id: 2, name: 'Machine Learning', category: 'AI', popularity: 92 },
    { id: 3, name: 'Node.js', category: 'Backend', popularity: 89 },
    { id: 4, name: 'Docker', category: 'DevOps', popularity: 87 },
  ]

  const stats = [
    { label: 'Active Projects', value: '1,248' },
    { label: 'Registered Mentors', value: '483' },
    { label: 'Skills Tracked', value: '320+' },
    { label: 'Successful Collaborations', value: '2,589' },
  ]

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-12">
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl p-8 mb-8 text-white overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,white)]" aria-hidden="true"></div>
          
          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl font-bold mb-2">Welcome to SkillSync!</h1>
            <p className="text-lg text-indigo-100 mb-6">Connect with collaborators, join projects, and find mentors based on your skills and interests.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/profile" className="bg-white text-indigo-700 px-5 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Complete Your Profile
              </Link>
              <Link to="/explore" className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 border border-indigo-400 shadow-md hover:shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore Skills
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block absolute -right-10 -top-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="hidden lg:block absolute right-20 bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-2xl font-bold text-indigo-700">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Skills</h2>
              <Link to="/profile" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">View All</Link>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mb-4">Add your skills to get personalized recommendations.</p>
              <Link to="/profile" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Add Skills</Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Projects</h2>
              <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">View All</Link>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mb-4">You haven't joined any projects yet.</p>
              <Link to="/projects" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Find Projects</Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Mentors</h2>
              <Link to="/mentorship" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">View All</Link>
            </div>
            <div className="bg-gray-50 rounded-lg p-5 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mb-4">Connect with mentors to accelerate your learning.</p>
              <Link to="/mentorship" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Find Mentors</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-gray-800">Recommended Projects</h2>
              </div>
              <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">View All</Link>
            </div>
            <div className="space-y-4">
              {recommendedProjects.map((project, index) => (
                <div key={project.id} className={`transform transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-gray-800">Recommended Mentors</h2>
              </div>
              <Link to="/mentorship" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">View All</Link>
            </div>
            <div className="space-y-4">
              {recommendedMentors.map((mentor, index) => (
                <div key={mentor.id} className={`transform transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 150 + 300}ms` }}>
                  <MentorCard mentor={mentor} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                <h2 className="text-lg font-semibold text-gray-800">Trending Skills</h2>
              </div>
              <Link to="/explore" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">View All</Link>
            </div>
            <div className="space-y-3">
              {trendingSkills.map((skill, index) => (
                <div key={skill.id} className={`transform transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 150 + 600}ms` }}>
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-indigo-700 mb-2">Ready to showcase your skills?</h3>
              <p className="text-sm text-gray-600 mb-3">Create your profile and connect with like-minded collaborators.</p>
              <Link to="/profile" className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center">
                Complete Your Profile
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 