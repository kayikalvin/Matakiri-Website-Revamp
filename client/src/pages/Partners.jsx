import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  FaHandshake,
  FaFilter,
  FaSearch,
  FaGlobe,
  FaUniversity,
  FaIndustry,
  FaLeaf,
  FaHeart,
  FaStar,
  FaArrowRight,
  FaDownload,
  FaQuoteLeft,
  FaTimes,
  FaBuilding,
  FaUsers,
  FaChartLine,
  FaCheckCircle,
  FaLightbulb,
  FaHandsHelping
} from 'react-icons/fa';
import { partnersAPI } from '../services/api';
import PartnerCard from '../components/shared/PartnerCard';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';

// Define partnerTypes at the module level so all components can access it
const partnerTypes = [
  { id: "all", name: "All Partners", icon: <FaHandsHelping />, color: "from-primary-500 to-accent-500" },
  { id: "corporate", name: "Corporate", icon: <FaBuilding />, color: "from-blue-500 to-cyan-500" },
  { id: "ngo", name: "NGO Partners", icon: <FaGlobe />, color: "from-emerald-500 to-teal-500" },
  { id: "academic", name: "Academic", icon: <FaUniversity />, color: "from-purple-500 to-violet-500" },
  { id: "government", name: "Government", icon: <FaLeaf />, color: "from-green-500 to-emerald-500" },
  { id: "community", name: "Community", icon: <FaUsers />, color: "from-rose-500 to-pink-500" },
];

// Helper functions that all components need
const getTypeColor = (type) => {
  switch (type) {
    case "corporate":
      return "from-blue-500 to-cyan-500";
    case "ngo":
      return "from-emerald-500 to-teal-500";
    case "academic":
      return "from-purple-500 to-violet-500";
    case "government":
      return "from-green-500 to-emerald-500";
    case "community":
      return "from-rose-500 to-pink-500";
    default:
      return "from-primary-500 to-accent-500";
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case "corporate":
      return <FaBuilding />;
    case "ngo":
      return <FaGlobe />;
    case "academic":
      return <FaUniversity />;
    case "government":
      return <FaLeaf />;
    case "community":
      return <FaUsers />;
    default:
      return <FaHandshake />;
  }
};

// Partner Card Component for Grid View
const PartnerGridCard = ({ partner, index }) => {
  const partnerType = partnerTypes.find(t => t.id === partner.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 h-full">
        {/* Partner Logo/Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={
              partner.logo ||
              partner.image ||
              "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
            alt={partner.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Type Badge */}
          <div className="absolute top-4 right-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(partner.type)}`}>
              <div className="text-white text-xl">
                {getTypeIcon(partner.type)}
              </div>
            </div>
          </div>
          
          {/* Partnership Duration */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
              {partner.years || "2+"} Years
            </span>
          </div>
        </div>

        {/* Partner Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTypeColor(partner.type)} bg-opacity-10 text-gray-800`}>
              {partnerType?.name || "Partner"}
            </span>
            <span className="text-sm font-medium text-gray-500">
              Since {partner.startDate ? new Date(partner.startDate).getFullYear() : "2020"}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {partner.name || "Partner Organization"}
          </h3>

          <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
            {partner.description || partner.about || "Leading organization in community development."}
          </p>

          {/* Partner Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {partner.projects || 3}
              </div>
              <div className="text-xs text-gray-500">Joint Projects</div>
            </div> */}
            
            {/* <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ${(partner.investment || 500000).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Investment</div>
            </div> */}
          </div>

          {/* Location */}
          {partner.location && (
            <div className="flex items-center text-gray-600 mb-4">
              <FaGlobe className="mr-2 flex-shrink-0" />
              <span className="text-sm truncate">{partner.location}</span>
            </div>
          )}

          {/* Focus Areas */}
          {partner.focusAreas && (
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-500 mb-2">Focus Areas</div>
              <div className="flex flex-wrap gap-2">
                {partner.focusAreas.slice(0, 3).map((area, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {area}
                  </span>
                ))}
                {partner.focusAreas.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{partner.focusAreas.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          {/* <button className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 group">
            View Partnership Details
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button> */}
        </div>
      </div>
    </motion.div>
  );
};

// Partner Card Component for List View
const PartnerListCard = ({ partner, index }) => {
  const partnerType = partnerTypes.find(t => t.id === partner.type);

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
                partner.logo ||
                partner.image ||
                "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              }
              alt={partner.name}
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getTypeColor(partner.type)} text-white`}>
                {partnerType?.name || "Partner"}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-2/3 p-8">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {partner.name || "Partner Organization"}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {partner.description || partner.about || "Leading organization collaborating on community development initiatives."}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaChartLine className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      ${(partner.investment || 500000).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Investment</div>
                  </div>
                </div> */}
                
                {/* <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaHandsHelping className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {partner.projects || 3}
                    </div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                </div> */}
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaGlobe className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm truncate">
                      {partner.location || "Global"}
                    </div>
                    <div className="text-xs text-gray-500">Location</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FaCheckCircle className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {partner.years || "2+"}
                    </div>
                    <div className="text-xs text-gray-500">Years</div>
                  </div>
                </div>
              </div>

              {/* Focus Areas */}
              {partner.focusAreas && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Focus Areas:</div>
                  <div className="flex flex-wrap gap-2">
                    {partner.focusAreas.map((area, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-gray-100">
                <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all flex items-center gap-2 group">
                  View Partnership Details
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

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await partnersAPI.getAll();
        console.log("Partners API Response:", response);
        setPartners(response?.data || response || []);
      } catch (err) {
        console.error("Error fetching partners:", err);
        setError(err.message || "Failed to fetch partners.");
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  // Update active filters
  useEffect(() => {
    const filters = [];
    if (selectedType !== "all") {
      const typeFilter = partnerTypes.find(t => t.id === selectedType);
      filters.push({ type: "partnerType", label: typeFilter?.name || selectedType });
    }
    if (searchTerm) {
      filters.push({ type: "search", label: `Search: "${searchTerm}"` });
    }
    setActiveFilters(filters);
  }, [selectedType, searchTerm]);

  const typeCounts = partnerTypes.reduce((acc, type) => {
    acc[type.id] = type.id === 'all' ? partners.length : partners.filter(p => p.type === type.id).length;
    return acc;
  }, {});

  const filteredPartners = selectedType === 'all' 
    ? partners 
    : partners.filter(partner => partner.type === selectedType);

  const removeFilter = (filterType) => {
    switch (filterType) {
      case "partnerType":
        setSelectedType("all");
        break;
      case "search":
        setSearchTerm("");
        break;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
  };

  // Calculate statistics
  const stats = {
    totalPartners: partners.length,
    totalInvestment: 2500000,
    communitiesReached: 150,
    successRate: 85
  };

  return (
    <>
      <Helmet>
        <title>Partners & Sponsors - Matakiri Tumaini Centre</title>
        <meta name="description" content="Meet our valued partners and sponsors who support our mission of community development through innovation and collaboration." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24 md:py-8 overflow-hidden">
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
              <FaHandshake className="text-white/90" />
              <span className="text-sm font-semibold tracking-wider">Strategic Collaboration</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6 leading-tight">
              Our <span className="text-accent-300">Partners</span>
            </h1>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Building stronger communities through collaborative partnerships, shared expertise, 
              and collective impact across Kenya.
            </p>
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {[
                { value: stats.totalPartners, label: "Total Partners", color: "from-primary-400 to-accent-400" },
                { value: `$${(stats.totalInvestment / 1000000).toFixed(1)}M+`, label: "Combined Investment", color: "from-green-400 to-emerald-400" },
                { value: `${stats.communitiesReached}+`, label: "Communities Reached", color: "from-blue-400 to-cyan-400" },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Search and Filter Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search partners, sectors, or keywords..."
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

            {/* Filter Controls */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaFilter className="text-primary-500" />
                    <span>Filter Partners</span>
                  </div>
                  
                  {/* Partner Type Pills */}
                  <div className="flex flex-wrap gap-2">
                    {partnerTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedType === type.id
                            ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {type.icon}
                        {type.name}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          selectedType === type.id
                            ? 'bg-white/20'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {typeCounts[type.id] || 0}
                        </span>
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
                Showing <span className="font-bold">{filteredPartners.length}</span> of{" "}
                <span className="font-bold">{partners.length}</span> partners
              </div>
              <div className="text-sm text-gray-500">
                Combined Impact: <span className="font-bold text-primary-600">
                  ${(stats.totalInvestment / 1000000).toFixed(1)}M+ invested
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Display Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaHandshake className="text-primary-500 text-xl animate-pulse" />
                </div>
              </div>
              <div className="mt-6 text-lg text-gray-600 font-medium">Loading partner network...</div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <div className="text-3xl text-red-500">!</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to load partners</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredPartners.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No partners found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any partners matching your search criteria. Try adjusting your filters or search term.
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
              {filteredPartners.map((partner, index) => (
                <PartnerGridCard key={partner._id || partner.id || index} partner={partner} index={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPartners.map((partner, index) => (
                <PartnerListCard key={partner._id || partner.id || index} partner={partner} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partnership Impact Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white">
              <FaChartLine className="text-primary-500" />
              <span className="text-sm font-semibold text-primary-700 tracking-wider">Collective Impact</span>
            </div>
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
              The Power of <span className="text-primary-600">Partnership</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our collaborative efforts are creating sustainable change across communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Strategic Funding",
                description: "Multi-year investments supporting innovation and scalability",
                stats: "$2.5M+",
                color: "from-emerald-500 to-green-500"
              },
              {
                title: "Expertise Sharing",
                description: "Technical knowledge transfer and capacity building",
                stats: "45+",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Resource Provision",
                description: "Equipment, facilities, and infrastructure support",
                stats: "85%",
                color: "from-purple-500 to-violet-500"
              },
              {
                title: "Community Reach",
                description: "Communities positively impacted through partnerships",
                stats: "150+",
                color: "from-cyan-500 to-blue-500"
              }
            ].map((item, index) => (
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
                  <div className={`h-3 bg-gradient-to-r ${item.color}`}></div>
                  <div className="p-8">
                    <div className="text-4xl font-bold text-gray-900 mb-4 group-hover:scale-110 transition-transform duration-500">
                      {item.stats}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Models */}
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
                    Become a Partner
                  </h2>
                  <p className="text-primary-100 mb-8 text-lg max-w-2xl">
                    Join our network of changemakers and help us expand our impact, 
                    launch new initiatives, and reach more communities in need.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        title: "Funding Partnership",
                        description: "Support specific projects or our general operations",
                        icon: <FaChartLine />
                      },
                      {
                        title: "Expertise Sharing",
                        description: "Share your knowledge and technical capabilities",
                        icon: <FaLightbulb />
                      },
                      {
                        title: "Resource Collaboration",
                        description: "Provide equipment, facilities, or volunteers",
                        icon: <FaHandsHelping />
                      }
                    ].map((model, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="text-2xl mb-4">{model.icon}</div>
                        <h4 className="font-bold mb-2">{model.title}</h4>
                        <p className="text-primary-100 text-sm">{model.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/contact">
                      <button className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                        <FaDownload />
                        Download Partnership Proposal
                      </button>
                    </Link>
                    <Link to="/contact">
                      <button className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
                        Contact Partnership Team
                        <FaArrowRight />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <FaQuoteLeft className="text-3xl text-primary-500" />
              <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
                Partner Testimonials
              </span>
              <FaQuoteLeft className="text-3xl text-primary-500 rotate-180" />
            </div>
            
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
              What Our <span className="text-primary-600">Partners Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from organizations who have partnered with us on transformative projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Working with Matakiri Tumaini has been transformative. Their community-focused approach ensures our investments create real, measurable impact.",
                author: "Jane Mwangi",
                role: "Director, Tech for Good Foundation",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                rating: 5
              },
              {
                quote: "The innovative use of AI in community development sets Matakiri apart. Their projects are not just sustainable but scalable across East Africa.",
                author: "Prof. David Ochieng",
                role: "University of Nairobi",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                rating: 5
              },
              {
                quote: "As a community organization, we've seen firsthand how their projects empower local people and create lasting change for generations.",
                author: "Sarah Achieng",
                role: "Matakiri Community Council",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-amber-400 w-5 h-5" />
                  ))}
                </div>
                <div className="text-gray-700 text-lg leading-relaxed mb-8 italic relative">
                  <FaQuoteLeft className="absolute -top-2 -left-2 text-gray-200 text-4xl -z-10" />
                  "{testimonial.quote}"
                </div>
                <div className="flex items-center pt-6 border-t border-gray-100">
                  <div className="relative">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-gray-50 group-hover:ring-primary-100 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <FaQuoteLeft className="text-white text-xs" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;