import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaChartLine,
  FaHeartbeat,
  FaGlobeAfrica,
  FaLeaf
} from 'react-icons/fa';

const StatsSection = () => {
  const stats = [
    { 
      number: '500+', 
      label: 'Beneficiaries', 
      icon: <FaUsers className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-500',
      description: 'Lives transformed through our initiatives'
    },
    { 
      number: '25+', 
      label: 'Projects Completed', 
      icon: <FaProjectDiagram className="w-6 h-6" />,
      color: 'from-emerald-500 to-green-500',
      description: 'Successful community projects delivered'
    },
    { 
      number: '10+', 
      label: 'Communities Served', 
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500',
      description: 'Regions across Kenya empowered'
    },
    { 
      number: '5+', 
      label: 'Years of Impact', 
      icon: <FaCalendarAlt className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      description: 'Consistent community development'
    },
    { 
      number: '15+', 
      label: 'AI Solutions', 
      icon: <FaChartLine className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-500',
      description: 'Tech innovations implemented'
    },
    { 
      number: '100%', 
      label: 'Community Driven', 
      icon: <FaHeartbeat className="w-6 h-6" />,
      color: 'from-rose-500 to-red-500',
      description: 'Locally-led initiatives'
    },
    { 
      number: '3', 
      label: 'Countries', 
      icon: <FaGlobeAfrica className="w-6 h-6" />,
      color: 'from-teal-500 to-cyan-500',
      description: 'Regional impact across East Africa'
    },
    { 
      number: '50+', 
      label: 'Green Projects', 
      icon: <FaLeaf className="w-6 h-6" />,
      color: 'from-lime-500 to-emerald-500',
      description: 'Sustainable environmental solutions'
    },
  ];

  return (
    <section className="relative pb-20 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-indigo-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
        
        {/* Geometric pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Impact</span>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Making a <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Measurable Difference</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Through years of dedicated work, we've created tangible impact across communities. 
            Here's a glimpse of our journey in numbers.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.slice(0, 4).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 
                           hover:shadow-2xl hover:border-blue-200 transition-all duration-300 
                           hover:bg-gradient-to-br from-white to-blue-50/50">
                
                {/* Icon with gradient background */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4 
                             group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>

                {/* Stat Number with counting animation */}
                <motion.div 
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  {stat.number}
                </motion.div>

                {/* Label */}
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>

                {/* Animated underline */}
                <div className="absolute bottom-4 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent 
                             group-hover:via-blue-400 transition-all duration-300"></div>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-200 rounded-tr-2xl 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-300/30 rounded-full"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${20 + i * 20}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Stats (2x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.slice(4, 8).map((stat, index) => (
            <motion.div
              key={index + 4}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm 
                       rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl 
                       transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} 
                             group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-base font-semibold text-gray-800 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              </div>

              {/* Progress bar for some stats */}
              {(stat.label === 'AI Solutions' || stat.label === 'Green Projects') && (
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: stat.label === 'AI Solutions' ? '85%' : '90%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Growth</span>
                    <span>{stat.label === 'AI Solutions' ? '+35%' : '+40%'}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-4 bg-white 
                       rounded-2xl px-8 py-4 border border-blue-100">
            <div className="text-2xl">📈</div>
            <div className="text-left">
              <div className="text-lg font-semibold text-gray-900">
                Growing stronger every day
              </div>
              <div className="text-gray-600">
                Join us in creating more impactful statistics
              </div>
            </div>
            <button className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white 
                          font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 
                          transition-all duration-300 hover:-translate-y-1">
              Partner With Us
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path fill="#ffffff" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,112C1248,107,1344,85,1392,74.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"/>
        </svg>
      </div>
    </section>
  );
};

export default StatsSection;