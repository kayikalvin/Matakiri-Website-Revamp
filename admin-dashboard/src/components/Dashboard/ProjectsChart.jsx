import React from 'react';

const ProjectsChart = () => {
  // Placeholder data
  const projects = [
    { name: 'AI Research', progress: 75, color: 'bg-blue-500' },
    { name: 'Community Outreach', progress: 60, color: 'bg-green-500' },
    { name: 'Education Program', progress: 90, color: 'bg-purple-500' },
    { name: 'Partnership Development', progress: 45, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Project Progress</h3>
        <div className="mt-5 space-y-4">
          {projects.map((project) => (
            <div key={project.name} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{project.name}</span>
                  <span className="text-sm text-gray-500">{project.progress}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${project.color}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsChart;
