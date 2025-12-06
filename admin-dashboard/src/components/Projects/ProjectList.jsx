import React from 'react';

const ProjectList = ({ projects = [], onEdit, onDelete }) => {
  // Sample projects if none provided
  const sampleProjects = projects.length > 0 ? projects : [
    { id: 1, name: 'School Renovation', status: 'active', category: 'education', date: '2024-01-15' },
    { id: 2, name: 'Health Clinic Setup', status: 'completed', category: 'health', date: '2023-11-30' },
    { id: 3, name: 'Farm Irrigation', status: 'active', category: 'agriculture', date: '2024-02-01' },
    { id: 4, name: 'Road Construction', status: 'pending', category: 'infrastructure', date: '2024-03-10' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {sampleProjects.map((project) => (
          <li key={project.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{project.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{project.category}</span>
                      <span className="text-sm text-gray-500">{project.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(project)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(project.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {sampleProjects.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No projects found</p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
