import { Link } from 'react-router-dom'

const SkillCard = ({ skill }) => {
  return (
    <Link to={`/explore?skill=${skill.name}`} className="block">
      <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-2 -top-2 w-20 h-20 bg-indigo-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform group-hover:scale-150"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h3 className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">{skill.name}</h3>
            <p className="text-sm text-gray-500">{skill.category}</p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{skill.popularity}%</span>
            </div>
            <div className="text-gray-400 transform transition-transform duration-300 group-hover:translate-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Progress bar - only visible on hover */}
        <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out"
            style={{ width: `${skill.popularity}%` }}
          ></div>
        </div>
      </div>
    </Link>
  )
}

export default SkillCard 