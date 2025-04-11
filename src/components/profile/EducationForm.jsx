import { useState } from 'react';

const EducationForm = ({ onSave, onCancel, existingEducation = null }) => {
  const [education, setEducation] = useState({
    institution: existingEducation?.institution || '',
    degree: existingEducation?.degree || '',
    field: existingEducation?.field || '',
    year: existingEducation?.year || new Date().getFullYear(),
    description: existingEducation?.description || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducation(prevEducation => ({
      ...prevEducation,
      [name]: name === 'year' ? parseInt(value, 10) || new Date().getFullYear() : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!education.institution.trim() || !education.degree.trim()) {
      return;
    }
    onSave(education);
  };

  // Generate year options from 1950 to current year
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= 1950; year--) {
    yearOptions.push(year);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{existingEducation ? 'Edit Education' : 'Add Education'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institution</label>
          <input
            id="institution"
            name="institution"
            type="text"
            value={education.institution}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Harvard University"
            required
          />
        </div>

        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700">Degree</label>
          <input
            id="degree"
            name="degree"
            type="text"
            value={education.degree}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Bachelor of Science"
            required
          />
        </div>

        <div>
          <label htmlFor="field" className="block text-sm font-medium text-gray-700">Field of Study</label>
          <input
            id="field"
            name="field"
            type="text"
            value={education.field}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Computer Science"
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Graduation Year</label>
          <select
            id="year"
            name="year"
            value={education.year}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={education.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Additional information about your education"
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
            {existingEducation ? 'Update Education' : 'Add Education'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm; 