import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'partners', label: 'Partners' },
    { id: 'stats', label: 'Stats' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'team', label: 'Team' },
    { id: 'news', label: 'News' },
    { id: 'contact', label: 'Contact' },
  ];

  const contactInfo = [
    { icon: PhoneIcon, text: '+254112727453' },
    { icon: EnvelopeIcon, text: 'info@matakiri.org' },
    { icon: MapPinIcon, text: 'Tharaka, Kenya' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const isSectionActive = (sectionId) => {
    if (location.pathname !== '/') return false;
    if (sectionId === 'home' && window.scrollY < 100) return true;
    const element = document.getElementById(sectionId);
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top <= 100 && rect.bottom >= 100;
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-parchment-50 border-b transition-shadow ${
        scrolled ? 'border-border shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" onClick={handleHomeClick} className="flex items-center flex-shrink-0">
            <img
              src="/matakiri-logo.png"
              alt="Matakiri Tumaini"
              className="h-10 md:h-12 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/fallback-logo.png';
              }}
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  section.id === 'home'
                    ? handleHomeClick({ preventDefault: () => {} })
                    : scrollToSection(section.id)
                }
                className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                  isSectionActive(section.id)
                    ? 'text-laterite-500 border-laterite-500'
                    : 'text-ink-500 border-transparent hover:text-ink-800 hover:border-ink-500/20'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-ink-500 hover:text-laterite-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-soil-900/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg z-50 lg:hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() =>
                      section.id === 'home'
                        ? handleHomeClick({ preventDefault: () => {} })
                        : scrollToSection(section.id)
                    }
                    className={`w-full text-left px-4 py-3 text-sm font-medium border-l-2 transition-colors ${
                      isSectionActive(section.id)
                        ? 'text-laterite-500 border-laterite-500 bg-laterite-50'
                        : 'text-ink-500 border-transparent hover:bg-parchment-50'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}

                {/* Mobile contact strip */}
                <div className="pt-4 mt-4 border-t border-border space-y-2">
                  {contactInfo.map((info, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-ink-500">
                      <info.icon className="h-4 w-4 text-laterite-500" />
                      {info.text}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;