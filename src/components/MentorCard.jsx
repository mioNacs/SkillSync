import { Link } from 'react-router-dom'
import { useState } from 'react'

const MentorCard = ({ mentor }) => {
  const [isHovered, setIsHovered] = useState(false)
  const stars = Array(5).fill(0).map((_, i) => i < Math.floor(mentor.rating))

  return (
    <div 
      className="bg-white border border-gray-100 rounded-lg p-5 hover:shadow-md transition-all duration-300 group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements */}
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500 transform group-hover:scale-150 z-0"></div>
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="relative">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg transform transition-transform duration-300 group-hover:scale-110 shadow-md">
            {mentor.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-400 h-4 w-4 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">{mentor.name}</h3>
              <p className="text-sm text-gray-500">{mentor.experience}</p>
            </div>
            <div className="flex">
              {stars.map((star, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${star ? 'text-yellow-400' : 'text-gray-300'} ${isHovered && i === stars.filter(Boolean).length ? 'animate-ping' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-600">{mentor.rating}</span>
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            {mentor.skills.map((skill, index) => (
              <span key={index} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded border border-indigo-100 group-hover:bg-indigo-100 transition-colors duration-300">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Link 
              to={`/mentorship/${mentor.id}`} 
              className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors duration-200 flex items-center group/link"
            >
              View Profile
              <svg className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <button className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Request Mentorship
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorCard 