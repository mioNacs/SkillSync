import { Link } from 'react-router-dom'
import SkillCard from '../components/SkillCard'
import ProjectCard from '../components/ProjectCard'
import MentorCard from '../components/MentorCard'

const Home = () => {
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="bg-indigo-600 rounded-lg p-6 mb-8 text-white">
        <h2 className="text-xl font-semibold mb-2">Welcome to SkillSync!</h2>
        <p className="mb-4">Connect with collaborators, join projects, and find mentors based on your skills and interests.</p>
        <div className="flex space-x-4">
          <Link to="/profile" className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors">Complete Your Profile</Link>
          <Link to="/explore" className="bg-indigo-500 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-400 transition-colors">Explore Skills</Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Skills</h2>
            <Link to="/profile" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500">Add your skills to get personalized recommendations.</p>
            <Link to="/profile" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors">Add Skills</Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Projects</h2>
            <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500">You haven't joined any projects yet.</p>
            <Link to="/projects" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors">Find Projects</Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Mentors</h2>
            <Link to="/mentorship" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500">Connect with mentors to accelerate your learning.</p>
            <Link to="/mentorship" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors">Find Mentors</Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recommended Projects</h2>
              <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
            </div>
            <div className="space-y-4">
              {recommendedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recommended Mentors</h2>
              <Link to="/mentorship" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
            </div>
            <div className="space-y-4">
              {recommendedMentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Trending Skills</h2>
              <Link to="/explore" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
            </div>
            <div className="space-y-3">
              {trendingSkills.map(skill => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 