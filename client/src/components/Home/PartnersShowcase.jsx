import React, { useEffect, useState, useRef } from 'react';
import { FaHandshake, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../utils/url';

const PartnersShowcase = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await require('../../services/api').partnersAPI.getAll();
        // Duplicate for seamless infinite scroll
        setPartners([...data, ...data] || []);
      } catch (err) {
        console.error('Partners API error:', err);
        setError(err.message || 'Failed to fetch partners.');
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const getLogoUrl = (partner) => {
    if (partner?.logo) return resolveAssetUrl(partner.logo);
    if (partner?.image) return resolveAssetUrl(partner.image);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.name || 'Partner')}&background=009970&color=fff&bold=true`;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-full mb-6 shadow-lg">
            <FaHandshake className="text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
            Our <span className="text-primary-600">Partners</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Collaborating with leading organizations to amplify our impact and reach.
          </p>
        </div>

        {/* Infinite Slideshow Container */}
        <div 
          className="relative overflow-hidden py-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <div className="mt-4 text-gray-500">Loading partners...</div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div 
              className={`flex space-x-8 ${!isPaused ? 'animate-scroll' : ''}`}
              style={{
                animation: !isPaused ? 'scroll 30s linear infinite' : 'none',
              }}
            >
              {partners.map((partner, index) => (
                <div
                  key={`${partner._id || partner.id || index}-${Math.random()}`}
                  className="flex-shrink-0 group flex flex-col items-center"
                >
                  {/* Circular Card - Transparent Background */}
                  <div className="w-40 h-40 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center p-0 border border-white/40 hover:border-primary-200/50 object-contain">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={getLogoUrl(partner)}
                        alt={partner.name}
                        className="absolute inset-0 w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const partnerName = partner.name || 'Partner';
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=009970&color=fff&bold=true`;
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400/0 to-accent-400/0 group-hover:from-primary-400/10 group-hover:to-accent-400/10 transition-all duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            to="/partners"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 group"
          >
            <span>Explore All Partnerships</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Discover how we collaborate with organizations to create lasting impact
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default PartnersShowcase;