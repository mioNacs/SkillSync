import React, { useState } from 'react';

const OpenRoleForm = ({ onSave, onCancel, existingRole = null }) => {
  const [formData, setFormData] = useState({
    roleTitle: existingRole?.roleTitle || '',
    description: existingRole?.description || '',
    techStack: existingRole?.techStack ? existingRole.techStack.join(', ') : '',
    location: existingRole?.location || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.roleTitle.trim()) {
      newErrors.roleTitle = 'Job title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Process tech stack as array
      const techStackArray = formData.techStack
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      onSave({
        ...formData,
        techStack: techStackArray,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {existingRole ? 'Edit Job Opening' : 'Add New Job Opening'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="roleTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title*
            </label>
            <input
              type="text"
              id="roleTitle"
              name="roleTitle"
              value={formData.roleTitle}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.roleTitle ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="e.g. Frontend Developer"
            />
            {errors.roleTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.roleTitle}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Describe the job role and responsibilities"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">
              Tech Stack (comma separated)
            </label>
            <input
              type="text"
              id="techStack"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. React, Node.js, MongoDB"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Remote, New York, NY"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpenRoleForm;