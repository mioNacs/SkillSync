import { Link } from 'react-router-dom'

const SkillCard = ({ skill }) => {
  return (
    <Link to={`/explore?skill=${skill.name}`} className="block">
      <div className="bg-white border rounded-md p-3 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-800">{skill.name}</h3>
            <p className="text-sm text-gray-500">{skill.category}</p>
          </div>
          <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
            {skill.popularity}%
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SkillCard 