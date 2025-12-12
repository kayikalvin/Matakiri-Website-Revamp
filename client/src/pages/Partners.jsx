import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaHandshake, FaGlobe, FaUniversity, FaIndustry, FaLeaf, FaHeart, FaStar, FaArrowRight, FaDownload, FaQuoteLeft } from 'react-icons/fa';
import { partnersAPI } from '../services/api';
import PartnerCard from '../components/shared/PartnerCard';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const partnerTypes = [
    { id: 'all', name: 'All Partners', icon: <FaStar />, color: 'from-amber-500 to-amber-600' },
    { id: 'corporate', name: 'Corporate', icon: <FaIndustry />, color: 'from-blue-500 to-blue-600' },
    { id: 'ngo', name: 'NGO Partners', icon: <FaGlobe />, color: 'from-emerald-500 to-emerald-600' },
    { id: 'academic', name: 'Academic', icon: <FaUniversity />, color: 'from-purple-500 to-purple-600' },
    { id: 'government', name: 'Government', icon: <FaLeaf />, color: 'from-green-500 to-green-600' },
    { id: 'community', name: 'Community', icon: <FaHeart />, color: 'from-rose-500 to-rose-600' },
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

  const typeCounts = partnerTypes.reduce((acc, type) => {
    acc[type.id] = type.id === 'all' ? partners.length : partners.filter(p => p.type === type.id).length;
    return acc;
  }, {});

  const filteredPartners = activeFilter === 'all' 
    ? partners 
    : partners.filter(partner => partner.type === activeFilter);

  return (
    <>
      <Helmet>
        <title>Partners & Sponsors - Matakiri Tumaini Centre</title>
        <meta name="description" content="Meet our valued partners and sponsors who support our mission of community development through innovation." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white py-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8"
              >
                <FaHandshake className="text-4xl" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold font-display mb-6 leading-tight">
                Our <span className="bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent">Partners</span> & Sponsors
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Building stronger communities through collaborative partnerships and shared vision.
              </p>
              
              {/* <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 flex flex-wrap justify-center gap-6"
              >
                {[
                  { label: "Active Partnerships", value: "45+" },
                  { label: "Years of Collaboration", value: "12" },
                  { label: "Communities Reached", value: "150+" }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-primary-200">{stat.label}</div>
                  </div>
                ))}
              </motion.div> */}
            </motion.div>
          </div>
        </section>

        {/* Partnership Impact */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary-500" />
                <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider bg-primary-100 px-4 py-2 rounded-full">
                  Partnership Impact
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-primary-500" />
              </div>
              
              <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
                The <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">Power of Partnership</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Our collaborations amplify our impact, bringing together diverse expertise, 
                resources, and perspectives to create sustainable solutions for community development.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { value: "$2.5M+", label: "Combined Investment", desc: "In community projects" },
                { value: "45+", label: "Active Partners", desc: "Across 5 sectors" },
                { value: "150+", label: "Communities", desc: "Positively impacted" },
                { value: "85%", label: "Project Success", desc: "Rate across initiatives" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group text-center"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-500">
                    <div className="text-5xl font-bold text-primary-600 mb-3 group-hover:scale-110 transition-transform duration-500">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-gray-800 mb-2">{stat.label}</div>
                    <div className="text-sm text-gray-500">{stat.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Types Filter */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore <span className="text-primary-600">Partnership Types</span>
              </h2>
              <p className="text-gray-600 max-w-3xl">
                Filter and explore our network of partners across different sectors
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4 mb-12">
              {partnerTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(type.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeFilter === type.id
                      ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <div className={`${activeFilter === type.id ? 'text-white' : type.color.split(' ')[1].replace('from-', 'text-')}`}>
                    {type.icon}
                  </div>
                  <span>{type.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeFilter === type.id
                      ? 'bg-white/20'
                      : 'bg-gray-100'
                  }`}>
                    {typeCounts[type.id] || 0}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Partners Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-16"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  {activeFilter === 'all' ? 'All Partners' : partnerTypes.find(t => t.id === activeFilter)?.name}
                  <span className="text-primary-600 ml-2">({filteredPartners.length})</span>
                </h3>
              </div>

              {loading ? (
                <div className="py-20">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-2xl">
                  <div className="text-red-600 font-semibold mb-2">Error Loading Partners</div>
                  <p className="text-gray-600">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredPartners.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <div className="text-5xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Partners Found</h3>
                  <p className="text-gray-500">Try selecting a different filter category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredPartners.map((partner, index) => (
                    <motion.div
                      key={partner._id || partner.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      <PartnerCard partner={partner} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Become a Partner */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold font-display mb-8 text-white">
                  Join Our Network of <span className="text-amber-300">Changemakers</span>
                </h2>
                <p className="text-xl mb-12 text-primary-100 max-w-3xl mx-auto leading-relaxed">
                  Partner with us to create lasting impact in communities across Kenya and East Africa.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    title: "Funding Partnership",
                    description: "Support specific projects or our general operations with financial investment",
                    icon: "💰"
                  },
                  {
                    title: "Expertise Sharing",
                    description: "Share your knowledge and skills in specialized technical areas",
                    icon: "🎓"
                  },
                  {
                    title: "Resource Provision",
                    description: "Provide equipment, facilities, or other essential resources",
                    icon: "🛠️"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500"
                  >
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-primary-100">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <FaDownload />
                  Download Partnership Proposal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  Contact Partnership Team
                  <FaArrowRight />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
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

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-primary-900 to-primary-950">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Make a Difference Together?
              </h2>
              <p className="text-xl text-primary-200 mb-8">
                Let's collaborate to create sustainable impact in communities that need it most.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-amber-500/30 transition-all flex items-center gap-3 mx-auto"
              >
                Start Partnership Conversation
                <FaArrowRight />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Partners;












// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Helmet } from 'react-helmet-async';
// import { FaHandshake, FaGlobe, FaUniversity, FaIndustry, FaLeaf, FaHeart } from 'react-icons/fa';
// import { partnersAPI } from '../services/api';
// import PartnerCard from '../components/shared/PartnerCard';
// import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';

// const Partners = () => {
//   const [partners, setPartners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Optionally, you can fetch partner types from backend if available, else keep static
//   const partnerTypes = [
//     { id: 'corporate', name: 'Corporate Partners', icon: <FaIndustry /> },
//     { id: 'ngo', name: 'NGO Partners', icon: <FaGlobe /> },
//     { id: 'academic', name: 'Academic Institutions', icon: <FaUniversity /> },
//     { id: 'government', name: 'Government Agencies', icon: <FaLeaf /> },
//     { id: 'community', name: 'Community Organizations', icon: <FaHeart /> },
//   ];

//   useEffect(() => {
//     const fetchPartners = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await partnersAPI.getAll();
//         setPartners(response.data || []);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch partners.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPartners();
//   }, []);

//   // Count partners by type for display
//   const typeCounts = partnerTypes.reduce((acc, type) => {
//     acc[type.id] = partners.filter(p => p.type === type.id).length;
//     return acc;
//   }, {});

//   return (
//     <>
//       <Helmet>
//         <title>Partners & Sponsors - Matakiri Tumaini Centre</title>
//         <meta name="description" content="Meet our valued partners and sponsors who support our mission of community development through innovation." />
//       </Helmet>

//       <div className="min-h-screen bg-gray-50">
//         {/* Hero Section */}
//         <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
//           <div className="container mx-auto px-4">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center max-w-3xl mx-auto"
//             >
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
//                 <FaHandshake className="text-3xl" />
//               </div>
//               <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
//                 Our Partners & Sponsors
//               </h1>
//               <p className="text-xl text-gray-200">
//                 Building stronger communities through collaborative partnerships and shared vision.
//               </p>
//             </motion.div>
//           </div>
//         </section>

//         {/* Partnership Impact */}
//         <section className="py-16 bg-white">
//           <div className="container mx-auto px-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center mb-12"
//             >
//               <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
//                 The Power of Partnership
//               </h2>
//               <p className="text-gray-600 max-w-3xl mx-auto">
//                 Our collaborations amplify our impact, bringing together diverse expertise, 
//                 resources, and perspectives to create sustainable solutions for community development.
//               </p>
//             </motion.div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="text-center"
//               >
//                 <div className="text-5xl font-bold text-primary-600 mb-2">45+</div>
//                 <div className="text-gray-700 font-medium">Active Partnerships</div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="text-center"
//               >
//                 <div className="text-5xl font-bold text-primary-600 mb-2">$2.5M+</div>
//                 <div className="text-gray-700 font-medium">Combined Investment</div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-center"
//               >
//                 <div className="text-5xl font-bold text-primary-600 mb-2">12</div>
//                 <div className="text-gray-700 font-medium">Years of Collaboration</div>
//               </motion.div>
//             </div>
//           </div>
//         </section>

//         {/* Partner Types */}
//         <section className="py-16 bg-gray-50">
//           <div className="container mx-auto px-4">
//             <h2 className="text-2xl font-bold text-gray-800 mb-8">Types of Partnerships</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//               {partnerTypes.map((type, index) => (
//                 <motion.div
//                   key={type.id}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   whileHover={{ y: -5 }}
//                   className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
//                 >
//                   <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-full mb-4">
//                     <div className="text-xl">{type.icon}</div>
//                   </div>
//                   <h3 className="font-semibold text-gray-800 mb-2">{type.name}</h3>
//                   <div className="text-primary-600 font-bold">{typeCounts[type.id] || 0} Partners</div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Partners Grid */}
//         <section className="py-16 bg-white">
//           <div className="container mx-auto px-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="mb-12"
//             >
//               <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
//                 Featured Partners
//               </h2>
//               <p className="text-gray-600 max-w-3xl">
//                 These organizations play a crucial role in our mission, providing support through 
//                 funding, expertise, resources, and collaboration.
//               </p>
//             </motion.div>

//             {loading ? (
//               <LoadingSpinner />
//             ) : error ? (
//               <div className="text-center text-red-500 py-8">{error}</div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                 {partners.map((partner, index) => (
//                   <PartnerCard key={partner._id || partner.id || index} partner={partner} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Become a Partner */}
//         <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
//           <div className="container mx-auto px-4">
//             <div className="max-w-4xl mx-auto text-center">
//               <h2 className="text-3xl font-bold font-display mb-6">
//                 Join Our Network of Changemakers
//               </h2>
//               <p className="text-xl mb-8 text-primary-100">
//                 Partner with us to create lasting impact in communities across Kenya.
//               </p>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
//                   <div className="text-3xl font-bold mb-2">Funding</div>
//                   <p className="text-primary-100">
//                     Support specific projects or our general operations
//                   </p>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
//                   <div className="text-3xl font-bold mb-2">Expertise</div>
//                   <p className="text-primary-100">
//                     Share your knowledge and skills in specialized areas
//                   </p>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
//                   <div className="text-3xl font-bold mb-2">Resources</div>
//                   <p className="text-primary-100">
//                     Provide equipment, facilities, or other essential resources
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button className="px-8 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
//                   Download Partnership Proposal
//                 </button>
//                 <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
//                   Contact Partnership Team
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Testimonials */}
//         <section className="py-16 bg-gray-50">
//           <div className="container mx-auto px-4">
//             <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
//               What Our Partners Say
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {[
//                 {
//                   quote: "Working with Matakiri Tumaini has been transformative. Their community-focused approach ensures our investments create real, measurable impact.",
//                   author: "Jane Mwangi",
//                   role: "Director, Tech for Good Foundation",
//                   avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
//                 },
//                 {
//                   quote: "The innovative use of AI in community development sets Matakiri apart. Their projects are not just sustainable but scalable.",
//                   author: "Prof. David Ochieng",
//                   role: "University of Nairobi",
//                   avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
//                 },
//                 {
//                   quote: "As a community organization, we've seen firsthand how their projects empower local people and create lasting change.",
//                   author: "Sarah Achieng",
//                   role: "Matakiri Community Council",
//                   avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
//                 }
//               ].map((testimonial, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="bg-white rounded-xl shadow-md p-6"
//                 >
//                   <div className="text-gray-600 italic mb-6">
//                     "{testimonial.quote}"
//                   </div>
//                   <div className="flex items-center">
//                     <img
//                       src={testimonial.avatar}
//                       alt={testimonial.author}
//                       className="w-12 h-12 rounded-full mr-4"
//                     />
//                     <div>
//                       <div className="font-semibold text-gray-800">{testimonial.author}</div>
//                       <div className="text-gray-600 text-sm">{testimonial.role}</div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default Partners;