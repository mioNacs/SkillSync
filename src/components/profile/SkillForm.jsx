import { useState } from 'react';

const SkillForm = ({ onSave, onCancel, existingSkill = null }) => {
  const [skill, setSkill] = useState({
    name: existingSkill?.name || '',
    level: existingSkill?.level || 'Beginner',
    years: existingSkill?.years || 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkill(prevSkill => ({
      ...prevSkill,
      [name]: name === 'years' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skill.name.trim()) {
      return;
    }
    onSave(skill);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{existingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Skill Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={skill.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., JavaScript, UX Design, Project Management"
            required
          />
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">Proficiency Level</label>
          <select
            id="level"
            name="level"
            value={skill.level}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div>
          <label htmlFor="years" className="block text-sm font-medium text-gray-700">Years of Experience</label>
          <input
            id="years"
            name="years"
            type="number"
            min="0"
            max="50"
            value={skill.years}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            {existingSkill ? 'Update Skill' : 'Add Skill'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm; 