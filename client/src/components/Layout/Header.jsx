import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiPhone, 
  FiMail, 
  FiMapPin,
  FiChevronDown
} from 'react-icons/fi';
import { 
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaTachometerAlt
} from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/about', label: 'About Us' },
    { 
      path: '/programs', 
      label: 'Programs',
      subItems: [
        { path: '/programs/education', label: 'Education' },
        { path: '/programs/healthcare', label: 'Healthcare' },
        { path: '/programs/agriculture', label: 'Agriculture' },
        { path: '/programs/environment', label: 'Environment' }
      ]
    },
    { 
      path: '/projects', 
      label: 'Projects',
      subItems: [
        { path: '/projects', label: 'All Projects' },
        { path: '/projects/ai', label: 'AI Projects' },
        { path: '/projects/featured', label: 'Featured Projects' }
      ]
    },
    { path: '/partners', label: 'Partners' },
    { path: '/news', label: 'News' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: <FiPhone />, text: '+254 712 345 678' },
    { icon: <FiMail />, text: 'info@matakiritrust.org' },
    { icon: <FiMapPin />, text: 'Kisumu County, Kenya' },
  ];

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <>
      {/* Top Bar - Contact & Social */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-sans hidden sm:block">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-2 md:py-1">
            {/* Contact Info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 text-xs md:text-sm">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <div className="text-emerald-300 group-hover:text-white transition-colors">
                    {info.icon}
                  </div>
                  <span className="group-hover:text-emerald-100 transition-colors">{info.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links & Admin */}
            <div className="flex items-center gap-3 mt-1 md:mt-0">
              <div className="flex items-center gap-2 border-r border-emerald-600 pr-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="text-emerald-200 hover:text-white transition-colors hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <a
                href="http://localhost:3002"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 px-3 py-1 bg-white text-emerald-700 text-xs md:text-sm font-semibold rounded hover:bg-emerald-50 transition-colors shadow flex items-center gap-1"
              >
                <FaTachometerAlt className="text-xs" />
                <span className="hidden md:inline">Admin</span>
                <span className="md:hidden">Login</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-white shadow-sm sticky top-0 z-50 font-sans transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink 
                to="/" 
                className="flex items-center space-x-3 group"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setActiveDropdown(null);
                }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                  <span className="text-white font-bold text-lg md:text-xl">MTC</span>
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg md:text-xl text-gray-900 leading-tight">
                    Matakiri Tumaini
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500 hidden md:block">
                    Transforming Communities Through Innovation
                  </p>
                </div>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <div key={index} className="relative group">
                  {item.subItems ? (
                    <button
                      onClick={() => handleDropdownToggle(index)}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeDropdown === index || window.location.pathname.startsWith(item.path)
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      <FiChevronDown className={`transition-transform duration-200 ${
                        activeDropdown === index ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                  
                  {/* Dropdown Menu */}
                  {item.subItems && activeDropdown === index && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          onClick={() => setActiveDropdown(null)}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? 'text-emerald-700 bg-emerald-50'
                                : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Tablet Menu Button */}
            <div className="hidden md:flex lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
              >
                <span>Menu</span>
                <FiMenu />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

          {/* Tablet Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="hidden md:flex lg:hidden flex-wrap gap-2 pt-4 pb-4 border-t border-gray-100"
              >
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-2">
                {/* Mobile Contact Info */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="space-y-2">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="text-emerald-500">
                          {info.icon}
                        </div>
                        <span>{info.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile Social Links */}
                  <div className="flex items-center gap-4 mt-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        className="text-emerald-600 hover:text-emerald-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <div key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.exact}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                          }`
                        }
                      >
                        <span>{item.label}</span>
                        {item.subItems && <FiChevronDown className="text-gray-400" />}
                      </NavLink>
                      
                      {/* Mobile Submenu */}
                      {item.subItems && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
                          {item.subItems.map((subItem) => (
                            <NavLink
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm rounded-lg transition-colors ${
                                  isActive
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                                }`
                              }
                            >
                              {subItem.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Admin Link in Mobile Menu */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href="http://localhost:3002"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaTachometerAlt className="text-emerald-600" />
                    <span>Admin Dashboard</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Header;