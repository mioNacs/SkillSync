import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectionButton } from '../ConnectionSystem';
import ChatButton from '../chat/ChatButton';

const LearnerProfile = ({ user, isOwnProfile = false }) => {
  // Extract learner-specific fields with defaults
  const {
    name = '',
    email = '',
    bio = '',
    skills = [],
    interests = [],
    experienceLevel = 'beginner', // beginner/intermediate/advanced
    learningGoals = [],
    projects = [],
    mentorshipNeeded = false,
    collaboratingOn = '',
    profileImage = null,
    uid
  } = user || {};

  const experienceLevelColors = {
    beginner: 'bg-emerald-100 text-emerald-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="space-y-6">
      {/* Header with basic info */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-start">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold border-2 border-gray-100">
                {name ? name.charAt(0).toUpperCase() : 'L'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                {name}
                {mentorshipNeeded && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Seeking Mentorship
                  </span>
                )}
              </h1>
              
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${experienceLevelColors[experienceLevel]}`}>
                  {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)}
                </span>
              </div>
              
              <p className="mt-2 text-gray-600">{bio}</p>
              
              <div className="mt-3 text-sm text-gray-500">
                {email && (
                  <div className="flex items-center gap-1 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {email}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {!isOwnProfile && (
            <div className="flex space-x-4">
              <ConnectionButton 
                targetUser={{ 
                  id: user.uid,
                  name: name,
                  role: 'learner',
                  profileImage: profileImage
                }} 
              />
              <ChatButton
                otherUserId={user.uid}
                otherUserName={name}
                otherUserPhoto={profileImage}
                buttonText="Message Learner"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Skills and Learning Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Skills</h2>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No skills added yet.</p>
          )}
          
          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Interests</h2>
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span 
                  key={index}
                  className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {typeof interest === 'string' ? interest : interest.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No interests added yet.</p>
          )}
        </div>
        
        {/* Learning Goals */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Learning Goals</h2>
          {learningGoals.length > 0 ? (
            <ul className="space-y-2">
              {learningGoals.map((goal, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <p className="mt-2 text-gray-500">No learning goals set yet.</p>
            </div>
          )}
          
          {collaboratingOn && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Currently Collaborating On</h2>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                <p className="text-indigo-700">{collaboratingOn}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Projects */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
          <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((project, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h3 className="font-medium text-gray-800 mb-1">{project.name || project.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                
                {project.technologies && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
            <p className="mt-2 text-gray-500">No projects added yet.</p>
            <button className="mt-3 text-indigo-600 text-sm font-medium hover:text-indigo-800">
              Add your first project
            </button>
          </div>
        )}
      </div>
      
      {/* Connect Section */}
      {mentorshipNeeded && (
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg shadow-md p-6 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,white)]" aria-hidden="true"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Looking for a Mentor</h2>
            <p className="text-indigo-100 mb-4">I'm currently seeking mentorship to accelerate my learning journey.</p>
            <div className="flex gap-3">
              <button className="bg-white text-indigo-700 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Offer Mentorship
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2 border border-indigo-500 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerProfile;