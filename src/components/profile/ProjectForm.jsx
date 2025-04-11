import { useState } from 'react';

const ProjectForm = ({ onSave, onCancel, existingProject = null }) => {
  const [project, setProject] = useState({
    name: existingProject?.name || '',
    role: existingProject?.role || '',
    description: existingProject?.description || '',
    githubLink: existingProject?.githubLink || '',
    liveLink: existingProject?.liveLink || '',
    technologies: existingProject?.technologies || [],
    startDate: existingProject?.startDate || '',
    endDate: existingProject?.endDate || '',
    isCurrent: existingProject?.isCurrent || false
  });

  const [techInput, setTechInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProject(prevProject => ({
      ...prevProject,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTechAdd = () => {
    if (techInput.trim() && !project.technologies.includes(techInput.trim())) {
      setProject(prevProject => ({
        ...prevProject,
        technologies: [...prevProject.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleTechRemove = (techToRemove) => {
    setProject(prevProject => ({
      ...prevProject,
      technologies: prevProject.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!project.name.trim()) {
      return;
    }
    onSave(project);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{existingProject ? 'Edit Project' : 'Add New Project'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={project.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., E-Commerce Platform"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Your Role</label>
          <input
            id="role"
            name="role"
            type="text"
            value={project.role}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., Lead Developer"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={project.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Describe the project, its purpose, and your contributions"
          />
        </div>

        <div>
          <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700">GitHub Link</label>
          <input
            id="githubLink"
            name="githubLink"
            type="url"
            value={project.githubLink}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., https://github.com/username/project"
          />
        </div>

        <div>
          <label htmlFor="liveLink" className="block text-sm font-medium text-gray-700">Live Demo Link (Optional)</label>
          <input
            id="liveLink"
            name="liveLink"
            type="url"
            value={project.liveLink}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., https://myproject.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={project.startDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={project.endDate}
              onChange={handleChange}
              disabled={project.isCurrent}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
            />
            <div className="mt-1 flex items-center">
              <input
                id="isCurrent"
                name="isCurrent"
                type="checkbox"
                checked={project.isCurrent}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-700">Current Project</label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
          <div className="flex">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTechAdd())}
              className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., React, Node.js"
            />
            <button
              type="button"
              onClick={handleTechAdd}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md font-medium hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span key={index} className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {tech}
                <button
                  type="button"
                  onClick={() => handleTechRemove(tech)}
                  className="ml-1.5 text-indigo-600 hover:text-indigo-900 focus:outline-none"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
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
            {existingProject ? 'Update Project' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm; 