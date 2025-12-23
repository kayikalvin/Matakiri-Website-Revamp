import React, { useState, useEffect } from 'react';
import { resolveAssetUrl } from '../utils/url';
import { useLocation } from 'react-router-dom';
import { programsAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  FaSeedling,
  FaGraduationCap,
  FaHeartbeat,
  FaTint,
  FaRobot,
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
  FaLightbulb,
  FaHandsHelping,
  FaArrowRight,
  FaGlobe,
  FaCogs,
  FaLeaf,
  FaMicroscope,
  FaShieldAlt,
  FaRocket,
  FaTimes,
  FaSearch,
  FaTh,
  FaList,
  FaExclamationTriangle,
  FaFilter
} from 'react-icons/fa';
// import UpcomingProgramsGrid from './UpcomingProgramsGrid';

const Programs = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const location = useLocation();

  // Enhanced categories with better icons and descriptions
  const categories = [
    { 
      id: 'all', 
      name: 'All Programs', 
      icon: <FaGlobe />,
      description: 'Explore all our initiatives',
      color: 'from-primary-500 to-accent-500'
    },
    { 
      id: 'agriculture', 
      name: 'Agriculture', 
      icon: <FaSeedling />,
      description: 'Smart farming and food security',
      color: 'from-emerald-500 to-green-500'
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: <FaGraduationCap />,
      description: 'Skills training and digital literacy',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'health', 
      name: 'Health', 
      icon: <FaHeartbeat />,
      description: 'Healthcare access and wellness',
      color: 'from-red-500 to-pink-500'
    },
    { 
      id: 'water', 
      name: 'Water & Sanitation', 
      icon: <FaTint />,
      description: 'Clean water and hygiene',
      color: 'from-cyan-500 to-blue-500'
    },
    { 
      id: 'ai', 
      name: 'AI & Innovation', 
      icon: <FaRobot />,
      description: 'Technology solutions',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      id: 'community', 
      name: 'Community', 
      icon: <FaUsers />,
      description: 'Social development',
      color: 'from-orange-500 to-yellow-500'
    }
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (activeCategory !== 'all') params.category = activeCategory;
    if (activeStatus !== 'all') params.status = activeStatus;
    if (searchTerm) params.search = searchTerm;
    programsAPI.getAll(params)
      .then(res => {
        setPrograms(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load programs');
        setLoading(false);
      });
  }, [activeCategory, activeStatus, searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setActiveCategory(cat);
    else setActiveCategory('all');
  }, [location.search]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'upcoming': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'planning': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'agriculture': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'education': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'health': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'water': return 'bg-cyan-500/10 text-cyan-700 border-cyan-200';
      case 'ai': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'community': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      <Helmet>
        <title>Our Programs - Matakiri Tumaini Centre</title>
        <meta name="description" content="Explore our comprehensive programs in agriculture, education, health, water, AI innovation, and community development." />
      </Helmet>

      <div className="bg-gradient-to-b from-white via-primary-50/20 to-white">
        {/* Enhanced Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
          {/* Hero Background with Wave */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-primary-800/90"></div>
            {/* Wave Divider at bottom */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg className="w-full h-16 md:h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 40C840 50 960 70 1080 75C1200 80 1320 70 1380 65L1440 60V120H0Z" fill="white" />
              </svg>
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10">
            {/* Top Stats Section */}
            <div className="container mx-auto px-4 py-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-6xl mx-auto"
              >
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Programs</h1>
                  <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                    Discover initiatives making a difference across various sectors
                  </p>
                </div>

                {/* Stats */}
                {/* <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  {[
                    { value: programs.length, label: 'Active Programs', color: 'from-blue-400 to-cyan-400' },
                    { value: '6', label: 'Sectors Covered', color: 'from-purple-400 to-pink-400' },
                    { value: '15', label: 'Partner Organizations', color: 'from-green-400 to-emerald-400' },
                    { value: '2500+', label: 'Total Beneficiaries', color: 'from-orange-400 to-red-400' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-primary-200 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </motion.div> */}
              </motion.div>
            </div>

            {/* Filter and Content Section */}
            <div className="bg-white rounded-t-3xl pt-8 pb-16 relative z-20">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  {/* Filter Header with Actions */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl shadow-sm">
                        <FaCogs className="text-xl text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Browse Programs</h2>
                        <p className="text-sm text-gray-600">Filter by sector or view all</p>
                      </div>
                    </div>

                    {/* Search and View Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                      {/* Search Bar */}
                      <div className="relative w-full sm:w-64">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          placeholder="Search programs..."
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      {/* View Mode Toggle */}
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600 hidden sm:block">View:</div>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                              viewMode === 'grid'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <FaTh />
                            Grid
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                              viewMode === 'list'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <FaList />
                            List
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Filter Cards */}
                  <div className="mb-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveCategory(category.id)}
                          className={`flex gap-2 justify-center items-center p-2 rounded-xl border-2 transition-all ${
                            activeCategory === category.id
                              ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-white shadow-lg shadow-primary-100'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`text-2xl mb-3 ${
                            activeCategory === category.id ? 'text-primary-500' : 'text-gray-500'
                          }`}>
                            {category.icon}
                          </div>
                          <span className="text-xs font-semibold text-center text-gray-900">
                            {category.name}
                          </span>
                          {/* <span className="text-xs text-gray-500 text-center mt-1 line-clamp-2">
                            {category.description}
                          </span> */}
                        </motion.button>
                      ))}
                    </div>

                    {/* Status Filter and Active Category Info */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      {/* Status Filter */}
                      <div className="flex flex-wrap gap-2">
                        {['all', 'active', 'planning', 'paused', 'completed'].map(status => (
                          <button
                            key={status}
                            className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                              activeStatus === status
                                ? 'bg-accent-500 text-white border-accent-500 shadow-sm'
                                : 'bg-white text-accent-700 border-accent-200 hover:bg-accent-50'
                            }`}
                            onClick={() => setActiveStatus(status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>

                      {/* Active Category Info */}
                      <AnimatePresence>
                        {activeCategory !== 'all' && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-1"
                          >
                            <div className="flex items-center gap-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-2 border border-primary-100">
                              {/* <div className="p-3 bg-white rounded-lg shadow-sm">
                                {categories.find(c => c.id === activeCategory)?.icon}
                              </div> */}
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900">
                                  {categories.find(c => c.id === activeCategory)?.name}
                                </h3>
                                {/* <p className="text-sm text-gray-600">
                                  {categories.find(c => c.id === activeCategory)?.description}
                                </p> */}
                              </div>
                              <button
                                onClick={() => setActiveCategory('all')}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                                aria-label="Clear filter"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Loading/Error States */}
                  {loading && (
                    <div className="flex flex-col justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mb-4"></div>
                      <span className="text-primary-600 font-medium">Loading programs...</span>
                      <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest data</p>
                    </div>
                  )}

                  {error && (
                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                      <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Programs</h3>
                      <p className="text-red-600 mb-4">{error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Program List */}
                  {!loading && !error && programs.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                      <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No programs found</h3>
                      <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                      <button
                        onClick={() => {
                          setActiveCategory('all');
                          setActiveStatus('all');
                          setSearchTerm('');
                        }}
                        className="px-6 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}

                  {!loading && !error && programs.length > 0 && (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-sm text-gray-600">
                          Showing <span className="font-semibold text-gray-900">{programs.length}</span> programs
                        </div>
                        <button
                          onClick={() => {
                            setActiveCategory('all');
                            setActiveStatus('all');
                          }}
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-2"
                        >
                          <FaFilter />
                          Clear filters
                        </button>
                      </div>

                      <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                      }>
                        {programs.map((program, idx) =>
                          viewMode === 'grid' ? (
                            <ProgramCard key={program._id || idx} program={program} index={idx} />
                          ) : (
                            <ProgramListCard key={program._id || idx} program={program} index={idx} />
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Programs - Backend Linked */}
        {/* <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaRocket className="text-primary-500 text-xl" />
                    <span className="text-sm font-semibold text-primary-600 tracking-wider uppercase">Coming Soon</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Upcoming Programs
                  </h2>
                  <p className="text-gray-600 mt-2">
                    New initiatives launching in 2026
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendarAlt />
                  <span className="font-medium">2026 Roadmap</span>
                </div>
              </div>

           
              <UpcomingProgramsGrid />
            </div>
          </div>
        </section> */}

        {/* Our Approach Section */}
        {/* <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white">
                <FaShieldAlt className="text-primary-500" />
                <span className="text-sm font-semibold text-primary-700 tracking-wider">Our Methodology</span>
              </div>
              <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
                How We Create <span className="text-primary-600">Impact</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A structured approach to ensure sustainable change and measurable results in all our programs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Community Assessment',
                  description: 'In-depth analysis of community needs and available resources through participatory research methods.',
                  icon: <FaUsers />,
                  color: 'from-primary-500 to-accent-500'
                },
                {
                  step: '2',
                  title: 'Co-Design',
                  description: 'Collaborative development of solutions with community input and local knowledge integration.',
                  icon: <FaLightbulb />,
                  color: 'from-emerald-500 to-green-500'
                },
                {
                  step: '3',
                  title: 'Implementation',
                  description: 'Rollout with continuous monitoring, community engagement, and adaptive management.',
                  icon: <FaCogs />,
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  step: '4',
                  title: 'Evaluation & Scaling',
                  description: 'Impact assessment, learning documentation, and planning for sustainability and replication.',
                  icon: <FaChartLine />,
                  color: 'from-purple-500 to-indigo-500'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 h-full">
                    <div className={`h-3 bg-gradient-to-r ${item.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}>
                          {item.step}
                        </div>
                        <div className="text-2xl text-primary-500">
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Upcoming Programs (Fallback) */}
        {/* <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaRocket className="text-primary-500 text-xl" />
                    <span className="text-sm font-semibold text-primary-600 tracking-wider uppercase">Coming Soon</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Upcoming Programs
                  </h2>
                  <p className="text-gray-600 mt-2">
                    New initiatives launching in 2026
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendarAlt />
                  <span className="font-medium">2026 Roadmap</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Digital Skills for Youth',
                    launch: 'Q2 2026',
                    description: 'Comprehensive digital literacy program targeting out-of-school youth with hands-on tech training.',
                    category: 'education',
                    color: 'border-blue-500'
                  },
                  {
                    title: 'Renewable Energy Project',
                    launch: 'Q3 2026',
                    description: 'Solar power installations for schools and community centers to support education and economic activities.',
                    category: 'community',
                    color: 'border-emerald-500'
                  },
                  {
                    title: 'AI Health Assistant',
                    launch: 'Q4 2026',
                    description: 'Voice-enabled AI assistant for healthcare information in local languages to improve health access.',
                    category: 'ai',
                    color: 'border-purple-500'
                  }
                ].map((program, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-200 hover:border-primary-500 transition-all duration-500 h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {program.title}
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {program.launch}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {program.description}
                      </p>
                      <div className="flex items-center justify-between mt-6">
                        <span className={`px-3 py-1 ${program.color.replace('border', 'bg').replace('500', '100')} ${program.color.replace('border', 'text').replace('500', '700')} rounded-full text-xs font-medium`}>
                          {program.category}
                        </span>
                        <button className="flex items-center gap-2 text-primary-600 font-medium text-sm hover:gap-3 transition-all group">
                          Express Interest
                          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* Call to Action */}
        {/* <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative p-8 md:p-12 text-white">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
                      <FaHandsHelping className="text-white/90" />
                      <span className="text-sm font-semibold tracking-wider">Get Involved</span>
                    </div>
                    
                    <h2 className="text-3xl font-bold font-display mb-4">
                      Join Our Mission
                    </h2>
                    <p className="text-primary-100 mb-8 text-lg max-w-2xl">
                      Whether you're interested in volunteering, partnering, or supporting specific programs, 
                      there are many ways to contribute to creating lasting change in communities.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                        <FaUsers />
                        Volunteer Opportunities
                      </button>
                      <button className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                        Partner With Us
                      </button>
                      <button className="px-8 py-4 bg-accent-500 text-white rounded-xl font-bold hover:bg-accent-600 transition-colors">
                        Donate to Programs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section> */}
      </div>
    </>
  );
};

// Program Card Component for Grid View
const ProgramCard = ({ program, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'upcoming': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'planning': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'agriculture': return 'bg-emerald-500/10 text-emerald-700';
      case 'education': return 'bg-blue-500/10 text-blue-700';
      case 'health': return 'bg-red-500/10 text-red-700';
      case 'water': return 'bg-cyan-500/10 text-cyan-700';
      case 'ai': return 'bg-purple-500/10 text-purple-700';
      case 'community': return 'bg-orange-500/10 text-orange-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      agriculture: <FaSeedling />,
      education: <FaGraduationCap />,
      health: <FaHeartbeat />,
      water: <FaTint />,
      ai: <FaRobot />,
      community: <FaUsers />,
      default: <FaGlobe />
    };
    return icons[category] || icons.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 h-full">
        {/* Program Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={program.image ? resolveAssetUrl(program.image) : undefined}
            alt={program.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(program.status)}`}>
              {program.status?.charAt(0).toUpperCase() + program.status?.slice(1)}
            </span>
          </div>
          
          {/* Category Icon */}
          <div className="absolute bottom-4 left-4">
            <div className={`p-3 rounded-xl ${getCategoryColor(program.category)}`}>
              {getCategoryIcon(program.category)}
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(program.category)}`}>
              {program.category?.charAt(0).toUpperCase() + program.category?.slice(1)}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {program.duration}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {program.title}
          </h3>

          <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
            {program.description}
          </p>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Features:</h4>
            <div className="flex flex-wrap gap-2">
              {(program.features || []).slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  {feature}
                </span>
              ))}
              {(program.features || []).length > 3 && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                  +{(program.features || []).length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {program.beneficiaries}+
              </div>
              <div className="text-xs text-gray-500">Beneficiaries</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {program.duration}
              </div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {program.impact}
              </div>
              <div className="text-xs text-gray-500">Impact</div>
            </div>
          </div>

          {/* Action Button */}
          {/* <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 group">
            Learn More
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button> */}
        </div>
      </div>
    </motion.div>
  );
};

// Program Card Component for List View
const ProgramListCard = ({ program, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700';
      case 'upcoming': return 'bg-blue-500/10 text-blue-700';
      case 'planning': return 'bg-yellow-500/10 text-yellow-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/3 relative">
            <img
              src={program.image ? resolveAssetUrl(program.image) : undefined}
              alt={program.title}
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(program.status)}`}>
                {program.status?.charAt(0).toUpperCase() + program.status?.slice(1)}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-2/3 p-8">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  program.category === 'agriculture' ? 'bg-emerald-500/10 text-emerald-700' :
                  program.category === 'education' ? 'bg-blue-500/10 text-blue-700' :
                  program.category === 'health' ? 'bg-red-500/10 text-red-700' :
                  program.category === 'water' ? 'bg-cyan-500/10 text-cyan-700' :
                  program.category === 'ai' ? 'bg-purple-500/10 text-purple-700' :
                  program.category === 'community' ? 'bg-orange-500/10 text-orange-700' :
                  'bg-gray-500/10 text-gray-700'
                }`}>
                  {program.category?.charAt(0).toUpperCase() + program.category?.slice(1)}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {program.title}
              </h3>

              <p className="text-gray-600 mb-6 flex-grow">
                {program.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaUsers className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{program.beneficiaries}+</div>
                    <div className="text-xs text-gray-500">Beneficiaries</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaCalendarAlt className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{program.duration}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaChartLine className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{program.impact}</div>
                    <div className="text-xs text-gray-500">Impact</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {program.category === 'agriculture' ? <FaSeedling /> :
                     program.category === 'education' ? <FaGraduationCap /> :
                     program.category === 'health' ? <FaHeartbeat /> :
                     program.category === 'water' ? <FaTint /> :
                     program.category === 'ai' ? <FaRobot /> : <FaUsers />}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm truncate">
                      {program.category?.charAt(0).toUpperCase() + program.category?.slice(1)}
                    </div>
                    <div className="text-xs text-gray-500">Category</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {(program.features || []).slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all flex items-center gap-2 group">
                  View Details
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Programs;