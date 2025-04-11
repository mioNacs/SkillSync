import React, { useState, useEffect } from 'react';

const MentoringTopicsForm = ({ onSave, onCancel, existingTopics = [] }) => {
  const [topics, setTopics] = useState(existingTopics);
  const [newTopic, setNewTopic] = useState('');
  const [error, setError] = useState('');
  
  // Common topic suggestions
  const topicSuggestions = [
    'Frontend Development', 'Backend Development', 'Full Stack Development', 
    'UI/UX Design', 'Data Science', 'Machine Learning', 'DevOps', 
    'Cloud Computing', 'Mobile Development', 'Cybersecurity',
    'Blockchain', 'Career Advice', 'Interview Preparation',
    'System Design', 'Algorithms', 'JavaScript', 'Python', 'React',
    'Node.js', 'Swift', 'Kotlin', 'Java', 'C#', '.NET',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'
  ];

  // Add a topic from suggestions
  const addSuggestedTopic = (topic) => {
    if (topics.includes(topic)) {
      setError(`"${topic}" is already in your topics`);
      return;
    }
    
    if (topics.length >= 10) {
      setError('Maximum 10 topics allowed');
      return;
    }
    
    setTopics([...topics, topic]);
    setError('');
  };

  // Add a custom topic
  const handleAddTopic = (e) => {
    e.preventDefault();
    
    if (!newTopic.trim()) {
      setError('Topic cannot be empty');
      return;
    }
    
    if (topics.includes(newTopic.trim())) {
      setError(`"${newTopic.trim()}" is already in your topics`);
      return;
    }
    
    if (topics.length >= 10) {
      setError('Maximum 10 topics allowed');
      return;
    }
    
    setTopics([...topics, newTopic.trim()]);
    setNewTopic('');
    setError('');
  };

  // Remove a topic
  const handleRemoveTopic = (topicToRemove) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(topics);
  };

  // Filter suggestions to exclude topics already added
  const filteredSuggestions = topicSuggestions.filter(
    suggestion => !topics.includes(suggestion)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Mentoring Topics</h2>
      <p className="text-gray-600 mb-4">
        Add topics you can mentor others on. These topics will be visible on your profile
        and used to match you with learners.
      </p>
      
      <form onSubmit={handleSubmit}>
        {/* Current Topics */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Mentoring Topics ({topics.length}/10)
          </label>
          
          {topics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <div 
                  key={index}
                  className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span>{topic}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveTopic(topic)}
                    className="text-indigo-500 hover:text-indigo-700 focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No topics added yet</p>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Add Custom Topic */}
        <div className="mb-5">
          <label htmlFor="new-topic" className="block text-sm font-medium text-gray-700 mb-1">
            Add a Custom Topic
          </label>
          <div className="flex">
            <input
              id="new-topic"
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g. GraphQL, SEO, Testing"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={topics.length >= 10}
            />
            <button
              type="button"
              onClick={handleAddTopic}
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none disabled:bg-gray-400"
              disabled={topics.length >= 10}
            >
              Add
            </button>
          </div>
        </div>

        {/* Topic Suggestions */}
        {filteredSuggestions.length > 0 && topics.length < 10 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h3>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.slice(0, 12).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addSuggestedTopic(suggestion)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700"
          >
            Save Topics
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentoringTopicsForm;