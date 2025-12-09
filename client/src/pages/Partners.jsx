import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaHandshake, FaGlobe, FaUniversity, FaIndustry, FaLeaf, FaHeart } from 'react-icons/fa';
import { partnersAPI } from '../services/api';
import PartnerCard from '../components/shared/PartnerCard';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Optionally, you can fetch partner types from backend if available, else keep static
  const partnerTypes = [
    { id: 'corporate', name: 'Corporate Partners', icon: <FaIndustry /> },
    { id: 'ngo', name: 'NGO Partners', icon: <FaGlobe /> },
    { id: 'academic', name: 'Academic Institutions', icon: <FaUniversity /> },
    { id: 'government', name: 'Government Agencies', icon: <FaLeaf /> },
    { id: 'community', name: 'Community Organizations', icon: <FaHeart /> },
  ];

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await partnersAPI.getAll();
        setPartners(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch partners.');
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  // Count partners by type for display
  const typeCounts = partnerTypes.reduce((acc, type) => {
    acc[type.id] = partners.filter(p => p.type === type.id).length;
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Partners & Sponsors - Matakiri Tumaini Centre</title>
        <meta name="description" content="Meet our valued partners and sponsors who support our mission of community development through innovation." />
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
                <FaHandshake className="text-3xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
                Our Partners & Sponsors
              </h1>
              <p className="text-xl text-gray-200">
                Building stronger communities through collaborative partnerships and shared vision.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Partnership Impact */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                The Power of Partnership
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our collaborations amplify our impact, bringing together diverse expertise, 
                resources, and perspectives to create sustainable solutions for community development.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary-600 mb-2">45+</div>
                <div className="text-gray-700 font-medium">Active Partnerships</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary-600 mb-2">$2.5M+</div>
                <div className="text-gray-700 font-medium">Combined Investment</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary-600 mb-2">12</div>
                <div className="text-gray-700 font-medium">Years of Collaboration</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Types of Partnerships</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {partnerTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <div className="text-xl">{type.icon}</div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{type.name}</h3>
                  <div className="text-primary-600 font-bold">{typeCounts[type.id] || 0} Partners</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                Featured Partners
              </h2>
              <p className="text-gray-600 max-w-3xl">
                These organizations play a crucial role in our mission, providing support through 
                funding, expertise, resources, and collaboration.
              </p>
            </motion.div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {partners.map((partner, index) => (
                  <PartnerCard key={partner._id || partner.id || index} partner={partner} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Become a Partner */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold font-display mb-6">
                Join Our Network of Changemakers
              </h2>
              <p className="text-xl mb-8 text-primary-100">
                Partner with us to create lasting impact in communities across Kenya.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold mb-2">Funding</div>
                  <p className="text-primary-100">
                    Support specific projects or our general operations
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold mb-2">Expertise</div>
                  <p className="text-primary-100">
                    Share your knowledge and skills in specialized areas
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold mb-2">Resources</div>
                  <p className="text-primary-100">
                    Provide equipment, facilities, or other essential resources
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Download Partnership Proposal
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Contact Partnership Team
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              What Our Partners Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Working with Matakiri Tumaini has been transformative. Their community-focused approach ensures our investments create real, measurable impact.",
                  author: "Jane Mwangi",
                  role: "Director, Tech for Good Foundation",
                  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                  quote: "The innovative use of AI in community development sets Matakiri apart. Their projects are not just sustainable but scalable.",
                  author: "Prof. David Ochieng",
                  role: "University of Nairobi",
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                },
                {
                  quote: "As a community organization, we've seen firsthand how their projects empower local people and create lasting change.",
                  author: "Sarah Achieng",
                  role: "Matakiri Community Council",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="text-gray-600 italic mb-6">
                    "{testimonial.quote}"
                  </div>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.author}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
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

export default Partners;