import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SkillCard from '../components/SkillCard'
import ProjectCard from '../components/ProjectCard'
import MentorCard from '../components/MentorCard'
import Dashboard from '../components/Dashboard'
import { useProjects } from '../hooks/useProjects'
import { useUsers } from '../hooks/useUsers'
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase'

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { isAuthenticated, userProfile } = useAuth()
  
  // Stats state variables
  const [activeProjects, setActiveProjects] = useState(0)
  const [registeredMentors, setRegisteredMentors] = useState(0)
  const [skillsTracked, setSkillsTracked] = useState(0)
  const [collaborations, setCollaborations] = useState(0)
  const [statsLoading, setStatsLoading] = useState(true)
  
  // Fetch recommended projects - limiting to 2 recent projects
  const { projects: allProjects, loading: projectsLoading } = useProjects(null, 2)
  
  // Fetch mentors - limiting to 2 mentors
  const { users: mentors, loading: mentorsLoading } = useUsers('mentor', 2)
  
  // Get user skills for potentially filtering recommended content
  const userSkills = userProfile?.skills || []
  
  // Fetch actual stats from Firestore
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count active projects
        const projectsQuery = query(collection(db, 'projects'));
        const projectsSnapshot = await getCountFromServer(projectsQuery);
        setActiveProjects(projectsSnapshot.data().count);
        
        // Count registered mentors
        const mentorsQuery = query(collection(db, 'users'), where('role', '==', 'mentor'));
        const mentorsSnapshot = await getCountFromServer(mentorsQuery);
        setRegisteredMentors(mentorsSnapshot.data().count);
        
        // Count skills - aggregate unique skills from all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const uniqueSkills = new Set();
        
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.skills && Array.isArray(userData.skills)) {
            userData.skills.forEach(skill => {
              if (typeof skill === 'string') {
                uniqueSkills.add(skill);
              } else if (skill && skill.name) {
                uniqueSkills.add(skill.name);
              }
            });
          }
        });
        
        setSkillsTracked(uniqueSkills.size);
        
        // Count collaborations - this could be based on connections, accepted projects, etc.
        const collaborationsQuery = query(
          collection(db, 'requests'), 
          where('status', '==', 'accepted')
        );
        const collaborationsSnapshot = await getCountFromServer(collaborationsQuery);
        setCollaborations(collaborationsSnapshot.data().count);
        
        setStatsLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStatsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  useEffect(() => {
    // Set loaded when data is ready or after 1 second to prevent blank screen
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    if (!projectsLoading && !mentorsLoading && !statsLoading) {
      setIsLoaded(true)
      clearTimeout(timer)
    }
    return () => clearTimeout(timer)
  }, [projectsLoading, mentorsLoading, statsLoading])
  
  // If user is not authenticated, render the guest Dashboard
  if (!isAuthenticated) {
    return <Dashboard />
  }
  
  // Transform projects data for ProjectCard component
  const recommendedProjects = allProjects.map(project => ({
    id: project.id,
    title: project.name || project.title,
    skills: project.technologies || [],
    owner: project.creator?.name || 'Anonymous',
    members: project.teamSize || project.collaborators?.length || 1
  }))
  
  // Transform mentors data for MentorCard component
  const recommendedMentors = mentors.map(mentor => ({
    id: mentor.id,
    name: mentor.name,
    skills: mentor.skills?.map(skill => typeof skill === 'string' ? skill : skill.name).slice(0, 3) || [],
    experience: mentor.yearsOfExperience ? `${mentor.yearsOfExperience}+ years` : 'Experienced',
    rating: mentor.rating || 4.5,
    profileImage: mentor.profileImage
  }))
  
  // Static trending skills - in a real app, you might fetch this from analytics data
  const trendingSkills = [
    { id: 1, name: 'React', category: 'Frontend', popularity: 95 },
    { id: 2, name: 'Machine Learning', category: 'AI', popularity: 92 },
    { id: 3, name: 'Node.js', category: 'Backend', popularity: 89 },
    { id: 4, name: 'Docker', category: 'DevOps', popularity: 87 },
  ]

  // Use the real stats from Firestore
  const stats = [
    { label: 'Active Projects', value: statsLoading ? '...' : activeProjects.toLocaleString() },
    { label: 'Registered Mentors', value: statsLoading ? '...' : registeredMentors.toLocaleString() },
    { label: 'Skills Tracked', value: statsLoading ? '...' : (skillsTracked > 0 ? skillsTracked.toLocaleString() + '+' : '0') },
    { label: 'Successful Collaborations', value: statsLoading ? '...' : collaborations.toLocaleString() },
  ]

  // Render user profile panels based on actual data
  const hasSkills = userSkills.length > 0
  const hasProjects = userProfile?.projects?.length > 0
  const hasMentors = userProfile?.mentors?.length > 0

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
                Explore Community
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
            {hasSkills ? (
              <div className="flex flex-wrap gap-2">
                {userSkills.slice(0, 5).map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
                {userSkills.length > 5 && (
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                    +{userSkills.length - 5} more
                  </span>
                )}
              </div>
            ) : (
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
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Projects</h2>
              <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">View All</Link>
            </div>
            {hasProjects ? (
              <div className="space-y-2">
                {userProfile.projects.slice(0, 2).map((project, index) => (
                  <div key={index} className="border p-3 rounded-lg">
                    <h3 className="font-medium">{project.name || project.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{project.description}</p>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Mentors</h2>
              <Link to="/mentorship" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">View All</Link>
            </div>
            {hasMentors ? (
              <div className="space-y-2">
                {userProfile.mentors.slice(0, 2).map((mentorId, index) => (
                  <Link key={index} to={`/profile/${mentorId}`} className="block border p-3 rounded-lg hover:border-indigo-300">
                    <h3 className="font-medium">View Mentor Profile</h3>
                  </Link>
                ))}
              </div>
            ) : (
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
            )}
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
            {projectsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : recommendedProjects.length > 0 ? (
              <div className="space-y-4">
                {recommendedProjects.map((project, index) => (
                  <div key={project.id} className={`transform transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 text-gray-500">No projects available yet</p>
              </div>
            )}
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
            {mentorsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : recommendedMentors.length > 0 ? (
              <div className="space-y-4">
                {recommendedMentors.map((mentor, index) => (
                  <div key={mentor.id} className={`transform transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 150 + 300}ms` }}>
                    <MentorCard mentor={mentor} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="mt-2 text-gray-500">No mentors available yet</p>
              </div>
            )}
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
              <Link to="/explore" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">Explore Community</Link>
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