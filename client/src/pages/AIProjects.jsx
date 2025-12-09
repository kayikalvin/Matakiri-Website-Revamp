import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaRobot, FaBrain, FaChartLine, FaMobileAlt, FaDatabase, FaShieldAlt } from 'react-icons/fa';
import { projectsAPI } from '../services/api';


// Helper to map backend category to icon
const getProjectIcon = (category) => {
  switch (category) {
    case "Agriculture": return <FaBrain className="text-3xl" />;
    case "Health": return <FaShieldAlt className="text-3xl" />;
    case "Environment": return <FaChartLine className="text-3xl" />;
    case "Education": return <FaRobot className="text-3xl" />;
    case "Market": return <FaDatabase className="text-3xl" />;
    case "Mobile": return <FaMobileAlt className="text-3xl" />;
    default: return <FaRobot className="text-3xl" />;
  }
};

const AIProjects = () => {
  const [aiProjects, setAIProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    projectsAPI.getAll()
      .then(data => {
        const backendProjects = (data && data.data) ? data.data : [];
        const projects = backendProjects.map(project => ({
          ...project,
          icon: getProjectIcon(project.category)
        }));
        setAIProjects(projects);
      })
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>AI & Innovation Projects - Matakiri Tumaini Centre</title>
        <meta name="description" content="Explore our cutting-edge AI projects and innovative solutions for community development and social impact." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <FaRobot className="text-3xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
                AI & Innovation Projects
              </h1>
              <p className="text-xl text-gray-200">
                Leveraging artificial intelligence and innovative technology to solve community challenges and drive sustainable development.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-10 text-lg text-gray-500">Loading projects...</div>
            ) : error ? (
              <div className="text-center py-10 text-lg text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aiProjects.map((project, index) => (
                  <motion.div
                    key={project.id || project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                          {project.icon}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'Pilot Phase'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {project.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Impact</h4>
                        <p className="text-primary-600 font-medium">{project.impact}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {(project.technologies || []).map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 border-t">
                      <button className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                        View Project Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Innovation Principles */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold font-display mb-12">
                Our Innovation Principles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Community First",
                    description: "All solutions are designed with and for the community we serve."
                  },
                  {
                    title: "Sustainable Impact",
                    description: "We build solutions that are maintainable and scalable long-term."
                  },
                  {
                    title: "Ethical AI",
                    description: "We prioritize transparency, fairness, and privacy in all our AI systems."
                  }
                ].map((principle, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="p-6 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-600 font-bold text-xl">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                    <p className="text-gray-600">{principle.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIProjects;