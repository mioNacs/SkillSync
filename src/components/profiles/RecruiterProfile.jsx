import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OpenRoleForm from '../profile/OpenRoleForm';
import TalentNeedsForm from '../profile/TalentNeedsForm';
import { useAuth } from '../../context/AuthContext';

const RecruiterProfile = ({ user, isOwnProfile = false }) => {
  const { updateUserProfile, currentUser } = useAuth();
  
  // State for managing forms visibility
  const [showOpenRoleForm, setShowOpenRoleForm] = useState(false);
  const [showTalentNeedsForm, setShowTalentNeedsForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingRoleIndex, setEditingRoleIndex] = useState(null);
  const [isHiringNow, setIsHiringNow] = useState(user?.isHiringNow !== false);
  
  // Company info state
  const [companyInfo, setCompanyInfo] = useState({
    companyName: user?.companyName || '',
    companyWebsite: user?.companyWebsite || '',
  });

  // Extract recruiter-specific fields with defaults
  const {
    name = '',
    email = '',
    bio = '',
    companyName = '',
    recruitingFor = [], // Array of roles or project types
    openRoles = [], // Array of open positions
    companyWebsite = '',
    profileImage = null,
  } = user || {};

  // Handle saving open roles
  const handleSaveRole = async (roleData) => {
    try {
      const currentRoles = [...(user.openRoles || [])];
      
      if (editingRoleIndex !== null) {
        // Update existing role
        currentRoles[editingRoleIndex] = roleData;
      } else {
        // Add new role
        currentRoles.push(roleData);
      }
      
      if (isOwnProfile && currentUser) {
        await updateUserProfile(currentUser.uid, { openRoles: currentRoles });
      }
      
      setShowOpenRoleForm(false);
      setEditingRoleIndex(null);
    } catch (error) {
      console.error('Error updating open roles:', error);
    }
  };

  // Handle deleting a role
  const handleDeleteRole = async (index) => {
    try {
      const currentRoles = [...(user.openRoles || [])];
      currentRoles.splice(index, 1);
      
      if (isOwnProfile && currentUser) {
        await updateUserProfile(currentUser.uid, { openRoles: currentRoles });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  // Handle saving talent needs
  const handleSaveTalentNeeds = async (talentNeedsArray) => {
    try {
      if (isOwnProfile && currentUser) {
        await updateUserProfile(currentUser.uid, { recruitingFor: talentNeedsArray });
      }
      
      setShowTalentNeedsForm(false);
    } catch (error) {
      console.error('Error updating talent needs:', error);
    }
  };

  // Handle saving company info
  const handleSaveCompanyInfo = async (e) => {
    e.preventDefault();
    
    try {
      if (isOwnProfile && currentUser) {
        await updateUserProfile(currentUser.uid, { 
          companyName: companyInfo.companyName,
          companyWebsite: companyInfo.companyWebsite
        });
      }
      
      setShowCompanyForm(false);
    } catch (error) {
      console.error('Error updating company info:', error);
    }
  };

  // Handle hiring status toggle
  const handleHiringStatusToggle = async () => {
    const newStatus = !isHiringNow;
    setIsHiringNow(newStatus);
    
    try {
      if (isOwnProfile && currentUser) {
        await updateUserProfile(currentUser.uid, { isHiringNow: newStatus });
      }
    } catch (error) {
      console.error('Error updating hiring status:', error);
    }
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
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold border-2 border-gray-100">
                {name ? name.charAt(0).toUpperCase() : 'R'}
              </div>
            )}
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center w-fit">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Recruiter
                </span>
              </div>
              
              {!showCompanyForm ? (
                <>
                  {companyName && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-gray-800 font-medium">{companyName}</span>
                      {isOwnProfile && (
                        <button onClick={() => setShowCompanyForm(true)} className="text-blue-600 hover:text-blue-800">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                  
                  <p className="mt-2 text-gray-600">{bio}</p>
                  
                  <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-2">
                    {email && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {email}
                      </div>
                    )}
                    
                    {companyWebsite && (
                      <a 
                        href={companyWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Company Website
                      </a>
                    )}
                    
                    {(!companyName && isOwnProfile) && (
                      <button onClick={() => setShowCompanyForm(true)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Company Info
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <form onSubmit={handleSaveCompanyInfo} className="mt-2 space-y-3">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      value={companyInfo.companyName}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
                      Company Website
                    </label>
                    <input
                      type="url"
                      id="companyWebsite"
                      value={companyInfo.companyWebsite}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, companyWebsite: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCompanyForm(false)}
                      className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {isOwnProfile ? (
              <>
                <button
                  onClick={handleHiringStatusToggle}
                  className={`px-4 py-2 rounded-md font-medium text-sm flex-1 md:flex-none flex items-center justify-center gap-1 ${
                    isHiringNow 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {isHiringNow ? "Currently Hiring" : "Not Hiring"}
                </button>
              </>
            ) : (
              <>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 text-sm flex-1 md:flex-none flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Contact Recruiter
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 text-sm flex-1 md:flex-none flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Hiring Now Banner */}
      {isHiringNow && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,white)]" aria-hidden="true"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-xl font-bold">Hiring Now</h2>
              {isOwnProfile && (
                <button 
                  onClick={() => setShowTalentNeedsForm(true)} 
                  className="ml-auto bg-blue-500 hover:bg-blue-400 text-white text-xs py-1 px-2 rounded-full flex items-center"
                >
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Needs
                </button>
              )}
            </div>
            <p className="text-blue-100 mb-4">
              {companyName ? `${companyName} is` : 'Currently'} looking for talented individuals to join their team.
            </p>
            <div className="flex flex-wrap gap-2">
              {recruitingFor.map((role, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center bg-blue-700 border border-blue-500 text-white text-xs px-3 py-1 rounded-full"
                >
                  {role}
                </span>
              ))}
              {recruitingFor.length === 0 && (
                <span className="inline-flex items-center bg-blue-700 border border-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  Multiple Positions
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Talent Needs Form */}
      {showTalentNeedsForm && isOwnProfile && (
        <div className="mb-6">
          <TalentNeedsForm
            onSave={handleSaveTalentNeeds}
            onCancel={() => setShowTalentNeedsForm(false)}
            existingTalentNeeds={recruitingFor}
          />
        </div>
      )}
      
      {/* Open Roles */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Open Roles</h2>
          <div className="flex items-center gap-2">
            {isOwnProfile && (
              <button
                onClick={() => {
                  setEditingRoleIndex(null);
                  setShowOpenRoleForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Role
              </button>
            )}
            <Link to="/jobs" className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Open Role Form */}
        {showOpenRoleForm && isOwnProfile && (
          <div className="mb-6">
            <OpenRoleForm
              onSave={handleSaveRole}
              onCancel={() => {
                setShowOpenRoleForm(false);
                setEditingRoleIndex(null);
              }}
              existingRole={editingRoleIndex !== null ? openRoles[editingRoleIndex] : null}
            />
          </div>
        )}
        
        {!showOpenRoleForm && (
          openRoles.length > 0 ? (
            <div className="space-y-4">
              {openRoles.map((role, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow relative">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{role.roleTitle}</h3>
                    <div className="flex items-center gap-1">
                      {isOwnProfile && (
                        <>
                          <button 
                            onClick={() => {
                              setEditingRoleIndex(index);
                              setShowOpenRoleForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteRole(index)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">{role.description}</p>
                  
                  {role.techStack && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {role.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {role.location || 'Remote'}
                    </span>
                    {!isOwnProfile && (
                      <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md font-medium hover:bg-blue-700 transition-colors">
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-gray-500">No open roles listed at the moment.</p>
              {isOwnProfile ? (
                <button 
                  onClick={() => setShowOpenRoleForm(true)}
                  className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  + Add your first job listing
                </button>
              ) : (
                <p className="text-sm text-gray-400 mt-1">Check back later or contact the recruiter directly.</p>
              )}
            </div>
          )
        )}
      </div>
      
      {/* Company Talent Needs */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Looking For Talent In</h2>
          {isOwnProfile && !showTalentNeedsForm && (
            <button
              onClick={() => setShowTalentNeedsForm(true)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              {recruitingFor.length > 0 ? (
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
        
        {recruitingFor.length > 0 ? (
          <div className="space-y-2">
            {recruitingFor.map((category, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-gray-700">{category}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500">No specific talent needs specified.</p>
            {isOwnProfile ? (
              <button 
                onClick={() => setShowTalentNeedsForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                + Add talent needs
              </button>
            ) : (
              <p className="text-sm text-gray-400 mt-1">Contact the recruiter for more information.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Call to Action - only shown for non-recruiters viewing the profile */}
      {!isOwnProfile && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Ready to take the next step in your career?</h2>
              <p className="text-sm text-gray-600 mt-1">Upload your portfolio and share your skills to get noticed by recruiters.</p>
            </div>
            <button className="whitespace-nowrap bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Update Your Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterProfile;