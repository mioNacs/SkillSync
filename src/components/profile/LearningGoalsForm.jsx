import { useState } from 'react';

const LearningGoalsForm = ({ onSave, onCancel, existingGoals = [] }) => {
  const [goals, setGoals] = useState(existingGoals);
  const [newGoal, setNewGoal] = useState('');
  const [priority, setPriority] = useState('Medium');

  const priorityLevels = ['High', 'Medium', 'Low'];

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    
    const goalExists = goals.some(
      goal => goal.text.toLowerCase() === newGoal.trim().toLowerCase()
    );
    
    if (goalExists) {
      alert('This learning goal already exists in your profile.');
      return;
    }
    
    const goal = {
      text: newGoal.trim(),
      priority: priority,
      completed: false,
      dateAdded: new Date().toISOString()
    };
    
    setGoals([...goals, goal]);
    setNewGoal('');
    setPriority('Medium');
  };

  const handleRemoveGoal = (index) => {
    const updatedGoals = [...goals];
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
  };

  const handleToggleComplete = (index) => {
    const updatedGoals = [...goals];
    updatedGoals[index].completed = !updatedGoals[index].completed;
    setGoals(updatedGoals);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(goals);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Manage Your Learning Goals</h3>
      
      <div className="mb-6">
        <div className="space-y-2 mb-4">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center bg-white border border-gray-200 p-3 rounded-lg">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => handleToggleComplete(index)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 mr-2"
              />
              <div className="flex-1">
                <p className={`font-medium ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {goal.text}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full mr-2 
                    ${goal.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}`}>
                    {goal.priority} Priority
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => handleRemoveGoal(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {goals.length === 0 && (
            <p className="text-sm text-gray-500 italic py-4 text-center">No learning goals added yet. Add your first goal below.</p>
          )}
        </div>
        
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter a learning goal (e.g., Learn React Hooks, Master Python Data Science)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-32">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {priorityLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddGoal}
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
          Save Goals
        </button>
      </div>
    </div>
  );
};

export default LearningGoalsForm; 