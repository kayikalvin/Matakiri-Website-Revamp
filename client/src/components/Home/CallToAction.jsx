import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaHandshake, 
  FaLightbulb, 
  FaUsers,
  FaRocket,
  FaHeart,
  FaChartLine
} from 'react-icons/fa';

const CallToAction = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50"></div>
        
        {/* Animated gradient orbs */}
        <motion.div 
          animate={{ 
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-emerald-200/40 to-teal-200/30 rounded-full blur-3xl"
        ></motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-l from-green-200/30 to-emerald-200/20 rounded-full blur-3xl"
        ></motion.div>

        {/* Wave patterns */}
        <div className="absolute top-0 left-0 right-0">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 240" 
            className="w-full h-32 md:h-40"
            preserveAspectRatio="none"
          >
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,144C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C240,0,192,0,144,0L0,0Z"
            />
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 240" 
            className="w-full h-32 md:h-40"
            preserveAspectRatio="none"
          >
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,170.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C240,320,192,320,144,320L0,320Z"
            />
          </svg>
        </div>

        {/* Floating icons */}
        {[...Array(6)].map((_, i) => {
          const icons = [
            { icon: <FaHandshake className="text-emerald-500" />, color: "bg-emerald-100/50" },
            { icon: <FaLightbulb className="text-teal-500" />, color: "bg-teal-100/50" },
            { icon: <FaUsers className="text-green-500" />, color: "bg-green-100/50" },
            { icon: <FaRocket className="text-lime-500" />, color: "bg-lime-100/50" },
            { icon: <FaHeart className="text-rose-500" />, color: "bg-rose-100/50" },
            { icon: <FaChartLine className="text-emerald-500" />, color: "bg-emerald-100/50" },
          ];
          const { icon, color } = icons[i % icons.length];
          
          return (
            <motion.div
              key={i}
              className={`absolute ${color} backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/50`}
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i * 10)}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, i % 2 === 0 ? 5 : -5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              {icon}
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 
                       backdrop-blur-sm rounded-full border border-emerald-200">
            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            <span className="text-sm font-semibold text-emerald-600">Join Our Movement</span>
            <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Ready to Make a
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              Lasting Difference?
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join us in our mission to empower communities through innovative AI solutions.
            <span className="block mt-2 font-medium text-gray-700">
              Together, we can create sustainable positive change across Kenya.
            </span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            {[
              { number: '500+', label: 'Active Volunteers' },
              { number: '25+', label: 'Partnerships' },
              { number: '98%', label: 'Success Rate' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100"
              >
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              to="/contact"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 
                         text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-emerald-600/40 
                         transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <FaHandshake className="group-hover:rotate-12 transition-transform" />
                <span>Get Involved Today</span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            
            <Link
              to="/about"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-white to-emerald-50 
                         text-emerald-600 font-semibold rounded-xl border-2 border-emerald-200 hover:border-emerald-300 
                         hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 
                         hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center space-x-2">
                <FaLightbulb className="group-hover:scale-110 transition-transform" />
                <span>Discover Our Mission</span>
              </span>
            </Link>
          </motion.div>

          {/* Additional Options */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { title: 'Volunteer', desc: 'Share your skills', icon: '🙋‍♂️', color: 'bg-emerald-100/50' },
              { title: 'Donate', desc: 'Support our projects', icon: '💝', color: 'bg-rose-100/50' },
              { title: 'Partner', desc: 'Corporate collaboration', icon: '🤝', color: 'bg-green-100/50' },
              { title: 'Mentor', desc: 'Guide the next generation', icon: '👨‍🏫', color: 'bg-teal-100/50' },
            ].map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`${option.color} backdrop-blur-sm rounded-xl p-6 text-center border border-white/50 
                           hover:shadow-xl transition-all duration-300 cursor-pointer group`}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {option.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {option.desc}
                </p>
              </motion.div>
            ))}
          </div> */}

          {/* Trust Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <p className="text-gray-500 text-sm mb-4">Trusted by organizations like:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['UNICEF', 'Google.org', 'Microsoft', 'Kenya Gov'].map((org, index) => (
                <div key={index} className="text-gray-400 font-semibold">
                  {org}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CallToAction;