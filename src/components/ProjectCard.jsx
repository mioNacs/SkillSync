import { Link } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-150 z-0"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">{project.title}</h3>
          <span className="text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {project.members} members
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {project.owner}
        </p>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {project.skills.map((skill, index) => (
            <span key={index} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded border border-indigo-100 group-hover:bg-indigo-100 transition-colors duration-300">
              {skill}
            </span>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Link 
            to={`/projects/${project.id}`} 
            className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors duration-200 flex items-center group/link"
          >
            View Details
            <svg className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <button className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow">
            Join Project
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard 