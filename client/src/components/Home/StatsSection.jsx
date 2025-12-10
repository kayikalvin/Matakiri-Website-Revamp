import React, { useEffect, useState } from 'react';
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
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback stats in case API fails
  const fallbackStats = [
    {
      number: '5,000+',
      label: 'Beneficiaries',
      icon: <FaUsers className="w-5 h-5" />,
      color: 'from-emerald-400 to-teal-500',
      description: 'Lives transformed through our initiatives'
    },
    {
      number: '25+',
      label: 'Projects',
      icon: <FaProjectDiagram className="w-5 h-5" />,
      color: 'from-emerald-500 to-green-500',
      description: 'Successful community projects delivered'
    },
    {
      number: '15+',
      label: 'Communities',
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      color: 'from-green-400 to-emerald-500',
      description: 'Regions across Kenya empowered'
    },
    {
      number: '5+',
      label: 'Years',
      icon: <FaCalendarAlt className="w-5 h-5" />,
      color: 'from-teal-400 to-emerald-400',
      description: 'Of consistent community development'
    }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to fetch from backend
        const { data } = await require('../../services/api').projectsAPI.getStats();
        // Map backend stats to UI cards
        const mappedStats = [
          {
            number: data?.totalBeneficiaries ? `${data.totalBeneficiaries}+` : '5,000+',
            label: 'Beneficiaries',
            icon: <FaUsers className="w-5 h-5" />,
            color: 'from-emerald-400 to-teal-500',
            description: 'Lives transformed through our initiatives'
          },
          {
            number: data?.totalProjects ? `${data.totalProjects}+` : '25+',
            label: 'Projects',
            icon: <FaProjectDiagram className="w-5 h-5" />,
            color: 'from-emerald-500 to-green-500',
            description: 'Successful community projects delivered'
          },
          {
            number: data?.communitiesServed ? `${data.communitiesServed}+` : '15+',
            label: 'Communities',
            icon: <FaMapMarkerAlt className="w-5 h-5" />,
            color: 'from-green-400 to-emerald-500',
            description: 'Regions across Kenya empowered'
          },
          {
            number: data?.yearsOfImpact ? `${data.yearsOfImpact}+` : '5+',
            label: 'Years',
            icon: <FaCalendarAlt className="w-5 h-5" />,
            color: 'from-teal-400 to-emerald-400',
            description: 'Of consistent community development'
          }
        ];
        setStats(mappedStats);
      } catch (err) {
        console.error('Stats API error:', err);
        // Use fallback stats
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="relative py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center mb-4">
            <div className="w-8 h-0.5 bg-emerald-300 mr-3"></div>
            <span className="text-sm font-medium text-emerald-600 tracking-wider">OUR IMPACT</span>
            <div className="w-8 h-0.5 bg-emerald-300 ml-3"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Making a <span className="font-medium text-emerald-700">Measurable Difference</span>
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Through years of dedicated work, we've created tangible impact across communities. 
            Here's a glimpse of our journey in numbers.
          </p>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <div className="mt-4 text-gray-500">Loading stats...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-emerald-200 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-3xl font-light text-gray-900 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-base font-medium text-gray-800 mb-2">
                        {stat.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress indicator (optional) */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Impact</span>
                      <span>100%</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Impact Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-emerald-50 to-teal-50 
                       rounded-xl px-8 py-4 border border-emerald-100">
            <div className="mr-4">
              <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">
                <FaChartLine className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="text-left flex-1">
              <div className="text-lg font-medium text-gray-900">
                Growing stronger every day
              </div>
              <div className="text-gray-600">
                Join us in creating more impactful statistics
              </div>
            </div>
            
            <button className="ml-4 px-6 py-2 bg-emerald-600 text-white 
                          font-medium rounded-lg hover:bg-emerald-700 
                          transition-colors duration-300">
              Partner With Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;