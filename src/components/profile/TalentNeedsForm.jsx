import React, { useState } from 'react';

const TalentNeedsForm = ({ onSave, onCancel, existingTalentNeeds = [] }) => {
  const [talentNeeds, setTalentNeeds] = useState(existingTalentNeeds.join(', '));
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setTalentNeeds(e.target.value);
    if (error) {
      setError('');
    }
  };

  const validate = () => {
    if (!talentNeeds.trim()) {
      setError('Please add at least one talent need');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Process talent needs as array
      const talentNeedsArray = talentNeeds
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      onSave(talentNeedsArray);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Specify Talent Needs
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="talentNeeds" className="block text-sm font-medium text-gray-700 mb-1">
            Talent Areas (comma separated)
          </label>
          <textarea
            id="talentNeeds"
            value={talentNeeds}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="e.g. Frontend Development, React.js, UI/UX Design"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Add the skills, technologies, or roles you're currently recruiting for, separated by commas.
          </p>
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

export default TalentNeedsForm;