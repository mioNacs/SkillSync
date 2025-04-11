import { useState } from 'react';

const SkillsForm = ({ onSave, onCancel, existingSkills = [] }) => {
  const [skills, setSkills] = useState(existingSkills);
  const [newSkill, setNewSkill] = useState('');
  const [proficiency, setProficiency] = useState('Beginner');

  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const skillExists = skills.some(
      skill => {
        if (typeof skill === 'string') {
          return skill.toLowerCase() === newSkill.trim().toLowerCase();
        }
        return skill.name.toLowerCase() === newSkill.trim().toLowerCase();
      }
    );
    
    if (skillExists) {
      alert('This skill already exists in your profile.');
      return;
    }
    
    const skill = {
      name: newSkill.trim(),
      level: proficiency,
      dateAdded: new Date().toISOString()
    };
    
    setSkills([...skills, skill]);
    setNewSkill('');
    setProficiency('Beginner');
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(skills);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Manage Your Skills</h3>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
              <span className="text-indigo-800 font-medium text-sm mr-1">
                {typeof skill === 'string' ? skill : skill.name}
              </span>
              {typeof skill !== 'string' && skill.level && (
                <span className="text-xs text-indigo-600 bg-indigo-200 px-2 py-0.5 rounded-full mr-2">
                  {skill.level}
                </span>
              )}
              <button 
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="text-indigo-500 hover:text-indigo-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-gray-500 italic">No skills added yet. Add your first skill below.</p>
          )}
        </div>
        
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a skill (e.g., Python, React, UI Design)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-40">
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {proficiencyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddSkill}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700"
        >
          Save Skills
        </button>
      </div>
    </div>
  );
};

export default SkillsForm; 