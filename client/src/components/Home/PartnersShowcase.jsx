import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHandshake } from 'react-icons/fa';

const PartnersShowcase = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await require('../../services/api').partnersAPI.getAll();
        setPartners(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch partners.');
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
            <FaHandshake className="text-2xl" />
          </div>
          <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We collaborate with international partners, government agencies, and tech companies 
            to amplify our impact and reach.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <div className="mt-4 text-gray-500">Loading partners...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner._id || partner.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm">
                  <img
                    src={partner.logo || partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/partners"
            className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            View All Partners
            <FaHandshake className="ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersShowcase;