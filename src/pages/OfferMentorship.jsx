import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const OfferMentorship = () => {
  const [searchParams] = useSearchParams()
  const talentId = searchParams.get('talentId')
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  
  const [talent, setTalent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    message: '',
    availability: [],
    topics: [],
    duration: '3 months'
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)

  // Sample availability options
  const availabilityOptions = [
    { value: 'weekday-mornings', label: 'Weekday Mornings' },
    { value: 'weekday-evenings', label: 'Weekday Evenings' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'flexible', label: 'Flexible' }
  ]

  // Duration options
  const durationOptions = [
    '1 month',
    '3 months',
    '6 months',
    'Ongoing'
  ]

  // Fetch talent data (would come from API in real app)
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      if (talentId) {
        // Sample talent data - would come from API in real app
        setTalent({
          id: talentId,
          name: 'Alex Johnson',
          title: 'Frontend Developer',
          skills: ['React', 'TypeScript', 'CSS', 'UI Design'],
          bio: 'Passionate frontend developer with 3 years of experience building modern web applications.',
          location: 'Seattle, WA',
          profileImage: 'https://i.pravatar.cc/150?img=1',
          learningGoals: [
            'Master advanced React patterns',
            'Learn Node.js for full-stack development',
            'Improve UI design skills'
          ]
        })
      }
      setLoading(false)
    }, 500)
  }, [talentId])

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      })
    }
  }

  // Handle checkbox change
  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target
    
    if (checked) {
      setForm({
        ...form,
        [field]: [...form[field], value]
      })
    } else {
      setForm({
        ...form,
        [field]: form[field].filter(item => item !== value)
      })
    }
    
    // Clear error when field is edited
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: null
      })
    }
  }

  // Handle topic input
  const handleTopicChange = (e) => {
    const value = e.target.value.trim()
    if (value && e.key === 'Enter') {
      e.preventDefault()
      if (!form.topics.includes(value)) {
        setForm({
          ...form,
          topics: [...form.topics, value]
        })
      }
      e.target.value = ''
      
      // Clear error when field is edited
      if (formErrors.topics) {
        setFormErrors({
          ...formErrors,
          topics: null
        })
      }
    }
  }

  // Remove topic
  const removeTopic = (topic) => {
    setForm({
      ...form,
      topics: form.topics.filter(t => t !== topic)
    })
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!form.message.trim()) {
      errors.message = 'Please enter a personalized message'
    }
    
    if (form.availability.length === 0) {
      errors.availability = 'Please select at least one availability option'
    }
    
    if (form.topics.length === 0) {
      errors.topics = 'Please enter at least one mentorship topic'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitStatus('submitting')
    
    // Simulating API call
    setTimeout(() => {
      console.log('Mentorship offer submitted:', {
        mentorId: userProfile.uid,
        mentorName: userProfile.name,
        talentId: talent.id,
        talentName: talent.name,
        ...form
      })
      
      setSubmitStatus('success')
      
      // Redirect after success
      setTimeout(() => {
        navigate('/mentorship')
      }, 2000)
    }, 1000)
  }

  // Handle cancel
  const handleCancel = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-slate-200 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-36 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-24"></div>
          <div className="mt-8 w-full max-w-md">
            <div className="h-6 bg-slate-200 rounded mb-4"></div>
            <div className="h-24 bg-slate-200 rounded mb-4"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-800">Talent not found. Please select a talent from the talents directory.</p>
          <button 
            onClick={() => navigate('/talents')}
            className="mt-2 text-indigo-600 font-medium hover:text-indigo-800"
          >
            Browse Talents →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Offer Mentorship</h1>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <svg className="w-12 h-12 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-green-800">Mentorship Offer Sent!</h2>
          </div>
          <p className="text-green-700">
            Your mentorship offer has been sent to {talent.name}. 
            They will be notified and can choose to accept your offer.
            We'll let you know when they respond!
          </p>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/mentorship')}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              View My Mentorships
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-5">
              <div className="flex items-start">
                <img 
                  src={talent.profileImage} 
                  alt={talent.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{talent.name}</h2>
                  <p className="text-sm text-gray-600">{talent.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{talent.location}</p>
                  
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Learning Goals:</h3>
                    <ul className="pl-5 list-disc text-sm text-gray-600">
                      {talent.learningGoals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-5 py-4 bg-indigo-50">
              <h2 className="text-lg font-semibold text-indigo-800">Craft Your Mentorship Offer</h2>
              <p className="text-sm text-indigo-700">Tailor your offer to match {talent.name}'s goals and experience level</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personalized Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 text-gray-700 border ${
                    formErrors.message ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder={`Introduce yourself to ${talent.name} and explain why you'd like to mentor them...`}
                  rows={5}
                ></textarea>
                {formErrors.message && <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Availability
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availabilityOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.value}
                        value={option.value}
                        checked={form.availability.includes(option.value)}
                        onChange={(e) => handleCheckboxChange(e, 'availability')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={option.value} className="ml-2 block text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {formErrors.availability && <p className="mt-1 text-sm text-red-600">{formErrors.availability}</p>}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mentorship Topics (press Enter to add)
                </label>
                <div className={`flex flex-wrap p-2 gap-2 border ${
                  formErrors.topics ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500`}>
                  {form.topics.map((topic, index) => (
                    <div key={index} className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-md flex items-center">
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    onKeyDown={handleTopicChange}
                    placeholder="Type topic and press Enter..."
                    className="flex-grow outline-none text-sm p-1"
                  />
                </div>
                {formErrors.topics && <p className="mt-1 text-sm text-red-600">{formErrors.topics}</p>}
                <p className="mt-1 text-xs text-gray-500">Focus on topics that align with {talent.name}'s learning goals</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mentorship Duration
                </label>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {durationOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 ${
                    submitStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitStatus === 'submitting' ? 'Sending...' : 'Send Mentorship Offer'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default OfferMentorship