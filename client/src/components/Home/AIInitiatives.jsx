import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { projectsAPI } from '../../services/api';
import { Link } from 'react-router-dom';

// Reverted: use original behavior for image URLs (use REACT_APP_API_URL or localhost fallback)
import { 
  FaRobot, 
  FaBrain, 
  FaChartLine, 
  FaMobileAlt, 
  FaDatabase, 
  FaShieldAlt,
  FaSeedling,
  FaHeartbeat,
  FaGraduationCap,
  FaHandsHelping,
  FaLightbulb,
  FaCogs,
  FaCalendarAlt,
  FaUsers,
  FaArrowRight,
  FaCheckCircle,
  FaRocket,
  FaGlobe,
  FaMicrochip
} from 'react-icons/fa';

// Helper to map backend category to icon
const getProjectIcon = (category) => {      
  const iconMap = {
    "Agriculture": { icon: <FaSeedling />, color: "from-emerald-500 to-green-500" },
    "Health": { icon: <FaHeartbeat />, color: "from-red-500 to-rose-500" },
    "Environment": { icon: <FaCogs />, color: "from-teal-500 to-cyan-500" },
    "Education": { icon: <FaGraduationCap />, color: "from-blue-500 to-indigo-500" },
    "Market": { icon: <FaChartLine />, color: "from-amber-500 to-orange-500" },
    "Mobile": { icon: <FaMobileAlt />, color: "from-purple-500 to-violet-500" }
  };
  
  // Always return a valid object, even if category is undefined or not in map
  return iconMap[category] || { 
    icon: <FaRobot />, 
    color: "from-primary-500 to-accent-500" 
  };
};

const AIInitiatives = () => {
  const [aiProjects, setAIProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    projectsAPI.getAIProjects()
      .then(data => {
        // Ensure data.data exists and is an array
        const projectsData = Array.isArray(data?.data) ? data.data : [];
        const projects = projectsData.map(project => ({
          ...project,
          // Ensure iconData is always set
          iconData: getProjectIcon(project?.category || "default")
        }));
        setAIProjects(projects);
      })
      .catch(() => setError('Failed to load AI projects'))
      .finally(() => setLoading(false));
  }, []);

  const innovationPrinciples = [
    {
      icon: <FaHandsHelping />,
      title: "Community First",
      description: "All solutions are designed with and for the community we serve.",
      color: "from-primary-500 to-accent-500"
    },
    {
      icon: <FaLightbulb />,
      title: "Sustainable Impact",
      description: "We build solutions that are maintainable and scalable long-term.",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <FaShieldAlt />,
      title: "Ethical AI",
      description: "We prioritize transparency, fairness, and privacy in all our AI systems.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <FaBrain />,
      title: "Local Innovation",
      description: "We develop solutions that work within local constraints and resources.",
      color: "from-purple-500 to-violet-500"
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Ongoing';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Ongoing';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'Pilot Phase': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Development': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  // Helper to get project image URL (original fallback logic)
  const getProjectImageUrl = (project) => {
    if (project?.images && Array.isArray(project.images) && project.images[0] && project.images[0].url) {
      const src = project.images[0].url;
      if (src && src.startsWith('/api/uploads')) {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        return `${base}${src.replace('/api/uploads', '/uploads')}`;
      }
      return src;
    }
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  // Helper functions for statistics
  const getTotalBeneficiaries = () => {
    return aiProjects.reduce((sum, p) => sum + (parseInt(p.beneficiaries) || 0), 0);
  };

  const getUniqueTechnologies = () => {
    const allTechs = aiProjects.reduce((acc, p) => {
      if (Array.isArray(p.technologies)) {
        return [...acc, ...p.technologies];
      }
      return acc;
    }, []);
    
    // Remove duplicates
    const uniqueTechs = [...new Set(allTechs.filter(Boolean))];
    return uniqueTechs.length;
  };

  const getUniqueSectors = () => {
    const categories = aiProjects.map(p => p.category).filter(Boolean);
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories.length;
  };

  return (
    <>
      <Helmet>
        <title>AI & Innovation Initiatives - Matakiri Tumaini Centre</title>
        <meta name="description" content="Explore our cutting-edge AI projects and innovative solutions for community development and social impact." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section with Modern Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0 50 Q25 0 50 50 T100 50" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)" />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl mb-10 shadow-2xl shadow-primary-500/30"
              >
                <FaRobot className="text-4xl" />
              </motion.div>
              
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-cyan-400 rounded-full"></div>
                <span className="text-sm font-semibold text-primary-300 uppercase tracking-wider">
                  AI & Innovation
                </span>
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-primary-400 rounded-full"></div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-8 leading-tight tracking-tight">
                AI <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">Innovation</span> Hub
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
                Transforming communities through cutting-edge artificial intelligence 
                and innovative technology solutions for sustainable development.
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              >
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Currently running {aiProjects.length} AI initiatives</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Impact Metrics - Glassmorphism Cards */}
        <section className="relative -mt-20 mb-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  value: aiProjects.length, 
                  label: "Active AI Projects", 
                  description: "Across multiple sectors",
                  icon: <FaMicrochip className="w-6 h-6" />,
                  delay: 0,
                  color: "from-primary-500 to-accent-500"
                },
                { 
                  value: getTotalBeneficiaries().toLocaleString(), 
                  label: "Direct Beneficiaries", 
                  description: "Positively impacted",
                  icon: <FaUsers className="w-6 h-6" />,
                  delay: 0.1,
                  color: "from-emerald-500 to-teal-500"
                },
                { 
                  value: getUniqueTechnologies(), 
                  label: "Technologies Used", 
                  description: "Diverse tech stack",
                  icon: <FaCogs className="w-6 h-6" />,
                  delay: 0.2,
                  color: "from-blue-500 to-cyan-500"
                },
                { 
                  value: getUniqueSectors(), 
                  label: "Sectors Impacted", 
                  description: "Community sectors transformed",
                  icon: <FaGlobe className="w-6 h-6" />,
                  delay: 0.3,
                  color: "from-purple-500 to-violet-500"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
                    
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                        <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        2024
                      </div>
                    </div>
                    
                    <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-500">
                      {stat.value}
                    </div>
                    
                    <div className="font-semibold text-gray-800 mb-2">{stat.label}</div>
                    <div className="text-sm text-gray-600">{stat.description}</div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="text-xs text-gray-500">Annual Growth +18%</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid with Modern Cards */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
                <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
                  AI Project Portfolio
                </span>
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">AI Solutions</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Discover our portfolio of AI-powered innovations creating tangible impact 
                across communities through intelligent technology solutions.
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-20">
                <div className="relative inline-block">
                  <div className="w-20 h-20 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaRobot className="text-primary-500 text-xl animate-pulse" />
                  </div>
                </div>
                <div className="mt-6 text-lg text-gray-600 font-medium">Loading AI innovations...</div>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-red-500 text-2xl">!</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Innovations Unavailable</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Refresh Innovations
                </button>
              </div>
            ) : aiProjects.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaRobot className="text-blue-500 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">No AI Projects Available</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Check back soon for new AI initiatives!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aiProjects.map((project, index) => {
                  const iconData = project.iconData || getProjectIcon("default");
                  return (
                    <motion.div
                      key={project._id || project.id || index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="group relative"
                    >
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 h-full">
                        {/* Project Image with Gradient Overlay */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={getProjectImageUrl(project)}
                            alt={project.title || "AI Project"}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          
                          {/* Status Badge */}
                          <div className="absolute top-4 right-4">
                            <span className={`px-4 py-2 rounded-full text-xs font-semibold text-white ${getStatusColor(project.status)} shadow-lg`}>
                              {project.status || 'Active'}
                            </span>
                          </div>
                          
                          {/* Category Icon */}
                          <div className="absolute bottom-4 left-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${iconData.color} shadow-lg`}>
                              <div className="text-white text-2xl">
                                {iconData.icon}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Project Content */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                <FaCalendarAlt className="w-3 h-3" />
                                <span>Launched: {formatDate(project.launchDate)}</span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                {project.title || "Untitled Project"}
                              </h3>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                            {project.description || "No description available."}
                          </p>

                          {/* Project Stats */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                {parseInt(project.beneficiaries)?.toLocaleString() || "0"}
                              </div>
                              <div className="text-xs text-gray-500">Beneficiaries</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                {project.duration || "Ongoing"}
                              </div>
                              <div className="text-xs text-gray-500">Duration</div>
                            </div>
                          </div>

                          {/* Technologies */}
                          {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                            <div className="mb-6">
                              <div className="text-xs font-medium text-gray-500 mb-2">Technologies</div>
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                  <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                    {tech}
                                  </span>
                                ))}
                                {project.technologies.length > 3 && (
                                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                    +{project.technologies.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Impact Highlight */}
                          {project.impact && (
                            <div className="mb-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
                              <div className="flex items-start gap-3">
                                <FaCheckCircle className="text-primary-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-primary-700 mb-1">Key Impact</div>
                                  <div className="text-sm text-gray-700">{project.impact}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Action Button */}
                          {/* <button className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 flex items-center justify-center gap-2 group">
                            <span>Explore Project</span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                          </button> */}
                        </div>
                      </div>
                      
                      {/* Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/20 to-accent-400/20 opacity-0 group-hover:opacity-100 blur-xl -z-10 transition-opacity duration-500"></div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Innovation Principles - Modern Cards */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent to-primary-500" />
                <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
                  Our Innovation Philosophy
                </span>
                <div className="w-12 h-1 bg-gradient-to-l from-transparent to-primary-500" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Guiding <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Principles</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                These core principles shape every AI solution we develop, ensuring 
                ethical, sustainable, and impactful innovation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {innovationPrinciples.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg group-hover:shadow-2xl transition-all duration-500" />
                  
                  <div className="relative p-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${principle.color} mb-8`}>
                      <div className="text-white text-2xl">
                        {principle.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{principle.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {principle.description}
                    </p>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaRocket className="w-4 h-4" />
                        <span>Core Principle #{index + 1}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Timeline - Modern Design */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <FaRocket className="text-2xl text-primary-500" />
                <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
                  Our Development Journey
                </span>
                <FaRocket className="text-2xl text-primary-500 rotate-180" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                AI Solution <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Development</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                From concept to community impact, we follow a structured approach 
                to ensure successful AI implementation.
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  {
                    step: "1",
                    title: "Community Needs Assessment",
                    description: "Identify specific challenges through community engagement",
                    icon: <FaHandsHelping />
                  },
                  {
                    step: "2",
                    title: "Solution Design & Prototyping",
                    description: "Design AI solutions with working prototypes",
                    icon: <FaLightbulb />
                  },
                  {
                    step: "3",
                    title: "Pilot Implementation",
                    description: "Deploy in real-world environments",
                    icon: <FaRocket />
                  },
                  {
                    step: "4",
                    title: "Scale & Impact Assessment",
                    description: "Expand and measure long-term impact",
                    icon: <FaChartLine />
                  }
                ].map((process, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="group relative text-center"
                  >
                    <div className="relative mb-8">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto relative z-10 bg-gradient-to-br ${
                        index === 0 ? "from-primary-500 to-accent-500" :
                        index === 1 ? "from-blue-500 to-cyan-500" :
                        index === 2 ? "from-purple-500 to-violet-500" :
                        "from-emerald-500 to-teal-500"
                      } shadow-xl`}>
                        <div className="text-white text-2xl">
                          {process.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="font-bold text-gray-900">{process.step}</span>
                        </div>
                      </div>
                      
                      {index < 3 && (
                        <div className="hidden md:block absolute top-10 left-3/4 w-full h-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {process.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {process.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagons" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M25 0L50 14V42L25 56L0 42V14L25 0Z" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-3 mb-10">
                <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-cyan-400" />
                <span className="text-sm font-semibold text-primary-300 uppercase tracking-wider">
                  Join Our Innovation Journey
                </span>
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-primary-400" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Innovate with <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">Purpose</span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Whether you're a researcher, developer, or organization passionate about 
                AI for social good, let's collaborate to create meaningful change.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/projects/"
                  className="px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/30 transition-all flex items-center justify-center gap-3"
                  aria-label="Explore AI Portfolio"
                >
                  <FaRocket />
                  Explore AI Portfolio
                </Link>

                <Link
                  to="/contact"
                  className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
                  aria-label="Contact Innovation Team"
                >
                  Contact Innovation Team
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIInitiatives;