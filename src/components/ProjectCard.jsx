import { Link } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <h3 className="font-medium text-gray-800">{project.title}</h3>
        <span className="text-sm text-gray-500">{project.members} members</span>
      </div>
      <p className="text-sm text-gray-500 mt-1">by {project.owner}</p>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {project.skills.map((skill, index) => (
          <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between">
        <Link to={`/projects/${project.id}`} className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
          View Details
        </Link>
        <button className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
          Join Project
        </button>
      </div>
    </div>
  )
}

export default ProjectCard 