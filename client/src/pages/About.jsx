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
  FaChartLine,
  FaArrowRight
} from 'react-icons/fa';

const About = () => {
  const values = [
    {
      icon: <FaHandsHelping />,
      title: "Community First",
      description: "Local needs drive our AI solutions. We prioritize community input at every stage of development.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      description: "Cutting-edge technology applied to traditional problems with cultural sensitivity.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: <FaSeedling />,
      title: "Sustainability",
      description: "Solutions designed to grow and evolve with communities over generations.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaUsers />,
      title: "Collaboration",
      description: "Strategic partnerships that amplify impact and ensure long-term success.",
      color: "from-blue-500 to-blue-600"
    }
  ];

  const initiatives = [
    {
      title: "Smart Agriculture",
      description: "AI-powered crop monitoring and predictive analytics for small-scale farmers.",
      icon: <FaSeedling />,
      stats: "40% yield increase"
    },
    {
      title: "Healthcare Analytics",
      description: "Predictive models and diagnostic tools for rural healthcare facilities.",
      icon: <FaHeart />,
      stats: "15 clinics served"
    },
    {
      title: "Education Tech",
      description: "Personalized learning platforms using adaptive AI algorithms.",
      icon: <FaUsers />,
      stats: "2,500+ students"
    },
    {
      title: "Environmental AI",
      description: "Satellite imagery analysis for conservation and climate adaptation.",
      icon: <FaGlobeAfrica />,
      stats: "50K hectares monitored"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 tracking-wider uppercase px-4 py-2 bg-emerald-100 rounded-full">
                About Us
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-emerald-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
              Where <span className="font-bold text-emerald-800">Humanitarian Work</span>
              <br />
              Meets <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Innovation</span>
            </h1>
            
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
              Matakiri Tumaini Centre empowers marginalized communities in Kenya through 
              ethical AI applications, creating sustainable solutions while preserving cultural heritage.
            </p>
            
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-emerald-700">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Founded in Kenya</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-2 text-emerald-700">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">10+ AI Projects</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-2 text-emerald-700">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">5K+ Lives Impacted</span>
              </div>
            </div>
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-500 border border-emerald-100">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl group-hover:scale-110 transition-transform duration-500">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">M</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" />
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed text-lg mb-8">
                  We develop and deploy artificial intelligence solutions that directly address the most pressing 
                  challenges faced by marginalized communities in Kenya and across East Africa.
                </p>
                
                <div className="pt-6 border-t border-emerald-50">
                  <div className="inline-flex items-center text-emerald-700 font-medium">
                    <span>Empowerment through technology</span>
                    <FaArrowRight className="ml-2 text-sm" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg shadow-teal-100/50 hover:shadow-xl hover:shadow-teal-200/50 transition-all duration-500 border border-teal-100">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl group-hover:scale-110 transition-transform duration-500">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">V</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" />
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed text-lg mb-8">
                  We envision a world where artificial intelligence is not a luxury but a fundamental tool 
                  for sustainable development, accessible to all communities regardless of their location or resources.
                </p>
                
                <div className="pt-6 border-t border-teal-50">
                  <div className="inline-flex items-center text-teal-700 font-medium">
                    <span>AI for everyone, everywhere</span>
                    <FaArrowRight className="ml-2 text-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Initiatives */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-28"
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-4 mb-6">
                <FaBrain className="text-2xl text-emerald-500 animate-pulse" />
                <span className="text-sm font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100 px-4 py-2 rounded-full">
                  AI For Social Good
                </span>
                <FaChartLine className="text-2xl text-emerald-500 animate-pulse" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Initiatives</span>
              </h2>
              
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Leveraging artificial intelligence to create measurable impact across key sectors in East Africa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {initiatives.map((initiative, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100/50 h-full">
                    <div className="mb-6">
                      <div className="inline-flex p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <div className="text-2xl text-emerald-600">
                          {initiative.icon}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {initiative.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {initiative.description}
                    </p>
                    
                    <div className="mt-6 pt-5 border-t border-gray-100 group-hover:border-emerald-200 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          {initiative.stats}
                        </span>
                        <span className="inline-flex items-center text-emerald-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                          Learn more
                          <FaArrowRight className="ml-2 text-xs" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-28"
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full" />
                <span className="text-sm font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100 px-4 py-2 rounded-full">
                  Our Values
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-l from-emerald-300 to-emerald-500 rounded-full" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Guiding <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Principles</span>
              </h2>
              
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                The ethical foundation that shapes every decision and action we take.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="group bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 h-full">
                    <div className="mb-6">
                      <div className={`inline-flex p-4 bg-gradient-to-br ${value.color} rounded-xl transform group-hover:rotate-12 transition-transform duration-500`}>
                        <div className="text-2xl text-white">
                          {value.icon}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                    
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Core Principle {index + 1}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Impact Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
            
            {/* Simplified background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 2px)`,
                backgroundSize: '50px 50px'
              }} />
            </div>
            
            <div className="relative p-12 md:p-16 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-flex items-center justify-center mb-8"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full mr-3" />
                <div className="w-10 h-10 bg-white/30 rounded-full mr-3" />
                <div className="w-12 h-12 bg-white/40 rounded-full" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                Building a future where <span className="text-emerald-200">technology serves humanity</span>
              </h2>
              
              <p className="text-emerald-100 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
                Through ethical AI and community-centered design, we're creating tools that don't just solve problems—they empower people to build their own futures and preserve cultural heritage.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Explore Our Work
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Partner With Us
                </motion.button>
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {["Ethical AI", "Cultural Preservation", "Community Led", "Sustainable Impact"].map((item, i) => (
                    <div key={i} className="text-white/90">
                      <div className="text-2xl font-bold mb-1">✓</div>
                      <div className="text-sm font-medium">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

