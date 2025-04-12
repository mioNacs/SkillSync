import { useState, useEffect } from 'react'
import MentorCard from '../components/MentorCard'
import { useUsers, useSearchUsers } from '../hooks/useUsers'
import { Link } from 'react-router-dom'

const Mentorship = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [experienceFilter, setExperienceFilter] = useState('any')
  const [allSkills, setAllSkills] = useState([])
  
  // Fetch mentors from Firestore using the useUsers hook
  const { users: mentorsFromSearch, loading: searchLoading, error: searchError } = 
    searchQuery ? useSearchUsers(searchQuery, 'mentor') : { users: [], loading: false, error: null }
  
  const { users: mentors, loading: mentorsLoading, error: mentorsError } = useUsers('mentor')
  
  // Determine which mentors to display based on search state
  const mentorsToDisplay = searchQuery ? mentorsFromSearch : mentors
  const isLoading = searchQuery ? searchLoading : mentorsLoading
  const error = searchQuery ? searchError : mentorsError
  
  // Extract all unique skills from mentors for the filter
  useEffect(() => {
    if (mentors && mentors.length > 0) {
      const skillsSet = new Set()
      
      mentors.forEach(mentor => {
        if (mentor.skills && Array.isArray(mentor.skills)) {
          mentor.skills.forEach(skill => {
            if (typeof skill === 'string') {
              skillsSet.add(skill)
            } else if (skill && skill.name) {
              skillsSet.add(skill.name)
            }
          })
        }
      })
      
      setAllSkills(Array.from(skillsSet).sort())
    }
  }, [mentors])
  
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
  
  // Helper function to normalize skills for comparison
  const normalizeSkill = (skill) => {
    if (typeof skill === 'string') return skill
    if (skill && skill.name) return skill.name
    return ''
  }
  
  // Helper function to ensure no objects are directly rendered
  const ensureSafeRendering = (data) => {
    // Check if it's null or undefined
    if (data == null) return '';
    
    // If it's a string or number, it's safe to render
    if (typeof data === 'string' || typeof data === 'number') return data;
    
    // If it's an array, map over each item and ensure it's safe
    if (Array.isArray(data)) {
      return data.map(item => ensureSafeRendering(item));
    }
    
    // If it's an object, we don't render it directly
    if (typeof data === 'object') {
      // For certain known object types, extract useful information
      if ('name' in data) return data.name;
      if ('title' in data) return data.title;
      if ('description' in data) return 'Has description';
      
      // Don't render generic objects
      return '';
    }
    
    // Default case
    return '';
  };
  
  // Filter mentors based on selected criteria
  const filteredMentors = mentorsToDisplay ? mentorsToDisplay.filter(mentor => {
    if (!mentor) return false;
    
    // Check if the mentor has the selected skills
    const hasSelectedSkills = selectedSkills.length === 0 || 
      selectedSkills.every(selectedSkill => 
        mentor.skills && Array.isArray(mentor.skills) && 
        mentor.skills.some(mentorSkill => 
          normalizeSkill(mentorSkill).toLowerCase() === selectedSkill.toLowerCase()
        )
      )
    
    // Check if the mentor meets the experience filter
    const yearsExp = mentor.yearsOfExperience || mentor.experience || '0'
    const yearsOfExp = typeof yearsExp === 'string' 
      ? parseInt(yearsExp.replace(/\D/g, ''), 10) || 0 
      : typeof yearsExp === 'number' ? yearsExp : 0
    
    const matchesExperience = 
      experienceFilter === 'any' ||
      (experienceFilter === 'beginner' && yearsOfExp >= 1 && yearsOfExp <= 3) ||
      (experienceFilter === 'intermediate' && yearsOfExp >= 4 && yearsOfExp <= 7) ||
      (experienceFilter === 'advanced' && yearsOfExp >= 8 && yearsOfExp <= 9) ||
      (experienceFilter === 'expert' && yearsOfExp >= 10)
    
    return hasSelectedSkills && matchesExperience
  }) : []

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
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading mentors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-red-500 mb-4">Error loading mentors: {error}</p>
              {error && error.includes("index") && (
                <div className="mt-4">
                  <p className="text-gray-700 mb-2">This query requires a Firestore index.</p>
                  <a 
                    href="https://console.firebase.google.com/project/skillsync-e6540/firestore/indexes" 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 inline-block"
                  >
                    Create Index in Firebase Console
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMentors.length > 0 ? (
                filteredMentors.map(mentor => (
                  <div key={mentor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl overflow-hidden">
                          {mentor.profileImage ? (
                            <img src={mentor.profileImage} alt={mentor.name} className="h-full w-full object-cover" />
                          ) : (
                            mentor.name ? mentor.name.split(' ').map(n => n[0]).join('') : 'M'
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <div>
                              <h2 className="text-xl font-semibold text-gray-800">{typeof mentor.name === 'string' ? mentor.name : 'Mentor'}</h2>
                              <p className="text-gray-600">{typeof mentor.title === 'string' ? mentor.title : ''}</p>
                            </div>
                            
                            <div className="flex mt-2 sm:mt-0">
                              {/* Rating - if available */}
                              {mentor.rating && typeof mentor.rating === 'number' && (
                                <>
                                  {Array(5).fill(0).map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                  <span className="ml-1 text-gray-600">{mentor.rating}</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="text-sm text-gray-600">
                              <strong>Experience:</strong> {
                                (() => {
                                  // Handle the case where experience is an object
                                  if (typeof mentor.experience === 'object' && mentor.experience !== null) {
                                    // Don't render the object directly
                                    return 'Professional experience available on profile';
                                  }
                                  
                                  // Normal case: experience is a string or number
                                  return (mentor.yearsOfExperience || mentor.experience || 'Not specified');
                                })()
                              }
                              {mentor.yearsOfExperience && typeof mentor.yearsOfExperience === 'number' && mentor.yearsOfExperience !== 1 ? ' years' : mentor.yearsOfExperience === 1 ? ' year' : ''}
                            </span>
                            {mentor.availability && typeof mentor.availability === 'string' && (
                              <span className="text-sm text-gray-600">
                                <strong>Availability:</strong> {mentor.availability}
                              </span>
                            )}
                          </div>
                          
                          <p className="mt-3 text-gray-700">{typeof mentor.bio === 'string' ? mentor.bio : ''}</p>
                          
                          {mentor.skills && Array.isArray(mentor.skills) && mentor.skills.length > 0 && (
                            <div className="mt-4">
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Skills:</h3>
                              <div className="flex flex-wrap gap-2">
                                {mentor.skills.map((skill, index) => (
                                  <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {typeof skill === 'string' ? skill : (skill && skill.name) ? skill.name : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {mentor.specialties && Array.isArray(mentor.specialties) && mentor.specialties.length > 0 && (
                            <div className="mt-4">
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h3>
                              <div className="flex flex-wrap gap-2">
                                {mentor.specialties.map((specialty, index) => (
                                  <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {typeof specialty === 'string' ? specialty : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 text-sm">
                              Request Mentorship
                            </button>
                            <Link to={`/profile/${mentor.id}`} className="text-indigo-600 font-medium text-sm hover:text-indigo-800">
                              View Full Profile
                            </Link>
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
          )}
        </div>
      </div>
    </div>
  )
}

export default Mentorship 