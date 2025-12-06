import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaHandshake } from 'react-icons/fa';

const PartnerCard = ({ partner }) => {
  const {
    id,
    name,
    logo,
    description,
    type,
    website,
    partnershipSince,
    impact
  } = partner;

  const getTypeColor = (type) => {
    switch (type) {
      case 'Strategic':
        return 'bg-blue-100 text-blue-800';
      case 'Implementation':
        return 'bg-green-100 text-green-800';
      case 'Funding':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      {/* Header with Logo and Type */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {logo ? (
              <img
                src={logo}
                alt={`${name} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <FaHandshake className="text-2xl text-gray-400" />
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(type)}`}>
            {type}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {name}
        </h3>

        <p className="text-gray-600 text-sm">
          Partner since {partnershipSince}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>

        {impact && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Impact</h4>
            <p className="text-primary-600 font-medium text-sm">{impact}</p>
          </div>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
          >
            <span>Visit Website</span>
            <FaExternalLinkAlt className="text-sm group-hover:translate-x-1 transition-transform" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default PartnerCard;
