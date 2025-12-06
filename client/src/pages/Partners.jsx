import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaHandshake, FaGlobe, FaUniversity, FaIndustry, FaLeaf, FaHeart } from 'react-icons/fa';

const Partners = () => {
  const partnerTypes = [
    {
      id: 'corporate',
      name: 'Corporate Partners',
      icon: <FaIndustry />,
      description: 'Business organizations supporting our initiatives',
      count: 8
    },
    {
      id: 'ngo',
      name: 'NGO Partners',
      icon: <FaGlobe />,
      description: 'Non-governmental organizations collaborating on projects',
      count: 12
    },
    {
      id: 'academic',
      name: 'Academic Institutions',
      icon: <FaUniversity />,
      description: 'Universities and research centers',
      count: 6
    },
    {
      id: 'government',
      name: 'Government Agencies',
      icon: <FaLeaf />,
      description: 'Local and national government bodies',
      count: 4
    },
    {
      id: 'community',
      name: 'Community Organizations',
      icon: <FaHeart />,
      description: 'Local community-based organizations',
      count: 15
    }
  ];

  const partners = [
    {
      id: 1,
      name: 'Tech for Good Foundation',
      type: 'corporate',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Providing technology infrastructure and AI expertise',
      partnership: 'Since 2019',
      focus: 'AI Innovation, Technology'
    },
    {
      id: 2,
      name: 'University of Nairobi',
      type: 'academic',
      logo: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Research collaboration and student internship programs',
      partnership: 'Since 2018',
      focus: 'Research, Education'
    },
    {
      id: 3,
      name: 'Kenya Ministry of Health',
      type: 'government',
      logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Public health initiatives and community healthcare',
      partnership: 'Since 2017',
      focus: 'Healthcare, Public Policy'
    },
    {
      id: 4,
      name: 'Green Earth Alliance',
      type: 'ngo',
      logo: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Environmental conservation and sustainable agriculture',
      partnership: 'Since 2020',
      focus: 'Environment, Agriculture'
    },
    {
      id: 5,
      name: 'Safaricom Foundation',
      type: 'corporate',
      logo: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Digital innovation and community development funding',
      partnership: 'Since 2016',
      focus: 'Technology, Funding'
    },
    {
      id: 6,
      name: 'UNICEF Kenya',
      type: 'ngo',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Child welfare and education programs',
      partnership: 'Since 2015',
      focus: 'Child Welfare, Education'
    },
    {
      id: 7,
      name: 'IBM Research Africa',
      type: 'corporate',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'AI research and development partnership',
      partnership: 'Since 2021',
      focus: 'AI Research, Innovation'
    },
    {
      id: 8,
      name: 'Matakiri Community Council',
      type: 'community',
      logo: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      description: 'Local community leadership and coordination',
      partnership: 'Since 2010',
      focus: 'Community Development'
    }
  ];

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
                    <div className="text-xl">
                      {type.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{type.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{type.description}</p>
                  <div className="text-primary-600 font-bold">{type.count} Partners</div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  {/* Logo */}
                  <div className="h-40 bg-gray-50 flex items-center justify-center p-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {partner.name}
                    </h3>
                    
                    <div className="flex items-center mb-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded mr-2">
                        {partnerTypes.find(t => t.id === partner.type)?.name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-600 rounded">
                        {partner.partnership}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {partner.description}
                    </p>

                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-700 font-medium mb-1">
                        Focus Areas:
                      </div>
                      <p className="text-sm text-gray-600">
                        {partner.focus}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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