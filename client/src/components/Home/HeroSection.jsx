import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { projectsAPI, galleryAPI } from '../../services/api';

const HeroSection = () => {
  const [liveStat, setLiveStat] = useState(null);      // e.g. { value: '5,000+', label: 'lives touched' }
  const [heroImage, setHeroImage] = useState(null);     // background image URL
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const { scrollY } = useScroll({ target: sectionRef });
  const imageOpacity = useTransform(scrollY, [0, 300], [0.3, 1]);   // fade in on scroll

  // Fetch a live stat + background image on mount
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Get stats – try totalProjects or totalBeneficiaries
        const statsRes = await projectsAPI.getStats();
        const stats = statsRes?.data?.data ?? statsRes?.data;
        // Build a display value (fallback to static numbers)
        const total = stats?.totalBeneficiaries || stats?.totalProjects || stats?.total || 5000;
        const formatted = total >= 1000 ? `${(total / 1000).toFixed(total % 1000 === 0 ? 0 : 1)}K+` : `${total}+`;
        const label = stats?.totalBeneficiaries ? 'lives touched' : 'projects delivered';

        // Get a real project/gallery image
        let imageUrl = '/images/hero-fallback.jpg'; // local fallback
        try {
          const galleryRes = await galleryAPI.getAll({ limit: 1, sort: '-createdAt' });
          const items = galleryRes?.data?.data ?? galleryRes?.data;
          if (items?.length) {
            imageUrl = items[0].url || items[0].image || items[0].fileUrl || imageUrl;
          }
        } catch (galleryErr) {
          // silently use fallback
        }

        setLiveStat({ value: formatted, label });
        setHeroImage(imageUrl);
      } catch (err) {
        // API failed – show fallback
        setLiveStat({ value: '5,000+', label: 'lives touched' });
        setHeroImage('/images/hero-fallback.jpg');
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-end pb-20 md:pb-32 overflow-hidden bg-soil-900"
    >
      {/* Background image — fades in on scroll */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ opacity: imageOpacity }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Warm overlay to keep text readable */}
        <div className="absolute inset-0 bg-soil-900/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400 mb-4">
            Matakiri Tumaini Centre
          </p>

          {/* Live stat — the hero thesis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {loading ? (
              <div className="h-24 md:h-32 flex items-center">
                <div className="animate-pulse bg-parchment-50/10 w-48 h-16 md:h-24" />
              </div>
            ) : (
              <p className="font-display text-[5rem] md:text-[7rem] lg:text-[9rem] font-light leading-none text-parchment-50 tracking-tight">
                {liveStat?.value}
              </p>
            )}
            <p className="font-display text-xl md:text-2xl text-parchment-100/70 mt-2">
              {liveStat?.label}
            </p>
          </motion.div>

          {/* Place name — anchors the location */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm font-mono text-parchment-100/50 mt-6"
          >
            Tharaka, Kenya
          </motion.p>

          {/* Subtle CTA — not a flashy button, just an invitation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm text-parchment-50/80 hover:text-laterite-400 transition-colors group"
            >
              See our work in the field
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Faint scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="w-4 h-6 border border-parchment-100/20 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 bg-parchment-50/40 rounded-full mt-1"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;