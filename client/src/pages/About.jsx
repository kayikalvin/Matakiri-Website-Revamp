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
      icon: <FaHandsHelping className="w-6 h-6" />,
      title: "Community First",
      description: "Local needs drive our AI solutions",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaLightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "Cutting-edge tech for traditional problems",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <FaSeedling className="w-6 h-6" />,
      title: "Sustainability",
      description: "Solutions that grow with communities",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Collaboration",
      description: "Partnerships for maximum impact",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const aiInitiatives = [
    {
      title: "Smart Agriculture",
      description: "AI crop monitoring for small-scale farmers",
      icon: <FaSeedling className="w-5 h-5" />,
      color: "from-emerald-100 to-green-100"
    },
    {
      title: "Healthcare Analytics",
      description: "Predictive models for rural clinics",
      icon: <FaHeart className="w-5 h-5" />,
      color: "from-rose-100 to-pink-100"
    },
    {
      title: "Education Tech",
      description: "Personalized learning platforms",
      icon: <FaUsers className="w-5 h-5" />,
      color: "from-blue-100 to-cyan-100"
    },
    {
      title: "Environmental AI",
      description: "Satellite analysis for conservation",
      icon: <FaGlobeAfrica className="w-5 h-5" />,
      color: "from-teal-100 to-emerald-100"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className="w-6 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Mission</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Where <span className="text-blue-600">Humanitarian Work</span> Meets <span className="text-cyan-600">AI Innovation</span>
            </h2>
            
            <p className="text-gray-600">
              Matakiri Tumaini Centre empowers marginalized communities in Kenya through ethical AI applications, 
              creating sustainable solutions while preserving cultural heritage.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className="w-6 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Our Vision</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              AI-Powered <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Sustainable Development</span>
            </h2>
            
            <p className="text-gray-600">
              We envision communities with access to AI tools that enhance education, healthcare, agriculture, 
              and economic opportunities, driving development from the ground up.
            </p>
          </motion.div>
        </div>

        {/* AI Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <FaBrain className="text-blue-500 text-xl" />
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">AI for Social Good</span>
              <FaChartLine className="text-cyan-500 text-xl" />
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Leveraging Artificial Intelligence for Community Transformation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiInitiatives.map((initiative, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-gradient-to-br ${initiative.color} rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-xs">
                    <div className="text-blue-600">
                      {initiative.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{initiative.title}</h4>
                    <p className="text-sm text-gray-600">{initiative.description}</p>
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
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Values</span>
              <div className="w-8 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Principles That Guide Our Work
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${value.color} mb-3 group-hover:scale-105 transition-transform duration-300`}>
                    <div className="text-white">
                      {value.icon}
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {value.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;