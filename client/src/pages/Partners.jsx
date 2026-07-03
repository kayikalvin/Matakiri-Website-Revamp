import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { partnersAPI } from '../services/api';

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const partnerTypes = [
    { id: 'all', label: 'All Partners' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'ngo', label: 'NGO' },
    { id: 'academic', label: 'Academic' },
    { id: 'government', label: 'Government' },
    { id: 'community', label: 'Community' },
  ];

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await partnersAPI.getAll();
        setPartners(response?.data || response || []);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError(err.message || 'Failed to fetch partners.');
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const filteredPartners = partners.filter((partner) => {
    const matchesType = selectedType === 'all' || partner.type === selectedType;
    const matchesSearch =
      !searchTerm ||
      partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Partners - Matakiri Tumaini Centre</title>
        <meta
          name="description"
          content="Our valued partners who support our mission of community development through innovation and collaboration."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-soil-900 text-parchment-50 py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400">
              Strategic Partners
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-medium mt-3 mb-6">
              Our Partners
            </h1>
            <p className="text-parchment-100/70 max-w-xl mx-auto text-sm mb-10">
              Together with our partners, we're building stronger communities through collaboration and innovation.
            </p>
            <div className="font-mono text-2xl text-laterite-400">
              {partners.length} partners
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Grid */}
      <section className="py-16 md:py-20 bg-parchment-50">
        <div className="container mx-auto px-4">
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 max-w-5xl mx-auto">
            <div className="relative w-full sm:w-72">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border bg-white text-sm text-ink-800 placeholder:text-ink-400 outline-none focus:border-laterite-500 transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {partnerTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 text-xs font-mono border transition-colors ${
                    selectedType === type.id
                      ? 'border-laterite-500 text-laterite-600 bg-laterite-50'
                      : 'border-border text-ink-500 hover:border-laterite-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-16 text-ink-500 font-mono text-sm">
              Loading partners…
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-status-danger font-mono text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-laterite-500 underline text-xs"
              >
                Try again
              </button>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="text-center py-16 text-ink-500 font-mono text-sm">
              No partners found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {filteredPartners.map((partner, index) => (
                <motion.div
                  key={partner._id || partner.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white border border-border hover:border-laterite-500/30 transition-colors p-6 flex flex-col items-center text-center space-y-4"
                >
                  <div className="h-24 flex items-center justify-center">
                    <img
                      src={
                        partner.logo ||
                        partner.image ||
                        'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                      }
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.src = '/assets/images/default-logo.png';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-ink-800 text-sm">
                      {partner.name || 'Partner'}
                    </h3>
                    <p className="text-xs text-ink-500 mt-0.5">
                      {partner.type?.charAt(0).toUpperCase() + partner.type?.slice(1) || 'Partner'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
              Partner Voices
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-ink-800 mt-2">
              What our partners say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote:
                  'Collaborating with Matakiri Tumaini has allowed us to make a real difference in communities across Kenya.',
                author: 'Jane Mwangi',
                role: 'Tech for Good Foundation',
              },
              {
                quote:
                  'Their innovative approach to community development is exactly what our region needs.',
                author: 'Prof. David Ochieng',
                role: 'University of Nairobi',
              },
              {
                quote:
                  'A reliable partner that truly understands and serves the community\'s needs.',
                author: 'Sarah Achieng',
                role: 'Community Council',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="border border-border bg-parchment-50 p-6 space-y-4"
              >
                <p className="text-ink-500 text-sm italic leading-relaxed">“{t.quote}”</p>
                <div className="pt-4 border-t border-border">
                  <div className="font-sans font-semibold text-ink-800 text-sm">{t.author}</div>
                  <div className="text-xs text-ink-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-soil-900 text-parchment-50 text-center">
        <div className="container mx-auto px-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400">
            Get Involved
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-2 mb-4">
            Want to partner with us?
          </h2>
          <p className="text-parchment-100/70 max-w-lg mx-auto text-sm mb-8">
            Join our network of changemakers and help us expand our impact across communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-laterite-500 hover:bg-laterite-600 text-white px-6 py-3 text-sm font-medium transition-colors"
            >
              Become a Partner <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 border border-parchment-100/30 hover:border-laterite-500 text-parchment-50 px-6 py-3 text-sm font-medium transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;