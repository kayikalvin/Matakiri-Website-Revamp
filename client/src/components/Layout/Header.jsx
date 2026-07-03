import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiPhone, 
  FiMail, 
  FiMapPin
} from 'react-icons/fi';
import { 
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaTachometerAlt
} from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Admin URL from env or global window.__env__, default to relative /admin to avoid hardcoded localhost
  const ADMIN_URL = (typeof process !== 'undefined' && (process.env.REACT_APP_ADMIN_URL || process.env.VITE_ADMIN_URL)) ||
    (typeof window !== 'undefined' && window.__env__ && window.__env__.VITE_ADMIN_URL) || '/admin';

  // Define section IDs based on your layout
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

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: <FiPhone />, text: '+254112727453' },
    { icon: <FiMail />, text: 'info@matakiri.org' },
    { icon: <FiMapPin />, text: 'Tharaka, Kenya' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
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

  // Simple function to scroll to a section
  const scrollToSection = (sectionId) => {
    // Close mobile menu
    setIsMobileMenuOpen(false);
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait a bit for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }
    
    // If we're already on home page, scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle home click
  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (location.pathname === '/') {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  // Simple active section check
  const isSectionActive = (sectionId) => {
    if (location.pathname !== '/') return false;
    if (sectionId === 'home' && window.scrollY < 100) return true;
    
    const element = document.getElementById(sectionId);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return rect.top <= 100 && rect.bottom >= 100;
  };

  return (
    <>

      

      {/* Main Navigation (Compact) */}
      <nav className={`bg-white shadow-sm sticky top-0 z-50 font-sans transition-all duration-300 relative ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo - Compact */}
            <div className="flex items-center">
              <a 
                href="/"
                onClick={handleHomeClick}
                className="flex items-center"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300">
                  <img
                    src="/matakiri-logo.png"
                    alt="Matakiri Tumaini logo"
                    className="w-full h-full object-contain"
                    onError={(e) => { 
                      e.target.onerror = null;
                      e.target.src = "/assets/images/fallback-logo.png";
                    }}
                  />
                  <span className="sr-only">Matakiri Tumaini</span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation - Compact */}
            <div className="hidden lg:flex items-center space-x-0">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => section.id === 'home' ? handleHomeClick({ preventDefault: () => {} }) : scrollToSection(section.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSectionActive(section.id)
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors z-50"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Menu Content */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed left-0 right-0 top-16 bg-white shadow-2xl z-40 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
              >
                <div className="px-4 py-4">
                  {/* Mobile Contact Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="space-y-2">
                      {contactInfo.map((info, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="text-emerald-500 text-base">
                            {info.icon}
                          </div>
                          <span className="text-sm">{info.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Mobile Social Links */}
                    <div className="flex items-center gap-4 mt-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.href}
                          aria-label={social.label}
                          className="text-emerald-600 hover:text-emerald-700 transition-colors text-lg"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          if (section.id === 'home') {
                            handleHomeClick({ preventDefault: () => {} });
                          } else {
                            scrollToSection(section.id);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isSectionActive(section.id)
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>

                  {/* Admin Link in Mobile Menu */}
                  {/* <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={ADMIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaTachometerAlt className="text-emerald-600 text-lg" />
                      <span>Admin Dashboard</span>
                    </a>
                  </div> */}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Header;

