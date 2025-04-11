import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ContactTalents = () => {
  const [searchParams] = useSearchParams()
  const talentId = searchParams.get('talentId')
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  
  const [talent, setTalent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    message: '',
    role: '',
    company: '',
    jobDescription: '',
    compensationRange: '',
    contactMethod: 'email'
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)

  // Sample job roles for dropdown
  const jobRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'Other'
  ]

  // Contact method options
  const contactMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'video', label: 'Video Call' }
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
          experience: '3 years',
          openToWork: true,
          preferredRoles: ['Frontend Developer', 'UI Developer'],
          profileImage: 'https://i.pravatar.cc/150?img=1'
        })
        
        // Pre-fill form with talent's preferred role if available
        if (talent?.preferredRoles?.length > 0) {
          setForm(prev => ({
            ...prev,
            role: talent.preferredRoles[0]
          }))
        }
      }
      setLoading(false)
    }, 500)
  }, [talentId])

  // Pre-fill company name from recruiter profile
  useEffect(() => {
    if (userProfile?.company) {
      setForm(prev => ({
        ...prev,
        company: userProfile.company
      }))
    }
  }, [userProfile])

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

  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!form.message.trim()) {
      errors.message = 'Please enter a personalized message'
    }
    
    if (!form.role.trim()) {
      errors.role = 'Please select or enter a job role'
    }
    
    if (!form.company.trim()) {
      errors.company = 'Please enter your company name'
    }
    
    if (!form.jobDescription.trim()) {
      errors.jobDescription = 'Please provide a brief job description'
    }
    
    if (!form.compensationRange.trim()) {
      errors.compensationRange = 'Please provide a compensation range'
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
      console.log('Recruitment contact submitted:', {
        recruiterId: userProfile.uid,
        recruiterName: userProfile.name,
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
      <h1 className="text-2xl font-bold mb-6">Contact {talent.name} about a Job Opportunity</h1>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <svg className="w-12 h-12 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-green-800">Message Sent!</h2>
          </div>
          <p className="text-green-700">
            Your job opportunity details have been sent to {talent.name}. 
            They will be notified and can choose to respond to your offer.
            We'll let you know when they reply!
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
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{talent.name}</h2>
                  <p className="text-sm text-gray-600">{talent.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{talent.location}</p>
                  
                  <div className="flex items-center mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      talent.openToWork ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {talent.openToWork ? 'Open to Work' : 'Not Currently Looking'}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-xs text-gray-500">{talent.experience} experience</span>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {talent.skills.map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-5 py-4 bg-indigo-50">
              <h2 className="text-lg font-semibold text-indigo-800">Job Opportunity Details</h2>
              <p className="text-sm text-indigo-700">Share information about the position you think would be a good fit</p>
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
                  placeholder={`Introduce yourself to ${talent.name} and explain why you think they would be a good fit for this role...`}
                  rows={4}
                ></textarea>
                {formErrors.message && <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 text-gray-700 border ${
                      formErrors.role ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  >
                    <option value="">Select Role</option>
                    {jobRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {formErrors.role && <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 text-gray-700 border ${
                      formErrors.company ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Your company name"
                  />
                  {formErrors.company && <p className="mt-1 text-sm text-red-600">{formErrors.company}</p>}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  value={form.jobDescription}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 text-gray-700 border ${
                    formErrors.jobDescription ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Briefly describe the job responsibilities and requirements"
                  rows={3}
                ></textarea>
                {formErrors.jobDescription && <p className="mt-1 text-sm text-red-600">{formErrors.jobDescription}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compensation Range
                  </label>
                  <input
                    type="text"
                    name="compensationRange"
                    value={form.compensationRange}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 text-gray-700 border ${
                      formErrors.compensationRange ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="e.g. $80,000 - $100,000"
                  />
                  {formErrors.compensationRange && <p className="mt-1 text-sm text-red-600">{formErrors.compensationRange}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="flex space-x-4">
                    {contactMethods.map((method) => (
                      <div key={method.value} className="flex items-center">
                        <input
                          type="radio"
                          id={method.value}
                          name="contactMethod"
                          value={method.value}
                          checked={form.contactMethod === method.value}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor={method.value} className="ml-2 block text-sm text-gray-700">
                          {method.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
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
                  {submitStatus === 'submitting' ? 'Sending...' : 'Send Job Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default ContactTalents