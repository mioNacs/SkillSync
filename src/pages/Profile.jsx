import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProfileImage from '../components/profile/ProfileImage'
import SkillForm from '../components/profile/SkillForm'
import ExperienceForm from '../components/profile/ExperienceForm'
import ProjectForm from '../components/profile/ProjectForm'
import EducationForm from '../components/profile/EducationForm'
import ProfileRouter from '../components/profiles/ProfileRouter'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('skills')
  const [isEditing, setIsEditing] = useState(false)
  const [showProfilePreview, setShowProfilePreview] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    website: '',
  })
  
  // State for managing form displays
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  
  // State for editing items
  const [editingItem, setEditingItem] = useState(null);
  
  const { currentUser, userProfile, updateUserProfile, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated && !currentUser) {
      navigate('/login')
    }
  }, [isAuthenticated, currentUser, navigate])

  // Update form data when user profile changes
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        title: userProfile.title || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        website: userProfile.website || '',
      })
    }
  }, [userProfile])

  // Reset form display states when changing tabs
  useEffect(() => {
    setShowSkillForm(false);
    setShowExperienceForm(false);
    setShowProjectForm(false);
    setShowEducationForm(false);
    setEditingItem(null);
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await updateUserProfile(currentUser.uid, formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }
  
  // Handle profile image update
  const handleProfileImageUpdate = (imageUrl) => {
    // The updateUserProfile is already called inside the ProfileImage component
    console.log('Profile image updated:', imageUrl);
  }
  
  // Skills management
  const handleAddSkill = async (skillData) => {
    try {
      const currentSkills = userProfile.skills || [];
      
      if (editingItem !== null) {
        // Update existing skill
        const updatedSkills = [...currentSkills];
        updatedSkills[editingItem] = skillData;
        await updateUserProfile(currentUser.uid, { skills: updatedSkills });
      } else {
        // Add new skill
        const updatedSkills = [...currentSkills, skillData];
        await updateUserProfile(currentUser.uid, { skills: updatedSkills });
      }
      
      setShowSkillForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating skills:', error);
    }
  }
  
  const handleEditSkill = (index) => {
    setEditingItem(index);
    setShowSkillForm(true);
  }
  
  const handleDeleteSkill = async (index) => {
    try {
      const currentSkills = [...(userProfile.skills || [])];
      currentSkills.splice(index, 1);
      await updateUserProfile(currentUser.uid, { skills: currentSkills });
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  }

  // Experience management
  const handleAddExperience = async (experienceData) => {
    try {
      const currentExperience = userProfile.experience || [];
      
      if (editingItem !== null) {
        // Update existing experience
        const updatedExperience = [...currentExperience];
        updatedExperience[editingItem] = experienceData;
        await updateUserProfile(currentUser.uid, { experience: updatedExperience });
      } else {
        // Add new experience
        const updatedExperience = [...currentExperience, experienceData];
        await updateUserProfile(currentUser.uid, { experience: updatedExperience });
      }
      
      setShowExperienceForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  }
  
  // Project management
  const handleAddProject = async (projectData) => {
    try {
      const currentProjects = userProfile.projects || [];
      
      if (editingItem !== null) {
        // Update existing project
        const updatedProjects = [...currentProjects];
        updatedProjects[editingItem] = projectData;
        await updateUserProfile(currentUser.uid, { projects: updatedProjects });
      } else {
        // Add new project
        const updatedProjects = [...currentProjects, projectData];
        await updateUserProfile(currentUser.uid, { projects: updatedProjects });
      }
      
      setShowProjectForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }
  
  // Education management
  const handleAddEducation = async (educationData) => {
    try {
      const currentEducation = userProfile.education || [];
      
      if (editingItem !== null) {
        // Update existing education
        const updatedEducation = [...currentEducation];
        updatedEducation[editingItem] = educationData;
        await updateUserProfile(currentUser.uid, { education: updatedEducation });
      } else {
        // Add new education
        const updatedEducation = [...currentEducation, educationData];
        await updateUserProfile(currentUser.uid, { education: updatedEducation });
      }
      
      setShowEducationForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating education:', error);
    }
  }
  
  // Render edit profile form
  const renderEditForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Professional Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g. Frontend Developer"
        />
      </div>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          value={formData.bio}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Tell us about yourself"
        />
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g. San Francisco, CA"
        />
      </div>
      
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g. https://yourwebsite.com"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  )

  // Loading state
  if (!userProfile || !currentUser) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }
  
  // Prepare data for UI display
  const displayName = userProfile.name || currentUser.displayName || 'User'
  const initials = displayName.split(' ').map(n => n[0]).join('')
  const displayTitle = userProfile.title || 'SkillSync Member'
  const displayBio = userProfile.bio || 'No bio provided yet. Edit your profile to add a bio.'
  
  const skills = userProfile.skills || []
  const experience = userProfile.experience || []
  const projects = userProfile.projects || []
  const education = userProfile.education || []

  const tabs = [
    { id: 'skills', label: 'Skills & Expertise' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'preview', label: 'Profile Preview' },
  ]
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <ProfileImage 
              currentImage={userProfile.profileImage} 
              onImageUpdate={handleProfileImageUpdate} 
            />
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              renderEditForm()
            ) : (
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                  <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
                  <p className="text-lg text-gray-600">{displayTitle}</p>
                  <p className="mt-2 text-gray-600">{displayBio}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                    {userProfile.location && (
                  <span className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                        {userProfile.location}
                  </span>
                    )}
                  
                  <span className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                      {currentUser.email}
                  </span>
                  
                    {userProfile.website && (
                      <a 
                        href={userProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-indigo-500 hover:text-indigo-700"
                      >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                        {userProfile.website}
                      </a>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700"
                  >
                  Edit Profile
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50">
                  Share Profile
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'preview') {
                    setShowProfilePreview(true);
                  } else {
                    setShowProfilePreview(false);
                  }
                }}
                className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Profile Preview Tab */}
        {activeTab === 'preview' ? (
          <ProfileRouter user={userProfile} />
        ) : (
          <>
            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Skills & Expertise</h2>
                  <button 
                    onClick={() => {
                      setEditingItem(null);
                      setShowSkillForm(true);
                    }}
                    className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-indigo-700"
                  >
                    Add New Skill
                  </button>
                </div>
                
                {showSkillForm && (
                  <div className="mb-6">
                    <SkillForm 
                      onSave={handleAddSkill} 
                      onCancel={() => {
                        setShowSkillForm(false);
                        setEditingItem(null);
                      }}
                      existingSkill={editingItem !== null ? skills[editingItem] : null}
                    />
                  </div>
                )}
                
                {!showSkillForm && skills.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="mt-2 text-gray-500">No skills added yet</p>
                    <button 
                      onClick={() => setShowSkillForm(true)} 
                      className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-600"
                    >
                      Add your first skill
                    </button>
                  </div>
                ) : (
                  !showSkillForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map((skill, index) => (
                        <div key={index} className="border rounded-lg p-4 relative group">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">{skill.name}</h3>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{skill.years} years experience</p>
                      
                      <div className="mt-2 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-indigo-600 rounded-full" 
                          style={{ 
                            width: skill.level === 'Expert' ? '90%' : 
                                skill.level === 'Advanced' ? '75%' : 
                                skill.level === 'Intermediate' ? '60%' : '40%' 
                          }}
                        ></div>
                      </div>
                          
                          {/* Action buttons */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button 
                              onClick={() => handleEditSkill(index)}
                              className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteSkill(index)}
                              className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                      </div>
                    </div>
                  ))}
                </div>
                  )
                )}
              </div>
            )}
            
            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
                  <button 
                    onClick={() => {
                      setEditingItem(null);
                      setShowExperienceForm(true);
                    }}
                    className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-indigo-700"
                  >
                    Add Experience
                  </button>
                </div>
                
                {showExperienceForm && (
                  <div className="mb-6">
                    <ExperienceForm 
                      onSave={handleAddExperience} 
                      onCancel={() => {
                        setShowExperienceForm(false);
                        setEditingItem(null);
                      }}
                      existingExperience={editingItem !== null ? experience[editingItem] : null}
                    />
                  </div>
                )}
                
                {!showExperienceForm && experience.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-gray-500">No work experience added yet</p>
                    <button 
                      onClick={() => setShowExperienceForm(true)}
                      className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-600"
                    >
                      Add your work experience
                    </button>
                  </div>
                ) : (
                  !showExperienceForm && (
                <div className="space-y-6">
                      {experience.map((exp, index) => (
                        <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0 relative group">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800">{exp.title}</h3>
                        <span className="text-sm text-gray-500">{exp.duration}</span>
                      </div>
                          <p className="text-sm text-gray-600 mt-1">{exp.company} {exp.location && `• ${exp.location}`}</p>
                      <p className="mt-2 text-gray-700">{exp.description}</p>
                          
                          {/* Action buttons */}
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button 
                              onClick={() => {
                                setEditingItem(index);
                                setShowExperienceForm(true);
                              }}
                              className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button 
                              onClick={async () => {
                                try {
                                  const currentExperience = [...(userProfile.experience || [])];
                                  currentExperience.splice(index, 1);
                                  await updateUserProfile(currentUser.uid, { experience: currentExperience });
                                } catch (error) {
                                  console.error('Error deleting experience:', error);
                                }
                              }}
                              className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                    </div>
                  ))}
                </div>
                  )
                )}
              </div>
            )}
            
            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
                  <button 
                    onClick={() => {
                      setEditingItem(null);
                      setShowProjectForm(true);
                    }}
                    className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-indigo-700"
                  >
                    Add Project
                  </button>
                </div>
                
                {showProjectForm && (
                  <div className="mb-6">
                    <ProjectForm 
                      onSave={handleAddProject} 
                      onCancel={() => {
                        setShowProjectForm(false);
                        setEditingItem(null);
                      }}
                      existingProject={editingItem !== null ? projects[editingItem] : null}
                    />
                  </div>
                )}
                
                {!showProjectForm && projects.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <p className="mt-2 text-gray-500">No projects added yet</p>
                    <button 
                      onClick={() => setShowProjectForm(true)}
                      className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-600"
                    >
                      Add your first project
                    </button>
                  </div>
                ) : (
                  !showProjectForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects.map((project, index) => (
                        <div key={index} className="border rounded-lg p-4 relative group">
                      <h3 className="font-medium text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Role: {project.role}</p>
                      <p className="mt-2 text-sm text-gray-700">{project.description}</p>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                            {project.technologies && project.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                          
                          <div className="mt-3 flex gap-3">
                            {project.githubLink && (
                              <a 
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-xs text-indigo-500 hover:text-indigo-700"
                              >
                                <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub
                              </a>
                            )}
                            
                            {project.liveLink && (
                              <a 
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-xs text-indigo-500 hover:text-indigo-700"
                              >
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Live Demo
                              </a>
                            )}
                          </div>
                          
                          {/* Action buttons */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button 
                              onClick={() => {
                                setEditingItem(index);
                                setShowProjectForm(true);
                              }}
                              className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button 
                              onClick={async () => {
                                try {
                                  const currentProjects = [...(userProfile.projects || [])];
                                  currentProjects.splice(index, 1);
                                  await updateUserProfile(currentUser.uid, { projects: currentProjects });
                                } catch (error) {
                                  console.error('Error deleting project:', error);
                                }
                              }}
                              className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                      </div>
                    </div>
                  ))}
                </div>
                  )
                )}
              </div>
            )}
            
            {/* Education Tab */}
            {activeTab === 'education' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Education</h2>
                  <button 
                    onClick={() => {
                      setEditingItem(null);
                      setShowEducationForm(true);
                    }}
                    className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-indigo-700"
                  >
                    Add Education
                  </button>
                </div>
                
                {showEducationForm && (
                  <div className="mb-6">
                    <EducationForm 
                      onSave={handleAddEducation} 
                      onCancel={() => {
                        setShowEducationForm(false);
                        setEditingItem(null);
                      }}
                      existingEducation={editingItem !== null ? education[editingItem] : null}
                    />
                  </div>
                )}
                
                {!showEducationForm && education.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <p className="mt-2 text-gray-500">No education history added yet</p>
                    <button 
                      onClick={() => setShowEducationForm(true)}
                      className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-600"
                    >
                      Add your education
                    </button>
                  </div>
                ) : (
                  !showEducationForm && (
                <div className="space-y-6">
                      {education.map((edu, index) => (
                        <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0 relative group">
                      <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                      <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {edu.field && <span>{edu.field} • </span>}
                            Graduated: {edu.year}
                          </p>
                          {edu.description && (
                            <p className="mt-2 text-sm text-gray-700">{edu.description}</p>
                          )}
                          
                          {/* Action buttons */}
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button 
                              onClick={() => {
                                setEditingItem(index);
                                setShowEducationForm(true);
                              }}
                              className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button 
                              onClick={async () => {
                                try {
                                  const currentEducation = [...(userProfile.education || [])];
                                  currentEducation.splice(index, 1);
                                  await updateUserProfile(currentUser.uid, { education: currentEducation });
                                } catch (error) {
                                  console.error('Error deleting education:', error);
                                }
                              }}
                              className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                    </div>
                  ))}
                </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Profile