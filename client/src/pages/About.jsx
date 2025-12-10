import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaBrain, 
  FaHandsHelping, 
  FaLightbulb,
  FaSeedling,
  FaUsers,
  FaGlobeAfrica,
  FaHeart,
  FaChartLine
} from 'react-icons/fa';

const About = () => {
  const values = [
    {
      icon: <FaHandsHelping />,
      title: "Community First",
      description: "Local needs drive our AI solutions"
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      description: "Cutting-edge tech for traditional problems"
    },
    {
      icon: <FaSeedling />,
      title: "Sustainability",
      description: "Solutions that grow with communities"
    },
    {
      icon: <FaUsers />,
      title: "Collaboration",
      description: "Partnerships for maximum impact"
    }
  ];

  const initiatives = [
    {
      title: "Smart Agriculture",
      description: "AI crop monitoring for small-scale farmers",
      icon: <FaSeedling />
    },
    {
      title: "Healthcare Analytics",
      description: "Predictive models for rural clinics",
      icon: <FaHeart />
    },
    {
      title: "Education Tech",
      description: "Personalized learning platforms",
      icon: <FaUsers />
    },
    {
      title: "Environmental AI",
      description: "Satellite analysis for conservation",
      icon: <FaGlobeAfrica />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center mb-6">
              <div className="w-12 h-0.5 bg-emerald-300 mr-3"></div>
              <span className="text-sm font-medium text-emerald-600 tracking-wider">ABOUT US</span>
              <div className="w-12 h-0.5 bg-emerald-300 ml-3"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Where <span className="font-medium text-emerald-700">Humanitarian Work</span><br />
              Meets <span className="font-medium text-emerald-600">AI Innovation</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Matakiri Tumaini Centre empowers marginalized communities in Kenya through 
              ethical AI applications, creating sustainable solutions while preserving cultural heritage.
            </p>
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded"></div>
                </div>
                <h2 className="text-2xl font-medium text-gray-900">Our Mission</h2>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                We develop and deploy artificial intelligence solutions that directly address the most pressing 
                challenges faced by marginalized communities in Kenya and across East Africa.
              </p>
              
              <div className="pt-6 border-t border-gray-100">
                <div className="text-sm text-emerald-600 font-medium">Empowerment through technology</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded"></div>
                </div>
                <h2 className="text-2xl font-medium text-gray-900">Our Vision</h2>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                We envision a world where artificial intelligence is not a luxury but a fundamental tool 
                for sustainable development, accessible to all communities regardless of their location or resources.
              </p>
              
              <div className="pt-6 border-t border-gray-100">
                <div className="text-sm text-emerald-600 font-medium">AI for everyone, everywhere</div>
              </div>
            </motion.div>
          </div>

          {/* AI Initiatives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center mb-4">
                <FaBrain className="text-emerald-400 mr-2" />
                <span className="text-sm font-medium text-emerald-600 tracking-wider">AI FOR SOCIAL GOOD</span>
                <FaChartLine className="text-emerald-400 ml-2" />
              </div>
              
              <h2 className="text-2xl font-medium text-gray-900 mb-4">
                Our AI Initiatives
              </h2>
              
              <p className="text-gray-600 max-w-2xl mx-auto">
                Leveraging artificial intelligence to create measurable impact across key sectors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {initiatives.map((initiative, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-emerald-200 transition-colors duration-300">
                    <div className="mb-4">
                      <div className="inline-flex p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors duration-300">
                        <div className="text-emerald-600">
                          {initiative.icon}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {initiative.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600">
                      {initiative.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-emerald-100 transition-colors">
                      <div className="text-xs text-emerald-500 font-medium">Learn more →</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center mb-4">
                <div className="w-8 h-0.5 bg-emerald-300"></div>
                <span className="mx-3 text-sm font-medium text-emerald-600 tracking-wider">OUR VALUES</span>
                <div className="w-8 h-0.5 bg-emerald-300"></div>
              </div>
              
              <h2 className="text-2xl font-medium text-gray-900 mb-4">
                Guiding Principles
              </h2>
              
              <p className="text-gray-600 max-w-2xl mx-auto">
                The foundation of everything we do.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-300">
                    <div className="mb-4">
                      <div className="inline-flex p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
                        <div className="text-emerald-600">
                          {value.icon}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600">
                      {value.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs text-emerald-500">Core value</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Impact Statement */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12"
          >
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center mb-6">
                <div className="w-6 h-6 bg-emerald-400 rounded-full mr-3"></div>
                <div className="w-6 h-6 bg-emerald-500 rounded-full mr-3"></div>
                <div className="w-6 h-6 bg-emerald-600 rounded-full"></div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
                Building a future where <span className="font-medium text-emerald-700">technology serves humanity</span>
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Through ethical AI and community-centered design, we're creating tools that don't just solve problems—they empower people to build their own futures.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                  Explore Our Work
                </button>
                <button className="px-6 py-3 bg-white text-emerald-600 border border-emerald-200 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                  Partner With Us
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;