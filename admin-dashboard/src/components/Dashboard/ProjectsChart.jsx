import React, { useEffect, useState } from 'react';
import { projectsAPI } from '../../services/api';

const statusToProgress = (status) => {
  // Example mapping, adjust as needed
  switch ((status || '').toLowerCase()) {
    case 'completed': return 100;
    case 'active': return 75;
    case 'development': return 50;
    case 'planning': return 25;
    default: return 10;
  }
};

const ProjectsChart = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await projectsAPI.getAll({ limit: 6, sort: '-createdAt' });
        setProjects(res.data?.data || []);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Project Progress</h3>
        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="text-gray-400 text-center py-6">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-gray-400 text-center py-6">No projects found.</div>
          ) : (
            projects.map((project) => {
              const progress = statusToProgress(project.status);
              return (
                <div key={project._id || project.id || project.name} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{project.title || project.name}</span>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <div className="mt-2 w-full bg-primary-50 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary-500 transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsChart;
