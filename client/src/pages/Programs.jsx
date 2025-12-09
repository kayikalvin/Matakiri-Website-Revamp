import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaSeedling, FaGraduationCap, FaHeartbeat, FaTint, FaRobot, FaUsers, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const Programs = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Static categories for now, can be made dynamic if backend supports
  const categories = [
    { id: 'all', name: 'All Programs', icon: <FaUsers /> },
    { id: 'agriculture', name: 'Agriculture', icon: <FaSeedling /> },
    { id: 'education', name: 'Education', icon: <FaGraduationCap /> },
    { id: 'health', name: 'Health', icon: <FaHeartbeat /> },
    { id: 'water', name: 'Water & Sanitation', icon: <FaTint /> },
    { id: 'ai', name: 'AI & Innovation', icon: <FaRobot /> },
    { id: 'community', name: 'Community', icon: <FaUsers /> }
  ];

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await require('../services/api').projectsAPI.getAll();
        setPrograms(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch programs.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const filteredPrograms = activeCategory === 'all'
    ? programs
    : programs.filter(program => program.category === activeCategory);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Programs - Matakiri Tumaini Centre</title>
        <meta name="description" content="Explore our comprehensive programs in agriculture, education, health, water, AI innovation, and community development." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <FaChartLine className="text-3xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
                Our Programs
              </h1>
              <p className="text-xl text-gray-200">
                Comprehensive initiatives designed to create sustainable impact across multiple sectors.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Stats */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">8</div>
                <div className="text-gray-600">Active Programs</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">2,500+</div>
                <div className="text-gray-600">Direct Beneficiaries</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">6</div>
                <div className="text-gray-600">Sectors Covered</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">15</div>
                <div className="text-gray-600">Partner Organizations</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : filteredPrograms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl text-gray-300 mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No programs found in this category
                </h3>
                <p className="text-gray-500">
                  Try selecting a different category or check back for upcoming programs.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program._id || program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    {/* Program Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-3 bg-primary-100 rounded-lg text-primary-600 mr-3">
                            {/* Optionally render icon if available from backend */}
                            {program.icon || <FaUsers />}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {program.title}
                            </h3>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-600">
                                {categories.find(c => c.id === program.category)?.name || program.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                          {program.status ? program.status.charAt(0).toUpperCase() + program.status.slice(1) : ''}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-6">
                        {program.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Key Features:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(program.features || []).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary-600">
                            {program.beneficiaries}+
                          </div>
                          <div className="text-xs text-gray-600">Beneficiaries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary-600">
                            {program.duration}
                          </div>
                          <div className="text-xs text-gray-600">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary-600">
                            {program.impact}
                          </div>
                          <div className="text-xs text-gray-600">Impact</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="px-6 py-4 bg-gray-50 border-t">
                      <button className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                        Learn More About This Program
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Program Approach */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                Our Program Approach
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We follow a structured methodology to ensure maximum impact and sustainability in all our programs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Community Assessment',
                  description: 'In-depth analysis of community needs and available resources'
                },
                {
                  step: '2',
                  title: 'Program Design',
                  description: 'Collaborative development of solutions with community input'
                },
                {
                  step: '3',
                  title: 'Implementation',
                  description: 'Rollout with continuous monitoring and community engagement'
                },
                {
                  step: '4',
                  title: 'Evaluation & Scaling',
                  description: 'Impact assessment and planning for sustainability'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-600 font-bold text-2xl">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold font-display mb-6">
                Get Involved in Our Programs
              </h2>
              <p className="text-xl mb-8 text-primary-100">
                Whether you're interested in volunteering, partnering, or supporting a specific program, 
                there are many ways to contribute to our mission.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Volunteer Opportunities
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Partner With Us
                </button>
                <button className="px-8 py-3 bg-secondary-600 text-white rounded-lg font-semibold hover:bg-secondary-700 transition-colors">
                  Donate to Programs
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Programs */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Upcoming Programs
                </h2>
                <p className="text-gray-600">
                  New initiatives launching soon
                </p>
              </div>
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-2" />
                <span>2024 Roadmap</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Digital Skills for Youth',
                  launch: 'Q2 2024',
                  description: 'Comprehensive digital literacy program targeting out-of-school youth',
                  category: 'education'
                },
                {
                  title: 'Renewable Energy Project',
                  launch: 'Q3 2024',
                  description: 'Solar power installations for schools and community centers',
                  category: 'community'
                },
                {
                  title: 'AI Health Assistant',
                  launch: 'Q4 2024',
                  description: 'Voice-enabled AI assistant for healthcare information in local languages',
                  category: 'ai'
                }
              ].map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {program.title}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {program.launch}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {program.category}
                    </span>
                    <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                      Express Interest →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Programs;