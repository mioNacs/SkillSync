import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ConnectTalents = () => {
  const [searchParams] = useSearchParams()
  const talentId = searchParams.get('talentId')
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  
  const [talent, setTalent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    message: '',
    interests: [],
    questionForTalent: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)

  // Sample connection interests
  const connectionInterests = [
    { value: 'collaboration', label: 'Project Collaboration' },
    { value: 'learning', label: 'Learning & Knowledge Sharing' },
    { value: 'networking', label: 'Professional Networking' },
    { value: 'career', label: 'Career Advice' }
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
          projects: [
            {
              name: 'E-commerce Dashboard',
              description: 'React-based admin dashboard for online retailers'
            }
          ],
          openToCollaboration: true,
          profileImage: 'https://i.pravatar.cc/150?img=1',
          commonConnections: 2
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

  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!form.message.trim()) {
      errors.message = 'Please enter a personalized message'
    }
    
    if (form.interests.length === 0) {
      errors.interests = 'Please select at least one connection interest'
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
      console.log('Connection request submitted:', {
        senderId: userProfile.uid,
        senderName: userProfile.name,
        talentId: talent.id,
        talentName: talent.name,
        ...form
      })
      
      setSubmitStatus('success')
      
      // Redirect after success
      setTimeout(() => {
        navigate('/talents')
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
      <h1 className="text-2xl font-bold mb-6">Connect with {talent.name}</h1>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <svg className="w-12 h-12 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-green-800">Connection Request Sent!</h2>
          </div>
          <p className="text-green-700">
            Your connection request has been sent to {talent.name}. 
            They will be notified and can choose to accept your request.
            We'll let you know when they respond!
          </p>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/talents')}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Browse More Talents
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
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{talent.name}</h2>
                      <p className="text-sm text-gray-600">{talent.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{talent.location}</p>
                    </div>
                    {talent.commonConnections > 0 && (
                      <div className="bg-indigo-50 px-3 py-1 rounded-lg flex items-center">
                        <svg className="w-4 h-4 text-indigo-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="text-sm text-indigo-800">
                          {talent.commonConnections} {talent.commonConnections === 1 ? 'mutual connection' : 'mutual connections'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3">{talent.bio}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {talent.skills.map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  {talent.projects && talent.projects.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Featured Project:</h3>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">{talent.projects[0].name}</p>
                        <p className="text-xs text-gray-600">{talent.projects[0].description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-5 py-4 bg-indigo-50">
              <h2 className="text-lg font-semibold text-indigo-800">Send Connection Request</h2>
              <p className="text-sm text-indigo-700">Build your professional network and discover collaboration opportunities</p>
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
                  placeholder={`Introduce yourself to ${talent.name} and explain why you'd like to connect...`}
                  rows={4}
                ></textarea>
                {formErrors.message && <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Personalized messages are more likely to receive a positive response.
                  Be specific about why you're interested in connecting with {talent.name}.
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Interests
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {connectionInterests.map((interest) => (
                    <div key={interest.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={interest.value}
                        value={interest.value}
                        checked={form.interests.includes(interest.value)}
                        onChange={(e) => handleCheckboxChange(e, 'interests')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={interest.value} className="ml-2 block text-sm text-gray-700">
                        {interest.label}
                      </label>
                    </div>
                  ))}
                </div>
                {formErrors.interests && <p className="mt-1 text-sm text-red-600">{formErrors.interests}</p>}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question for {talent.name} (Optional)
                </label>
                <textarea
                  name="questionForTalent"
                  value={form.questionForTalent}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ask a specific question to start a meaningful conversation..."
                  rows={2}
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Questions can help spark an engaging conversation when {talent.name} accepts your request.
                </p>
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
                  {submitStatus === 'submitting' ? 'Sending...' : 'Send Connection Request'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default ConnectTalents