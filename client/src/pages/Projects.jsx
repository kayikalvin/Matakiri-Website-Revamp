import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaChartBar,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { projectsAPI } from "../services/api";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = {
    status: [
      { id: "all", label: "All Status" },
      { id: "active", label: "Active" },
      { id: "completed", label: "Completed" },
      { id: "upcoming", label: "Upcoming" },
    ],
    category: [
      { id: "all", label: "All Categories" },
      { id: "agriculture", label: "Agriculture" },
      { id: "education", label: "Education" },
      { id: "health", label: "Health" },
      { id: "water", label: "Water & Sanitation" },
      { id: "ai", label: "AI & Innovation" },
      { id: "community", label: "Community Development" },
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

  // Helper functions for colors
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "agriculture":
        return "bg-emerald-100 text-emerald-800";
      case "education":
        return "bg-blue-100 text-blue-800";
      case "health":
        return "bg-red-100 text-red-800";
      case "water":
        return "bg-cyan-100 text-cyan-800";
      case "ai":
        return "bg-purple-100 text-purple-800";
      case "community":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || project.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate total beneficiaries safely
  const totalBeneficiaries = projects.reduce((sum, p) => {
    return sum + (parseInt(p.beneficiaries) || 0);
  }, 0);

  return (
    <>
      <Helmet>
        <title>Projects - Matakiri Tumaini Centre</title>
        <meta
          name="description"
          content="Explore our community development projects and their impact in Kisumu County"
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Our Projects
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Transforming communities through innovative and sustainable
              development projects
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50">
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
                >
                  {filters.status.map((filter) => (
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none"
                >
                  {filters.category.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                  setSelectedCategory("all");
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
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {projects.length}
              </div>
              <div className="text-gray-600">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {projects.filter((p) => p.status === "active").length}
              </div>
              <div className="text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {totalBeneficiaries.toLocaleString()}+
              </div>
              <div className="text-gray-600">Total Beneficiaries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                $1.38M
              </div>
              <div className="text-gray-600">Total Investment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Retry
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
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
                  key={project._id || project.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        project.image ||
                        project.imageUrl ||
                        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status
                          ? project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)
                          : "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          project.category
                        )}`}
                      >
                        {filters.category.find((c) => c.id === project.category)
                          ?.label ||
                          project.category ||
                          "General"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {project.budget
                          ? typeof project.budget === "object"
                            ? `${project.budget.currency || "KSH"} ${(
                                project.budget.estimated || 0
                              ).toLocaleString()}`
                            : project.budget
                          : "Budget not specified"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {project.title || "Untitled Project"}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.description || "No description available."}
                    </p>

                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-gray-600 mb-1">
                          <FaUsers className="mr-1" />
                        </div>
                        <div className="font-semibold text-gray-800">
                          {(project.beneficiaries || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Beneficiaries
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center text-gray-600 mb-1">
                          <FaCalendarAlt className="mr-1" />
                        </div>
                        <div className="font-semibold text-gray-800">
                          {project.startDate
                            ? new Date(project.startDate).getFullYear()
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">Start Year</div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center text-gray-600 mb-1">
                          <FaChartBar className="mr-1" />
                        </div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {project.impact
                            ? project.impact.split(" ")[0]
                            : "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">Impact</div>
                      </div>
                    </div>

                    {/* Location & Partners */}
                    <div className="space-y-3 mb-6">
                      {project.location && (
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                          <span className="text-sm truncate">
                            {project.location}
                          </span>
                        </div>
                      )}

                      {project.partners && project.partners.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            Partners:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.partners
                              .slice(0, 2)
                              .map((partner, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs truncate max-w-[120px]"
                                >
                                  {typeof partner === "object"
                                    ? partner.name
                                    : partner}
                                </span>
                              ))}
                            {project.partners.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                +{project.partners.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <button
                      onClick={() => {
                        // You can implement navigation to project details
                        console.log("View project:", project._id || project.id);
                      }}
                      className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                    >
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
              Real stories of transformation and positive change from our
              project communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "From Subsistence to Smart Farming",
                project: "Smart Agriculture Mobile App",
                story:
                  "John Omondi, a farmer from Kisumu, increased his maize yield by 40% using our AI-powered farming recommendations.",
                image:
                  "https://images.unsplash.com/photo-1556779144-5b10c6c6d6f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Digital Literacy Transforms Learning",
                project: "Digital Learning Centers",
                story:
                  "St. Mary's Primary School students now access global educational resources, improving their computer skills by 75%.",
                image:
                  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              },
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
                  <p className="text-gray-600 mb-4">{story.story}</p>
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
              Your contribution helps us expand our impact and reach more
              communities in need.
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
    </>
  );
};

export default Projects;
