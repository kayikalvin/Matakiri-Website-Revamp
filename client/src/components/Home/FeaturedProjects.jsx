import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback projects for demo
  const fallbackProjects = [
    {
      id: 1,
      title: "AI-Powered Agriculture in Kisumu",
      description: "Using AI to help local farmers increase crop yields through predictive analytics and smart farming techniques.",
      category: "Agriculture",
      location: "56 Wells Road, Wolverhampton, UK",
      date: "2023",
      image: "https://images.unsplash.com/photo-1556779144-5b10c6c6d6f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Digital Learning Centers",
      description: "Establishing tech-enabled learning hubs in rural areas to provide access to digital education resources.",
      category: "Education",
      location: "Multiple Locations",
      date: "2023-2024",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Healthcare AI for Rural Clinics",
      description: "Implementing AI diagnostic tools to support healthcare workers in remote medical facilities.",
      category: "Healthcare",
      location: "Western Kenya",
      date: "2024",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await require('../../services/api').projectsAPI.getFeatured();
        setProjects(data?.slice(0, 3) || []);
      } catch (err) {
        console.error('Projects API error:', err);
        // Use fallback projects for demo
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center mb-4">
            <div className="w-8 h-0.5 bg-emerald-300 mr-3"></div>
            <span className="text-sm font-medium text-emerald-600 tracking-wider">FEATURED WORK</span>
            <div className="w-8 h-0.5 bg-emerald-300 ml-3"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Featured <span className="font-medium text-emerald-700">Projects</span>
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our innovative projects that are making a real difference in communities.
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <div className="mt-4 text-gray-500">Loading featured projects...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {projects.map((project) => (
              <div 
                key={project._id || project.id} 
                className="group bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-all duration-300 overflow-hidden"
              >
                {/* Image Container */}
                <div className="h-48 overflow-hidden bg-gray-50">
                  {project?.images?.[0]?.url || project?.image ? (
                    <img 
                      src={project?.images?.[0]?.url || project?.image} 
                      alt={project?.title || 'Project'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                      <span className="text-emerald-400">Project Image</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full mb-3">
                    {project?.category || 'General'}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                    {project?.title || 'Untitled Project'}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {project?.description || 'No description available.'}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-3 h-3 mr-1 text-emerald-400" />
                      <span>{project?.location || 'Location'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-3 h-3 mr-1 text-emerald-400" />
                      <span>{project?.date || project?.year || ''}</span>
                    </div>
                  </div>
                  
                  {/* Learn More Link */}
                  {/* <Link
                    to={`/projects/${project?.slug || project?._id || project?.id || ''}`}
                    className="inline-flex items-center text-emerald-600 font-medium text-sm group-hover:text-emerald-700 transition-colors"
                  >
                    Learn More
                    <FaArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link> */}
                </div>
                
                {/* Hover Indicator */}
                <div className="px-6 pb-4">
                  <div className="w-full h-0.5 bg-gray-100 group-hover:bg-gradient-to-r from-emerald-300 to-teal-300 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/projects"
            className="inline-flex items-center bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300"
          >
            View All Projects
            <FaArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;