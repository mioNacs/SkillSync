import { useState } from 'react'
import MentorCard from '../components/MentorCard'

const Mentorship = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [experienceFilter, setExperienceFilter] = useState('any')
  
  // Sample data - would come from API in real app
  const mentors = [
    { 
      id: 1, 
      name: 'Dr. Emily Chen', 
      title: 'Data Science Lead',
      bio: 'PhD in Machine Learning with 10+ years of industry experience helping students master AI concepts.',
      skills: ['AI', 'Python', 'Data Science', 'Machine Learning', 'Statistics'], 
      experience: '10+ years', 
      rating: 4.9,
      availability: 'Weekly',
      specialties: ['Career Guidance', 'Project Mentorship', 'Technical Skills']
    },
    { 
      id: 2, 
      name: 'Mark Johnson', 
      title: 'Senior Web Developer',
      bio: 'Full-stack developer specialized in modern web technologies and helping beginners get started in coding.',
      skills: ['Web Development', 'React', 'JavaScript', 'Node.js', 'CSS'], 
      experience: '8 years', 
      rating: 4.7,
      availability: 'Bi-weekly',
      specialties: ['Code Reviews', 'Project Mentorship', 'Interview Prep']
    },
    { 
      id: 3, 
      name: 'Sarah Williams', 
      title: 'UX Research Manager',
      bio: 'Passionate about teaching UX research methods and helping designers improve their user-centered design approach.',
      skills: ['UX Research', 'User Testing', 'Interaction Design', 'Prototyping'], 
      experience: '6 years', 
      rating: 4.8,
      availability: 'Monthly',
      specialties: ['Portfolio Reviews', 'Career Guidance', 'Project Feedback']
    },
    { 
      id: 4, 
      name: 'Dr. Robert Kim', 
      title: 'Professor of Computer Science',
      bio: 'University professor specializing in algorithms, data structures, and helping students master CS fundamentals.',
      skills: ['Algorithms', 'Data Structures', 'Python', 'C++', 'Teaching'], 
      experience: '15+ years', 
      rating: 4.9,
      availability: 'Weekly',
      specialties: ['Academic Guidance', 'Research Mentorship', 'Technical Skills']
    },
    { 
      id: 5, 
      name: 'Jessica Martinez', 
      title: 'Mobile App Developer',
      bio: 'Experienced mobile developer who enjoys mentoring beginners in app development and career growth.',
      skills: ['React Native', 'iOS', 'Android', 'Mobile UI', 'JavaScript'], 
      experience: '5 years', 
      rating: 4.6,
      availability: 'Weekly',
      specialties: ['Code Reviews', 'Project Mentorship', 'Portfolio Reviews']
    }
  ]
  
  const allSkills = [...new Set(mentors.flatMap(mentor => mentor.skills))]
  
  const experienceOptions = [
    { value: 'any', label: 'Any Experience' },
    { value: 'beginner', label: '1-3 years' },
    { value: 'intermediate', label: '4-7 years' },
    { value: 'advanced', label: '8+ years' },
    { value: 'expert', label: '10+ years' }
  ]
  
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }
  
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesSkills = selectedSkills.length === 0 || 
                          selectedSkills.every(skill => mentor.skills.includes(skill))
    
    const matchesExperience = experienceFilter === 'any' ||
                              (experienceFilter === 'beginner' && mentor.experience.includes('1') || mentor.experience.includes('2') || mentor.experience.includes('3')) ||
                              (experienceFilter === 'intermediate' && (mentor.experience.includes('4') || mentor.experience.includes('5') || mentor.experience.includes('6') || mentor.experience.includes('7'))) ||
                              (experienceFilter === 'advanced' && (mentor.experience.includes('8') || mentor.experience.includes('9'))) ||
                              (experienceFilter === 'expert' && mentor.experience.includes('10'))
    
    return matchesSearch && matchesSkills && matchesExperience
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Find a Mentor</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700">
          Become a Mentor
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-6">
              <label htmlFor="mentor-search" className="block mb-2 text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="search" 
                  id="mentor-search" 
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="Search mentors or skills" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Experience Level */}
            <div className="mb-6">
              <label htmlFor="experience-filter" className="block mb-2 text-sm font-medium text-gray-700">Experience Level</label>
              <select 
                id="experience-filter"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
              >
                {experienceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Skills */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Skills</label>
              <div className="max-h-60 overflow-y-auto p-1 space-y-1">
                {allSkills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      id={`skill-${index}`}
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                    />
                    <label htmlFor={`skill-${index}`} className="ml-2 text-sm font-medium text-gray-900">
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedSkills.length > 0 && (
              <div className="mt-4">
                <button 
                  onClick={() => setSelectedSkills([])}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mentors List */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {filteredMentors.length > 0 ? (
              filteredMentors.map(mentor => (
                <div key={mentor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-800">{mentor.name}</h2>
                            <p className="text-gray-600">{mentor.title}</p>
                          </div>
                          
                          <div className="flex mt-2 sm:mt-0">
                            {Array(5).fill(0).map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-gray-600">{mentor.rating}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-sm text-gray-600">
                            <strong>Experience:</strong> {mentor.experience}
                          </span>
                          <span className="text-sm text-gray-600">
                            <strong>Availability:</strong> {mentor.availability}
                          </span>
                        </div>
                        
                        <p className="mt-3 text-gray-700">{mentor.bio}</p>
                        
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Skills:</h3>
                          <div className="flex flex-wrap gap-2">
                            {mentor.skills.map((skill, index) => (
                              <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h3>
                          <div className="flex flex-wrap gap-2">
                            {mentor.specialties.map((specialty, index) => (
                              <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 text-sm">
                            Request Mentorship
                          </button>
                          <button className="text-indigo-600 font-medium text-sm hover:text-indigo-800">
                            View Full Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center bg-white rounded-lg shadow-md p-8">
                <p className="text-gray-500 mb-4">No mentors found matching your search criteria.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedSkills([])
                    setExperienceFilter('any')
                  }}
                  className="text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mentorship 