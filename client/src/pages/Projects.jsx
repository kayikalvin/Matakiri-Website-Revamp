import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaFilter, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaChartBar, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filters = {
    status: [
      { id: 'all', label: 'All Status' },
      { id: 'active', label: 'Active' },
      { id: 'completed', label: 'Completed' },
      { id: 'upcoming', label: 'Upcoming' }
    ],
    category: [
      { id: 'all', label: 'All Categories' },
      { id: 'agriculture', label: 'Agriculture' },
      { id: 'education', label: 'Education' },
      { id: 'health', label: 'Health' },
      { id: 'water', label: 'Water & Sanitation' },
      { id: 'ai', label: 'AI & Innovation' },
      { id: 'community', label: 'Community Development' }
    ]
  };

  const projects = [
    {
      id: 1,
      title: 'Smart Agriculture Mobile App',
      description: 'Developing a mobile application that provides AI-powered farming advice, market prices, and weather forecasts to small-scale farmers.',
      category: 'ai',
      status: 'active',
      location: 'Kisumu County',
      startDate: '2023-01-15',
      endDate: '2024-06-30',
      beneficiaries: 500,
      budget: '$150,000',
      impact: 'Increased crop yield by 35% for early adopters',
      partners: ['Tech for Good', 'University of Nairobi'],
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Digital Learning Centers',
      description: 'Establishing computer labs in 10 rural schools with internet access and training for teachers and students.',
      category: 'education',
      status: 'completed',
      location: 'Multiple Locations',
      startDate: '2022-03-01',
      endDate: '2023-08-31',
      beneficiaries: 2000,
      budget: '$250,000',
      impact: 'Improved digital literacy by 60% in target schools',
      partners: ['UNICEF', 'Safaricom Foundation'],
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Community Health Screening',
      description: 'Mobile health clinics providing free screenings for diabetes, hypertension, and malaria in remote communities.',
      category: 'health',
      status: 'active',
      location: 'Siaya County',
      startDate: '2023-05-10',
      endDate: '2024-12-31',
      beneficiaries: 1200,
      budget: '$180,000',
      impact: 'Early detection of 300+ chronic conditions',
      partners: ['Ministry of Health', 'WHO'],
      image: 'https://images.unsplash.com/photo-1516549655669-df6654e435de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'Clean Water Initiative',
      description: 'Installing solar-powered water pumps and filtration systems in 5 communities without access to clean water.',
      category: 'water',
      status: 'active',
      location: 'Homa Bay County',
      startDate: '2023-02-20',
      endDate: '2023-12-15',
      beneficiaries: 1500,
      budget: '$200,000',
      impact: 'Reduced waterborne diseases by 70%',
      partners: ['USAID', 'Water.org'],
      image: 'https://images.unsplash.com/photo-1564053489984-317bbd824340?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'AI for Crop Disease Detection',
      description: 'Developing machine learning models to identify crop diseases from smartphone photos and recommend treatments.',
      category: 'ai',
      status: 'active',
      location: 'Migori County',
      startDate: '2023-08-01',
      endDate: '2024-09-30',
      beneficiaries: 800,
      budget: '$120,000',
      impact: '90% accuracy in disease detection',
      partners: ['IBM Research', 'KALRO'],
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      title: 'Women Entrepreneurship Program',
      description: 'Training and microfinance support for women-led small businesses in rural communities.',
      category: 'community',
      status: 'completed',
      location: 'Kisumu County',
      startDate: '2022-06-01',
      endDate: '2023-05-31',
      beneficiaries: 300,
      budget: '$100,000',
      impact: '150 new businesses started',
      partners: ['Equity Bank', "Women's Fund"],      
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 7,
      title: 'Youth Tech Training Bootcamp',
      description: '6-month intensive training program in software development and digital skills for unemployed youth.',
      category: 'education',
      status: 'upcoming',
      location: 'Kisumu City',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      beneficiaries: 100,
      budget: '$80,000',
      impact: 'Expected 80% employment rate',
      partners: ['Andela', 'Google Africa'],
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 8,
      title: 'Solar Power for Schools',
      description: 'Installing solar panels in 15 rural schools to provide reliable electricity for learning.',
      category: 'community',
      status: 'active',
      location: 'Multiple Locations',
      startDate: '2023-09-15',
      endDate: '2024-06-30',
      beneficiaries: 2500,
      budget: '$300,000',
      impact: '24/7 electricity for 15 schools',
      partners: ['UNDP', 'Kenya Power'],
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-indigo-100 text-indigo-800';
      case 'health': return 'bg-red-100 text-red-800';
      case 'agriculture': return 'bg-green-100 text-green-800';
      case 'water': return 'bg-blue-100 text-blue-800';
      case 'community': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Projects - Matakiri Tumaini Centre</title>
        <meta name="description" content="Browse our portfolio of impactful projects in agriculture, education, health, water, AI innovation, and community development." />
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
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
                Our Projects
              </h1>
              <p className="text-xl text-gray-200">
                Explore our portfolio of innovative projects creating sustainable impact across Kenya.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-white sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <FaFilter className="text-gray-600 mr-2" />
                <span className="font-medium text-gray-700">Filter by:</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {filters.status.map(filter => (
                      <option key={filter.id} value={filter.id}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {filters.category.map(filter => (
                      <option key={filter.id} value={filter.id}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{projects.length}</div>
                <div className="text-gray-600">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {projects.filter(p => p.status === 'active').length}
                </div>
                <div className="text-gray-600">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {projects.reduce((sum, p) => sum + p.beneficiaries, 0).toLocaleString()}+
                </div>
                <div className="text-gray-600">Total Beneficiaries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">$1.38M</div>
                <div className="text-gray-600">Total Investment</div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl text-gray-300 mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No projects found matching your criteria
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    {/* Project Image */}
                    <div className="h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                          {filters.category.find(c => c.id === project.category)?.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {project.budget}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {project.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Project Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center text-gray-600 mb-1">
                            <FaUsers className="mr-1" />
                          </div>
                          <div className="font-semibold text-gray-800">
                            {project.beneficiaries.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Beneficiaries</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center text-gray-600 mb-1">
                            <FaCalendarAlt className="mr-1" />
                          </div>
                          <div className="font-semibold text-gray-800">
                            {new Date(project.startDate).getFullYear()}
                          </div>
                          <div className="text-xs text-gray-500">Start Year</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center text-gray-600 mb-1">
                            <FaChartBar className="mr-1" />
                          </div>
                          <div className="font-semibold text-gray-800 text-sm">
                            {project.impact.split(' ')[0]}
                          </div>
                          <div className="text-xs text-gray-500">Impact</div>
                        </div>
                      </div>

                      {/* Location & Partners */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-2" />
                          <span className="text-sm">{project.location}</span>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            Partners:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.partners.slice(0, 2).map((partner, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {partner}
                              </span>
                            ))}
                            {project.partners.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                +{project.partners.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="px-6 py-4 bg-gray-50 border-t">
                      <button className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center">
                        View Project Details
                        <FaExternalLinkAlt className="ml-2" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Project Impact Stories */}
        <section className="py-16 bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                Project Impact Stories
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Real stories of transformation and positive change from our project communities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'From Subsistence to Smart Farming',
                  project: 'Smart Agriculture Mobile App',
                  story: 'John Omondi, a farmer from Kisumu, increased his maize yield by 40% using our AI-powered farming recommendations.',
                  image: 'https://images.unsplash.com/photo-1556779144-5b10c6c6d6f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                },
                {
                  title: 'Digital Literacy Transforms Learning',
                  project: 'Digital Learning Centers',
                  story: 'St. Mary\'s Primary School students now access global educational resources, improving their computer skills by 75%.',
                  image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                }
              ].map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {story.story}
                    </p>
                    <div className="text-sm text-primary-600 font-medium">
                      Project: {story.project}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold font-display mb-4">
                Support Our Projects
              </h2>
              <p className="mb-6 text-primary-100">
                Your contribution helps us expand our impact and reach more communities in need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Donate to Projects
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Become a Project Partner
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;