import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaChartBar,
  FaExternalLinkAlt,
  FaGlobe,
  FaHandsHelping,
  FaSeedling,
  FaGraduationCap,
  FaHeartbeat,
  FaWater,
  FaMicrochip,
  FaUsers as FaCommunity,
  FaTimes,
  FaArrowRight,
  FaLightbulb,
  FaPauseCircle
} from "react-icons/fa";
import { projectsAPI } from "../services/api";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const categoryIcons = {
    agriculture: <FaSeedling />,
    education: <FaGraduationCap />,
    health: <FaHeartbeat />,
    water: <FaWater />,
    ai: <FaMicrochip />,
    community: <FaCommunity />,
    default: <FaGlobe />
  };

  const filters = {
    status: [
      { id: "all", label: "All Status", icon: <FaGlobe /> },
      { id: "active", label: "Active", icon: <FaHandsHelping /> },
      { id: "completed", label: "Completed", icon: <FaChartBar /> },
      { id: "planning", label: "Planning", icon: <FaCalendarAlt /> },
      { id: "paused", label: "Paused", icon: <FaPauseCircle /> },
    ],
    category: [
      { id: "all", label: "All Categories", icon: <FaFilter /> },
      { id: "agriculture", label: "Agriculture", icon: <FaSeedling /> },
      { id: "education", label: "Education", icon: <FaGraduationCap /> },
      { id: "health", label: "Health", icon: <FaHeartbeat /> },
      { id: "water", label: "Water & Sanitation", icon: <FaWater /> },
      { id: "ai", label: "AI & Innovation", icon: <FaMicrochip /> },
      { id: "community", label: "Community", icon: <FaCommunity /> },
    ],
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await projectsAPI.getAll();
        console.log("Projects API Response:", response);
        setProjects(response?.data || response || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message || "Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Update active filters whenever selections change
  useEffect(() => {
    const filters = [];
    if (selectedStatus !== "all") {
      const statusFilter = filters.status?.find(s => s.id === selectedStatus);
      filters.push({ type: "status", label: statusFilter?.label || selectedStatus });
    }
    if (selectedCategory !== "all") {
      const categoryFilter = filters.category?.find(c => c.id === selectedCategory);
      filters.push({ type: "category", label: categoryFilter?.label || selectedCategory });
    }
    if (searchTerm) {
      filters.push({ type: "search", label: `Search: "${searchTerm}"` });
    }
    setActiveFilters(filters);
  }, [selectedStatus, selectedCategory, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "completed":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "planning":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "paused":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "agriculture":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
      case "education":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "health":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "water":
        return "bg-cyan-500/10 text-cyan-700 border-cyan-200";
      case "ai":
        return "bg-purple-500/10 text-purple-700 border-purple-200";
      case "community":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    return categoryIcons[category] || categoryIcons.default;
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    totalBeneficiaries: projects.reduce((sum, p) => sum + (parseInt(p.beneficiaries) || 0), 0),
    totalInvestment: projects.reduce((sum, p) => {
      const budget = p.budget || {};
      return sum + (parseFloat(budget.estimated || budget.amount || 0) || 0);
    }, 0)
  };

  const removeFilter = (filterType) => {
    switch (filterType) {
      case "status":
        setSelectedStatus("all");
        break;
      case "category":
        setSelectedCategory("all");
        break;
      case "search":
        setSearchTerm("");
        break;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedCategory("all");
  };

  return (
    <>
      <Helmet>
        <title>Our Projects - Matakiri Tumaini Centre</title>
        <meta
          name="description"
          content="Explore our innovative community development projects in Kenya. See how we're transforming lives through technology and sustainable solutions."
        />
      </Helmet>

      {/* Hero Section with Enhanced Design */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24 md:py-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20"
            >
              <FaLightbulb className="text-white/90" />
              <span className="text-sm font-semibold tracking-wider">Innovation in Action</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6 leading-tight">
              Our <span className="text-accent-300">Projects</span>
            </h1>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transforming communities through innovative and sustainable development initiatives. 
              Discover how we're making a tangible difference in Kenya.
            </p>
            
            {/* Quick Stats */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {[
                { value: stats.totalProjects, label: "Total Projects", color: "from-primary-400 to-accent-400" },
                { value: stats.activeProjects, label: "Active", color: "from-green-400 to-emerald-400" },
                { value: stats.completedProjects, label: "Completed", color: "from-blue-400 to-cyan-400" },
                // { value: `${(stats.totalBeneficiaries / 1000).toFixed(1)}K+`, label: "Beneficiaries", color: "from-purple-400 to-pink-400" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div> */}
          </motion.div>
        </div>
        
        {/* Wave Divider */}
        {/* <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 40C840 50 960 70 1080 75C1200 80 1320 70 1380 65L1440 60V120H0Z" fill="white"/>
          </svg>
        </div> */}
      </section>

      {/* Enhanced Search and Filter Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar with Advanced Options */}
            <div className="mb-8">
              <div className="relative">
                <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search projects, locations, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Filter Controls */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaFilter className="text-primary-500" />
                    <span>Filter Projects</span>
                  </div>
                  
                  {/* Status Filter Pills */}
                  <div className="flex flex-wrap gap-2">
                    {filters.status.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedStatus(filter.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedStatus === filter.id
                            ? "bg-primary-500 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {filter.icon}
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-4 py-2 rounded-md transition-all ${
                        viewMode === "grid" 
                          ? "bg-white text-primary-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-4 py-2 rounded-md transition-all ${
                        viewMode === "list" 
                          ? "bg-white text-primary-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Filter Grid */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Browse by Category</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                  {filters.category.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedCategory(filter.id)}
                      className={`flex gap-2 items-center p-2 justify-center rounded-xl border-2 transition-all ${
                        selectedCategory === filter.id
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className={`text-xl mb-2 ${
                        selectedCategory === filter.id ? "text-primary-500" : "text-gray-500"
                      }`}>
                        {filter.icon}
                      </div>
                      <span className="text-xs font-medium text-center">{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              <AnimatePresence>
                {activeFilters.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-gray-600">Active filters:</span>
                      {activeFilters.map((filter, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm"
                        >
                          <span>{filter.label}</span>
                          <button
                            onClick={() => removeFilter(filter.type)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </motion.div>
                      ))}
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-gray-700">
                Showing <span className="font-bold">{filteredProjects.length}</span> of{" "}
                <span className="font-bold">{projects.length}</span> projects
              </div>
              <div className="text-sm text-gray-500">
                Total Impact: <span className="font-bold text-primary-600">
                  {stats.totalBeneficiaries.toLocaleString()}+ beneficiaries
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Display Section */}
      <section className="py-12  bg-gray-50">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaLightbulb className="text-primary-500 text-xl animate-pulse" />
                </div>
              </div>
              <div className="mt-6 text-lg text-gray-600 font-medium">Loading innovative projects...</div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <div className="text-3xl text-red-500">!</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to load projects</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No projects found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any projects matching your search criteria. Try adjusting your filters or search term.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project._id || project.id || index} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.map((project, index) => (
                <ProjectListCard key={project._id || project.id || index} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Impact Stories Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white">
              <FaHandsHelping className="text-primary-500" />
              <span className="text-sm font-semibold text-primary-700 tracking-wider">Success Stories</span>
            </div>
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
              Real Impact, <span className="text-primary-600">Real Stories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our projects are transforming lives and communities across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "From Subsistence to Smart Farming",
                project: "Agri-Tech AI Platform",
                story: "Sarah increased her maize yield by 60% using our AI-powered farming recommendations and mobile app.",
                impact: "40+ farmers trained",
                color: "from-emerald-500 to-green-500"
              },
              {
                title: "Digital Literacy Revolution",
                project: "Community Tech Centers",
                story: "Over 500 youth gained digital skills, with 85% finding employment or starting businesses.",
                impact: "500+ youth empowered",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Clean Water, Healthier Community",
                project: "Water Purification Initiative",
                story: "Installed 15 water purification systems, reducing waterborne diseases by 70% in the community.",
                impact: "3,000+ beneficiaries",
                color: "from-cyan-500 to-blue-500"
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 h-full">
                  <div className={`h-3 bg-gradient-to-r ${story.color}`}></div>
                  <div className="p-8">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 mb-4">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      {story.project}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {story.story}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">{story.impact}</span>
                      {/* <span className="inline-flex items-center gap-2 text-primary-600 font-medium text-sm group-hover:gap-3 transition-all">
                        Read full story
                        <FaArrowRight className="text-xs" />
                      </span> */}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
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
                  <h2 className="text-3xl font-bold font-display mb-4">
                    Partner With Us
                  </h2>
                  <p className="text-primary-100 mb-8 text-lg max-w-2xl">
                    Your support helps us expand our impact, launch new initiatives, and reach more communities in need.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/contact">
                      <button className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                        <FaHandsHelping />
                        Become a Project Partner
                      </button>
                    </Link>
                    <Link to="/contact">
                      <button className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                        Make a Donation
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Project Card Component for Grid View
const ProjectCard = ({ project, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700";
      case "completed":
        return "bg-blue-500/10 text-blue-700";
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      agriculture: <FaSeedling />,
      education: <FaGraduationCap />,
      health: <FaHeartbeat />,
      water: <FaWater />,
      ai: <FaMicrochip />,
      community: <FaCommunity />,
      default: <FaGlobe />
    };
    return icons[category] || icons.default;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "agriculture":
        return "bg-emerald-500/10 text-emerald-700";
      case "education":
        return "bg-blue-500/10 text-blue-700";
      case "health":
        return "bg-red-500/10 text-red-700";
      case "water":
        return "bg-cyan-500/10 text-cyan-700";
      case "ai":
        return "bg-purple-500/10 text-purple-700";
      case "community":
        return "bg-orange-500/10 text-orange-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
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
        {/* Project Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={
              project.image ||
              project.imageUrl ||
              "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
              {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || "Active"}
            </span>
          </div>
          
          {/* Category Icon */}
          <div className="absolute bottom-4 left-4">
            <div className={`p-3 rounded-xl ${getCategoryColor(project.category)}`}>
              {getCategoryIcon(project.category)}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
              {project.category?.charAt(0).toUpperCase() + project.category?.slice(1) || "General"}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {project.startDate
                ? new Date(project.startDate).getFullYear()
                : "Ongoing"}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {project.title || "Untitled Project"}
          </h3>

          <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
            {project.description || "No description available."}
          </p>

          {/* Project Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {(project.beneficiaries || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Beneficiaries</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {project.duration || "1+"}
              </div>
              <div className="text-xs text-gray-500">Years</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {project.partners?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Partners</div>
            </div>
          </div>

          {/* Location */}
          {project.location && (
            <div className="flex items-center text-gray-600 mb-4">
              <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
              <span className="text-sm truncate">{project.location}</span>
            </div>
          )}

          {/* Action Button */}
          <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 group">
            View Project Details
            <FaExternalLinkAlt className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Project Card Component for List View
const ProjectListCard = ({ project, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700";
      case "completed":
        return "bg-blue-500/10 text-blue-700";
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ x: 10 }}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/3 relative">
            <img
              src={
                project.image ||
                project.imageUrl ||
                "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
              alt={project.title}
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || "Active"}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-2/3 p-8">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.category === 'agriculture' ? 'bg-emerald-500/10 text-emerald-700' :
                  project.category === 'education' ? 'bg-blue-500/10 text-blue-700' :
                  project.category === 'health' ? 'bg-red-500/10 text-red-700' :
                  project.category === 'water' ? 'bg-cyan-500/10 text-cyan-700' :
                  project.category === 'ai' ? 'bg-purple-500/10 text-purple-700' :
                  project.category === 'community' ? 'bg-orange-500/10 text-orange-700' :
                  'bg-gray-500/10 text-gray-700'
                }`}>
                  {project.category?.charAt(0).toUpperCase() + project.category?.slice(1) || "General"}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {project.title || "Untitled Project"}
              </h3>

              <p className="text-gray-600 mb-6 flex-grow">
                {project.description || "No description available."}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaUsers className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{(project.beneficiaries || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Beneficiaries</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaCalendarAlt className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {project.startDate
                        ? new Date(project.startDate).getFullYear()
                        : "Ongoing"}
                    </div>
                    <div className="text-xs text-gray-500">Start Year</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaMapMarkerAlt className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm truncate">
                      {project.location || "Kenya"}
                    </div>
                    <div className="text-xs text-gray-500">Location</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaChartBar className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {project.partners?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Partners</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Budget: </span>
                  <span className="font-semibold text-gray-900">
                    {project.budget
                      ? typeof project.budget === 'object'
                        ? `${project.budget.currency || 'KSH'} ${(project.budget.estimated || 0).toLocaleString()}`
                        : project.budget
                      : 'Not specified'}
                  </span>
                </div>
                {/* <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all flex items-center gap-2 group">
                  View Details
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;






















// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Helmet } from "react-helmet-async";
// import {
//   FaFilter,
//   FaSearch,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaUsers,
//   FaChartBar,
//   FaExternalLinkAlt,
// } from "react-icons/fa";
// import { projectsAPI } from "../services/api";

// const Projects = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const filters = {
//     status: [
//       { id: "all", label: "All Status" },
//       { id: "active", label: "Active" },
//       { id: "completed", label: "Completed" },
//       { id: "upcoming", label: "Upcoming" },
//     ],
//     category: [
//       { id: "all", label: "All Categories" },
//       { id: "agriculture", label: "Agriculture" },
//       { id: "education", label: "Education" },
//       { id: "health", label: "Health" },
//       { id: "water", label: "Water & Sanitation" },
//       { id: "ai", label: "AI & Innovation" },
//       { id: "community", label: "Community Development" },
//     ],
//   };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await projectsAPI.getAll();
//         console.log("Projects API Response:", response);
//         setProjects(response?.data || response || []);
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//         setError(err.message || "Failed to fetch projects.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Helper functions for colors
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800";
//       case "completed":
//         return "bg-blue-100 text-blue-800";
//       case "upcoming":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getCategoryColor = (category) => {
//     switch (category) {
//       case "agriculture":
//         return "bg-emerald-100 text-emerald-800";
//       case "education":
//         return "bg-blue-100 text-blue-800";
//       case "health":
//         return "bg-red-100 text-red-800";
//       case "water":
//         return "bg-cyan-100 text-cyan-800";
//       case "ai":
//         return "bg-purple-100 text-purple-800";
//       case "community":
//         return "bg-orange-100 text-orange-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const filteredProjects = projects.filter((project) => {
//     const matchesSearch =
//       (project.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (project.description || "")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       selectedStatus === "all" || project.status === selectedStatus;
//     const matchesCategory =
//       selectedCategory === "all" || project.category === selectedCategory;
//     return matchesSearch && matchesStatus && matchesCategory;
//   });

//   // Calculate total beneficiaries safely
//   const totalBeneficiaries = projects.reduce((sum, p) => {
//     return sum + (parseInt(p.beneficiaries) || 0);
//   }, 0);

//   return (
//     <>
//       <Helmet>
//         <title>Projects - Matakiri Tumaini Centre</title>
//         <meta
//           name="description"
//           content="Explore our community development projects and their impact in Kisumu County"
//         />
//       </Helmet>

//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="max-w-3xl mx-auto text-center"
//           >
//             <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
//               Our Projects
//             </h1>
//             <p className="text-xl text-primary-100 mb-8">
//               Transforming communities through innovative and sustainable
//               development projects
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Search and Filters */}
//       <section className="py-8 bg-gray-50">
//         <div className="container mx-auto px-4">
//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative max-w-2xl mx-auto">
//               <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search projects by title or description..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
//               />
//             </div>
//           </div>

//           {/* Filter Controls */}
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="flex items-center">
//               <FaFilter className="text-gray-600 mr-2" />
//               <span className="font-medium text-gray-700">Filter by:</span>
//             </div>

//             <div className="flex flex-wrap gap-4">
//               <div>
//                 <select
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
//                 >
//                   {filters.status.map((filter) => (
//                     <option key={filter.id} value={filter.id}>
//                       {filter.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
//                 >
//                   {filters.category.map((filter) => (
//                     <option key={filter.id} value={filter.id}>
//                       {filter.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSelectedStatus("all");
//                   setSelectedCategory("all");
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Overview */}
//       <section className="py-12 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary-600 mb-2">
//                 {projects.length}
//               </div>
//               <div className="text-gray-600">Total Projects</div>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary-600 mb-2">
//                 {projects.filter((p) => p.status === "active").length}
//               </div>
//               <div className="text-gray-600">Active Projects</div>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary-600 mb-2">
//                 {totalBeneficiaries.toLocaleString()}+
//               </div>
//               <div className="text-gray-600">Total Beneficiaries</div>
//             </div>
//             <div className="text-center">
//               <div className="text-4xl font-bold text-primary-600 mb-2">
//                 $1.38M
//               </div>
//               <div className="text-gray-600">Total Investment</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Projects Grid */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//             </div>
//           ) : error ? (
//             <div className="text-center py-16">
//               <div className="text-red-500 mb-4">{error}</div>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//               >
//                 Retry
//               </button>
//             </div>
//           ) : filteredProjects.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-16"
//             >
//               <div className="text-6xl text-gray-300 mb-4">🔍</div>
//               <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                 No projects found matching your criteria
//               </h3>
//               <p className="text-gray-500">
//                 Try adjusting your search or filters
//               </p>
//             </motion.div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {filteredProjects.map((project, index) => (
//                 <motion.div
//                   key={project._id || project.id || index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   whileHover={{ y: -5 }}
//                   className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
//                 >
//                   {/* Project Image */}
//                   <div className="relative h-48 overflow-hidden">
//                     <img
//                       src={
//                         project.image ||
//                         project.imageUrl ||
//                         "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//                       }
//                       alt={project.title}
//                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                       onError={(e) => {
//                         e.target.src =
//                           "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
//                       }}
//                     />
//                     <div className="absolute top-4 right-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                           project.status
//                         )}`}
//                       >
//                         {project.status
//                           ? project.status.charAt(0).toUpperCase() +
//                             project.status.slice(1)
//                           : "Unknown"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Project Details */}
//                   <div className="p-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
//                           project.category
//                         )}`}
//                       >
//                         {filters.category.find((c) => c.id === project.category)
//                           ?.label ||
//                           project.category ||
//                           "General"}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         {project.budget
//                           ? typeof project.budget === "object"
//                             ? `${project.budget.currency || "KSH"} ${(
//                                 project.budget.estimated || 0
//                               ).toLocaleString()}`
//                             : project.budget
//                           : "Budget not specified"}
//                       </span>
//                     </div>

//                     <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
//                       {project.title || "Untitled Project"}
//                     </h3>

//                     <p className="text-gray-600 mb-4 line-clamp-3">
//                       {project.description || "No description available."}
//                     </p>

//                     {/* Project Stats */}
//                     <div className="grid grid-cols-3 gap-4 mb-6">
//                       <div className="text-center">
//                         <div className="flex items-center justify-center text-gray-600 mb-1">
//                           <FaUsers className="mr-1" />
//                         </div>
//                         <div className="font-semibold text-gray-800">
//                           {(project.beneficiaries || 0).toLocaleString()}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           Beneficiaries
//                         </div>
//                       </div>

//                       <div className="text-center">
//                         <div className="flex items-center justify-center text-gray-600 mb-1">
//                           <FaCalendarAlt className="mr-1" />
//                         </div>
//                         <div className="font-semibold text-gray-800">
//                           {project.startDate
//                             ? new Date(project.startDate).getFullYear()
//                             : "N/A"}
//                         </div>
//                         <div className="text-xs text-gray-500">Start Year</div>
//                       </div>

//                       <div className="text-center">
//                         <div className="flex items-center justify-center text-gray-600 mb-1">
//                           <FaChartBar className="mr-1" />
//                         </div>
//                         <div className="font-semibold text-gray-800 text-sm">
//                           {project.impact
//                             ? project.impact.split(" ")[0]
//                             : "N/A"}
//                         </div>
//                         <div className="text-xs text-gray-500">Impact</div>
//                       </div>
//                     </div>

//                     {/* Location & Partners */}
//                     <div className="space-y-3 mb-6">
//                       {project.location && (
//                         <div className="flex items-center text-gray-600">
//                           <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
//                           <span className="text-sm truncate">
//                             {project.location}
//                           </span>
//                         </div>
//                       )}

//                       {project.partners && project.partners.length > 0 && (
//                         <div>
//                           <div className="text-sm font-medium text-gray-700 mb-1">
//                             Partners:
//                           </div>
//                           <div className="flex flex-wrap gap-2">
//                             {project.partners
//                               .slice(0, 2)
//                               .map((partner, idx) => (
//                                 <span
//                                   key={idx}
//                                   className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs truncate max-w-[120px]"
//                                 >
//                                   {typeof partner === "object"
//                                     ? partner.name
//                                     : partner}
//                                 </span>
//                               ))}
//                             {project.partners.length > 2 && (
//                               <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
//                                 +{project.partners.length - 2} more
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Action Button */}
//                   {/* <div className="px-6 py-4 bg-gray-50 border-t">
//                     <button
//                       onClick={() => {
//                         // You can implement navigation to project details
//                         console.log("View project:", project._id || project.id);
//                       }}
//                       className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
//                     >
//                       View Project Details
//                       <FaExternalLinkAlt className="ml-2" />
//                     </button>
//                   </div> */}
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Project Impact Stories */}
//       <section className="py-16 bg-gradient-to-r from-primary-50 to-primary-100">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
//               Project Impact Stories
//             </h2>
//             <p className="text-gray-600 max-w-3xl mx-auto">
//               Real stories of transformation and positive change from our
//               project communities.
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {[
//               {
//                 title: "From Subsistence to Smart Farming",
//                 project: "Smart Agriculture Mobile App",
//                 story:
//                   "John Omondi, a farmer from Kisumu, increased his maize yield by 40% using our AI-powered farming recommendations.",
//                 image:
//                   "https://images.unsplash.com/photo-1556779144-5b10c6c6d6f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//               },
//               {
//                 title: "Digital Literacy Transforms Learning",
//                 project: "Digital Learning Centers",
//                 story:
//                   "St. Mary's Primary School students now access global educational resources, improving their computer skills by 75%.",
//                 image:
//                   "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//               },
//             ].map((story, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-white rounded-xl shadow-lg overflow-hidden"
//               >
//                 <div className="h-48 overflow-hidden">
//                   <img
//                     src={story.image}
//                     alt={story.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-800 mb-2">
//                     {story.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4">{story.story}</p>
//                   <div className="text-sm text-primary-600 font-medium">
//                     Project: {story.project}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
//             <h2 className="text-2xl font-bold font-display mb-4">
//               Support Our Projects
//             </h2>
//             <p className="mb-6 text-primary-100">
//               Your contribution helps us expand our impact and reach more
//               communities in need.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button className="px-8 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
//                 Donate to Projects
//               </button>
//               <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
//                 Become a Project Partner
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Projects;
