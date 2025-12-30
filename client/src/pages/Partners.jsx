import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  FaHandshake,
  FaSearch,
  FaTimes,
  FaBuilding,
  FaGlobe,
  FaUniversity,
  FaLeaf,
  FaUsers,
  FaChartLine,
  FaQuoteLeft,
  FaStar
} from 'react-icons/fa';
import { partnersAPI } from '../services/api';

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Partner categories
  const partnerTypes = [
    { id: "all", name: "All Partners", icon: <FaHandshake />, color: "from-primary-500 to-accent-500" },
    { id: "corporate", name: "Corporate", icon: <FaBuilding />, color: "from-blue-500 to-cyan-500" },
    { id: "ngo", name: "NGO", icon: <FaGlobe />, color: "from-emerald-500 to-teal-500" },
    { id: "academic", name: "Academic", icon: <FaUniversity />, color: "from-purple-500 to-violet-500" },
    { id: "government", name: "Government", icon: <FaLeaf />, color: "from-green-500 to-emerald-500" },
    { id: "community", name: "Community", icon: <FaUsers />, color: "from-rose-500 to-pink-500" },
  ];

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await partnersAPI.getAll();
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

  // Filter partners based on selected type and search
  const filteredPartners = partners.filter(partner => {
    const matchesType = selectedType === 'all' || partner.type === selectedType;
    const matchesSearch = !searchTerm || 
      partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate type counts
  const typeCounts = partnerTypes.reduce((acc, type) => {
    acc[type.id] = type.id === 'all' 
      ? partners.length 
      : partners.filter(p => p.type === type.id).length;
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Partners - Matakiri Tumaini Centre</title>
        <meta name="description" content="Our valued partners who support our mission of community development through innovation and collaboration." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 md:py-24 overflow-hidden">
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
              <span className="text-sm font-semibold tracking-wider">Strategic Partners</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Our <span className="text-accent-300">Partners</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Together with our partners, we're building stronger communities through collaboration and innovation.
            </p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {partners.length}
                </div>
                <div className="text-sm text-primary-200">Partners</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partners Grid - Logos Only */}
      <section className="py-12 bg-gray-50 min-h-[60vh]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4"></div>
              <div className="text-lg text-gray-600">Loading partners...</div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <div className="text-2xl text-red-500">!</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to load partners</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Partner <span className="text-primary-600">Network</span>
                </h2>
                <p className="text-gray-600">
                  Showing {partners.length} partners
                </p>
              </div>

              {/* Logos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {partners.map((partner, index) => (
                  <motion.div
                    key={partner._id || partner.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 h-full flex flex-col items-center justify-center min-h-[180px] border border-gray-100">
                      {/* Partner Logo */}
                      <div className="relative w-full h-32 flex items-center justify-center mb-4">
                        <img
                          src={
                            partner.logo ||
                            partner.image ||
                            "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          }
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/assets/images/default-logo.png';
                          }}
                        />
                      </div>
                      
                      {/* Partner Name - Always visible */}
                      <div className="text-center mt-2 opacity-100 transition-opacity duration-300">
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                          {partner.name || "Partner"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {partner.type?.charAt(0).toUpperCase() + partner.type?.slice(1) || "Partner"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <FaQuoteLeft className="text-3xl text-primary-500" />
              <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
                Partner Voices
              </span>
              <FaQuoteLeft className="text-3xl text-primary-500 rotate-180" />
            </div>
            
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
              What Our <span className="text-primary-600">Partners Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Collaborating with Matakiri Tumaini has allowed us to make a real difference in communities across Kenya.",
                author: "Jane Mwangi",
                role: "Tech for Good Foundation",
                rating: 5
              },
              {
                quote: "Their innovative approach to community development is exactly what our region needs.",
                author: "Prof. David Ochieng",
                role: "University of Nairobi",
                rating: 5
              },
              {
                quote: "A reliable partner that truly understands and serves the community's needs.",
                author: "Sarah Achieng",
                role: "Community Council",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-amber-400 w-5 h-5" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </p>
                <div className="pt-6 border-t border-gray-100">
                  <div className="font-bold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
              Want to <span className="text-primary-600">Partner</span> with Us?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our network of changemakers and help us expand our impact across communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl">
                Become a Partner
              </button>
              <button className="px-8 py-4 bg-white text-primary-700 border-2 border-primary-500 rounded-xl font-bold hover:bg-primary-50 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;