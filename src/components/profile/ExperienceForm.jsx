import { useState } from 'react';

const ExperienceForm = ({ onSave, onCancel, existingExperience = null }) => {
  const [experience, setExperience] = useState({
    title: existingExperience?.title || '',
    company: existingExperience?.company || '',
    location: existingExperience?.location || '',
    startDate: existingExperience?.startDate || '',
    endDate: existingExperience?.endDate || '',
    isCurrent: existingExperience?.isCurrent || false,
    description: existingExperience?.description || ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExperience(prevExperience => ({
      ...prevExperience,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!experience.title.trim() || !experience.company.trim()) {
      return;
    }
    
    // Format dates for display
    const formattedExperience = {
      ...experience,
      duration: formatDuration(experience.startDate, experience.endDate, experience.isCurrent)
    };
    
    onSave(formattedExperience);
  };
  
  // Helper to format the duration for display
  const formatDuration = (startDate, endDate, isCurrent) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const startYear = start.getFullYear();
    
    let endText;
    if (isCurrent) {
      endText = 'Present';
    } else if (endDate) {
      const end = new Date(endDate);
      const endMonth = end.toLocaleString('default', { month: 'short' });
      const endYear = end.getFullYear();
      endText = `${endMonth} ${endYear}`;
    } else {
      endText = 'Present';
    }
    
    return `${startMonth} ${startYear} - ${endText}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{existingExperience ? 'Edit Experience' : 'Add Work Experience'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={experience.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Senior Software Engineer"
            required
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            value={experience.company}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Google"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={experience.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., San Francisco, CA (Remote)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={experience.startDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={experience.endDate}
              onChange={handleChange}
              disabled={experience.isCurrent}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
            />
            <div className="mt-1 flex items-center">
              <input
                id="isCurrent"
                name="isCurrent"
                type="checkbox"
                checked={experience.isCurrent}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-700">Current Position</label>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={experience.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Describe your responsibilities, achievements, and skills used"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {existingExperience ? 'Update Experience' : 'Add Experience'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceForm; 