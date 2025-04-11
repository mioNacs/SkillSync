import { Link } from 'react-router-dom'

const MentorCard = ({ mentor }) => {
  const stars = Array(5).fill(0).map((_, i) => i < Math.floor(mentor.rating))

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
          {mentor.name.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-medium text-gray-800">{mentor.name}</h3>
            <div className="flex">
              {stars.map((star, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${star ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-600">{mentor.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">{mentor.experience}</p>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {mentor.skills.map((skill, index) => (
              <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="mt-3 flex justify-between">
            <Link to={`/mentorship/${mentor.id}`} className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              View Profile
            </Link>
            <button className="bg-indigo-600 text-white text-sm px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
              Request Mentorship
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorCard 