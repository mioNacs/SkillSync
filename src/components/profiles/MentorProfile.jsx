import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MentoringTopicsForm from '../profile/MentoringTopicsForm';
import SkillForm from '../profile/SkillForm';
import AvailabilityForm from '../profile/AvailabilityForm';
import { useAuth } from '../../context/AuthContext';
import { ConnectionButton } from '../ConnectionSystem';

const MentorProfile = ({ user, isOwnProfile = false }) => {
  const { updateUserProfile, currentUser } = useAuth();
  
  // State for managing forms visibility
  const [showMentoringTopicsForm, setShowMentoringTopicsForm] = useState(false);
  const [showSkillsForm, setShowSkillsForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  
  // Experience form state
  const [yearsExperience, setYearsExperience] = useState(user?.yearsOfExperience || 0);

  // Extract mentor-specific fields with defaults
  const {
    name = '',
    email = '',
    bio = '',
    skills = [],
    interests = [],
    mentoringIn = [], // Topics the mentor specializes in
    yearsOfExperience = 0,
    availability = {}, // Object containing availability schedule
    pastMentorships = [], // Array of past mentees and feedback
    profileImage = null
  } = user || {};

  // Handle saving mentoring topics
  const handleSaveMentoringTopics = async (topicsArray) => {
    try {
      if (isOwnProfile && currentUser) {
        await updateUserProfile(currentUser.uid, { mentoringIn: topicsArray });
      }
      
      setShowMentoringTopicsForm(false);
    } catch (error) {
      console.error('Error updating mentoring topics:', error);
    }
  };

  // Handle saving skills
  const handleSaveSkill = async (skillData) => {
    try {
      const currentSkills = [...(user.skills || [])];
      currentSkills.push(skillData);
      
      if (isOwnProfile && currentUser) {
        await updateUserProfile(currentUser.uid, { skills: currentSkills });
      }
      
      setShowSkillsForm(false);
    } catch (error) {
      console.error('Error updating skills:', error);
    }
  };

  // Handle saving availability
  const handleSaveAvailability = async (availabilityData) => {
    try {
      if (isOwnProfile && currentUser) {
        await updateUserProfile(currentUser.uid, { availability: availabilityData });
      }
      
      setShowAvailabilityForm(false);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  // Handle saving years of experience
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    
    try {
      if (isOwnProfile && currentUser) {
        await updateUserProfile(currentUser.uid, { yearsOfExperience: parseInt(yearsExperience, 10) || 0 });
      }
      
      setShowExperienceForm(false);
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };

  // Format mentorship schedule from availability object
  const formatAvailabilitySchedule = () => {
    if (!availability || !availability.schedule) return [];
    
    const availabilityItems = [];
    const days = Object.keys(availability.schedule || {});
    
    days.forEach(day => {
      if (availability.schedule[day].isAvailable) {
        availability.schedule[day].timeSlots.forEach(slot => {
          availabilityItems.push(`${day}: ${slot.start} - ${slot.end}`);
        });
      }
    });
    
    return availabilityItems;
  };

  // Parse availability for display
  const availabilitySchedule = formatAvailabilitySchedule();

  // Helper function to format feedback stars
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Header with basic info */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex gap-4 items-start">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold border-2 border-gray-100">
                {name ? name.charAt(0).toUpperCase() : 'M'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Mentor
                </span>
              </div>
              
              {!showExperienceForm ? (
                <div className="mt-1 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {yearsOfExperience > 0 ? `${yearsOfExperience} ${yearsOfExperience === 1 ? 'year' : 'years'} experience` : 'New mentor'}
                  </span>
                  {isOwnProfile && (
                    <button 
                      onClick={() => setShowExperienceForm(true)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSaveExperience} className="mt-1 flex items-center gap-2">
                  <input 
                    type="number"
                    min="0"
                    max="50"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <span className="text-sm text-gray-700">years</span>
                  <button
                    type="submit"
                    className="text-indigo-600 hover:text-indigo-800 ml-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExperienceForm(false)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </form>
              )}
              
              <p className="mt-2 text-gray-600">{bio}</p>
              
              <div className="mt-3 text-sm text-gray-500">
                {email && (
                  <div className="flex items-center gap-1 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {email}
                  </div>
                )}
                {availability && availability.timezone && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Timezone: {availability.timezone}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {!isOwnProfile ? (
              <>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 text-sm flex-1 md:flex-none flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Request Mentorship
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 text-sm flex-1 md:flex-none flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save Profile
                </button>
              </>
            ) : (
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 text-sm flex-1 md:flex-none flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mentoring Topics Form */}
      {showMentoringTopicsForm && isOwnProfile && (
        <div className="mb-4">
          <MentoringTopicsForm
            onSave={handleSaveMentoringTopics}
            onCancel={() => setShowMentoringTopicsForm(false)}
            existingTopics={mentoringIn}
          />
        </div>
      )}
      
      {/* Skills Form */}
      {showSkillsForm && isOwnProfile && (
        <div className="mb-4">
          <SkillForm
            onSave={handleSaveSkill}
            onCancel={() => setShowSkillsForm(false)}
          />
        </div>
      )}
      
      {/* Availability Form */}
      {showAvailabilityForm && isOwnProfile && (
        <div className="mb-4">
          <AvailabilityForm
            onSave={handleSaveAvailability}
            onCancel={() => setShowAvailabilityForm(false)}
            existingAvailability={availability}
          />
        </div>
      )}
      
      {/* Mentoring Topics and Availability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills and Mentoring Topics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Mentoring In</h2>
            {isOwnProfile && !showMentoringTopicsForm && (
              <button
                onClick={() => setShowMentoringTopicsForm(true)}
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
              >
                {mentoringIn.length > 0 ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add
                  </>
                )}
              </button>
            )}
          </div>
          
          {mentoringIn.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {mentoringIn.map((topic, index) => (
                <span 
                  key={index}
                  className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {typeof topic === 'string' ? topic : topic.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500">
                {isOwnProfile ? "Add topics you want to mentor in" : "No mentoring topics specified yet."}
              </p>
              {isOwnProfile && (
                <button 
                  onClick={() => setShowMentoringTopicsForm(true)}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  + Add mentoring topics
                </button>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4 mt-6">
            <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
            {isOwnProfile && !showSkillsForm && (
              <button
                onClick={() => setShowSkillsForm(true)}
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </button>
            )}
          </div>
          
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                  {skill.level && ` • ${skill.level}`}
                  {skill.years > 0 && ` • ${skill.years} ${skill.years === 1 ? 'year' : 'years'}`}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              {isOwnProfile ? "Add skills to showcase your expertise" : "No skills added yet."}
            </p>
          )}
        </div>
        
        {/* Availability */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Availability</h2>
            {isOwnProfile && !showAvailabilityForm && (
              <button
                onClick={() => setShowAvailabilityForm(true)}
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
              >
                {availabilitySchedule.length > 0 ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add
                  </>
                )}
              </button>
            )}
          </div>
          
          {availabilitySchedule.length > 0 ? (
            <div className="space-y-3">
              {availabilitySchedule.map((slot, index) => (
                <div key={index} className="flex items-center rounded-lg p-3 bg-indigo-50">
                  <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-indigo-700">{slot}</span>
                </div>
              ))}
              {availability?.timezone && (
                <div className="mt-2 text-sm text-gray-500 italic">
                  All times in {availability.timezone} timezone
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">Availability information not provided.</p>
              {isOwnProfile ? (
                <button 
                  onClick={() => setShowAvailabilityForm(true)}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  + Add your availability
                </button>
              ) : (
                <p className="text-sm text-gray-400 mt-1">Please contact the mentor directly.</p>
              )}
            </div>
          )}
          
          <div className="mt-6">
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 text-sm flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule a Session
            </button>
          </div>
        </div>
      </div>
      
      {/* Past Mentorships */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Past Mentorships & Feedback</h2>
        
        {pastMentorships.length > 0 ? (
          <div className="space-y-6">
            {pastMentorships.map((mentorship, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{mentorship.menteeName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{mentorship.period || 'Duration not specified'}</p>
                  </div>
                  <div className="flex">{renderStars(mentorship.rating || 5)}</div>
                </div>
                <p className="mt-3 text-gray-700 italic">"{mentorship.feedback || 'No feedback provided.'}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="mt-2 text-gray-500">No past mentorships yet.</p>
            <p className="mt-1 text-sm text-gray-400">Be the first to work with this mentor!</p>
          </div>
        )}
      </div>
      
      {!isOwnProfile && (
        <ConnectionButton 
          targetUser={{ 
            id: user.uid,
            name: name,
            role: 'mentor',
            profileImage: profileImage
          }} 
        />
      )}
    </div>
  );
};

export default MentorProfile;