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



















// import React, { useState, useEffect } from 'react';
// import { NavLink, Link, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiMenu, 
//   FiX, 
//   FiPhone, 
//   FiMail, 
//   FiMapPin,
//   FiChevronDown
// } from 'react-icons/fi';
// import { 
//   FaFacebook,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedin,
//   FaTachometerAlt
// } from 'react-icons/fa';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const location = useLocation();

//   // Admin URL from env or global window.__env__, default to relative /admin to avoid hardcoded localhost
//   const ADMIN_URL = (typeof process !== 'undefined' && (process.env.REACT_APP_ADMIN_URL || process.env.VITE_ADMIN_URL)) ||
//     (typeof window !== 'undefined' && window.__env__ && window.__env__.VITE_ADMIN_URL) || '/admin';

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Function to check if a path is a section ID (starts with #)
//   const isSectionLink = (path) => {
//     return path.startsWith('#');
//   };

//   // Function to handle smooth scrolling to sections
//   const scrollToSection = (sectionId, event) => {
//     event.preventDefault();
    
//     // Remove # from the beginning if present
//     const id = sectionId.startsWith('#') ? sectionId.substring(1) : sectionId;
    
//     // Close mobile menu if open
//     setIsMobileMenuOpen(false);
//     setIsMenuOpen(false);
//     setActiveDropdown(null);
    
//     // Find the element
//     const element = document.getElementById(id);
    
//     if (element) {
//       // If we're not on the home page, navigate there first
//       if (location.pathname !== '/') {
//         // Navigate to home page first
//         window.location.href = `/${sectionId}`;
//       } else {
//         // Scroll to the section
//         const headerHeight = scrolled ? 80 : 100; // Adjust based on your header height
//         const elementPosition = element.getBoundingClientRect().top;
//         const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
//         window.scrollTo({
//           top: offsetPosition,
//           behavior: 'smooth'
//         });
//       }
//     }
//   };

//   // Function to handle navigation click
//   const handleNavClick = (path, event) => {
//     // If it's a section link, scroll to it
//     if (isSectionLink(path)) {
//       scrollToSection(path, event);
//     } else {
//       // Otherwise close menus and let React Router handle it
//       setIsMobileMenuOpen(false);
//       setIsMenuOpen(false);
//       setActiveDropdown(null);
//     }
//   };

//   // Define navigation items
//   const navItems = [
//     { path: '/', label: 'Home', exact: true },
//     // { path: '/about', label: 'About Us' },
//     { 
//       path: '#about', 
//       label: 'About',
//       isSection: true
//     },
//     { 
//       path: '#programs', 
//       label: 'Programs',
//       isSection: true,
//       subItems: [
//         { path: '#education', label: 'Education', isSection: true },
//         { path: '#health', label: 'Health', isSection: true },
//         { path: '#agriculture', label: 'Agriculture', isSection: true },
//         { path: '#water', label: 'Water & Sanitation', isSection: true }
//       ]
//     },
//     { 
//       path: '#projects', 
//       // label: 'Projects',
//       // isSection: true,
//       // subItems: [
//       //   { path: '#projects', label: 'All Projects', isSection: true },
//       //   { path: '#ai-projects', label: 'AI Projects', isSection: true },
//       //   { path: '#featured-projects', label: 'Featured Projects', isSection: true }
//       // ]
//     },
//     { path: '#team', label: 'Team', isSection: true },
//     { path: '#partners', label: 'Partners' },
//     { path: '#news', label: 'News' },
//     { path: '#gallery', label: 'Gallery' },
//     { path: '#contact', label: 'Contact', isSection: true },
//   ];

//   const socialLinks = [
//     { icon: <FaFacebook />, href: '#', label: 'Facebook' },
//     { icon: <FaTwitter />, href: '#', label: 'Twitter' },
//     { icon: <FaInstagram />, href: '#', label: 'Instagram' },
//     { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
//   ];

//   const contactInfo = [
//     { icon: <FiPhone />, text: '+254112727453' },
//     { icon: <FiMail />, text: 'info@matakiri.org' },
//     { icon: <FiMapPin />, text: 'Tharaka, Kenya' },
//   ];

//   const handleDropdownToggle = (index) => {
//     setActiveDropdown(activeDropdown === index ? null : index);
//   };

//   // Helper function to render navigation links
//   const renderNavLink = (item, isSubItem = false) => {
//     if (item.isSection) {
//       return (
//         <a
//           href={item.path}
//           onClick={(e) => handleNavClick(item.path, e)}
//           className={`${isSubItem ? 'block px-4 py-2 text-sm font-medium transition-colors' : 'px-3 py-2 rounded-lg text-sm font-medium transition-all'} ${
//             location.hash === item.path || (location.pathname === '/' && location.hash === item.path)
//               ? 'text-emerald-700 bg-emerald-50'
//               : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
//           }`}
//         >
//           {item.label}
//         </a>
//       );
//     } else {
//       return (
//         <NavLink
//           to={item.path}
//           end={item.exact}
//           onClick={(e) => handleNavClick(item.path, e)}
//           className={({ isActive }) =>
//             `${isSubItem ? 'block px-4 py-2 text-sm font-medium transition-colors' : 'px-3 py-2 rounded-lg text-sm font-medium transition-all'} ${
//               isActive
//                 ? 'text-emerald-700 bg-emerald-50'
//                 : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
//             }`
//           }
//         >
//           {item.label}
//         </NavLink>
//       );
//     }
//   };

//   return (
//     <>
//       {/* Top Bar - Contact & Social (Compact) */}
//       <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-sans hidden sm:block">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center py-1.5 md:py-1">
//             {/* Contact Info */}
//             <div className="flex items-center gap-3 md:gap-4 text-xs">
//               {contactInfo.map((info, index) => (
//                 <div key={index} className="flex items-center gap-1.5 group">
//                   <div className="text-emerald-300 text-xs group-hover:text-white transition-colors">
//                     {info.icon}
//                   </div>
//                   <span className="group-hover:text-emerald-100 transition-colors whitespace-nowrap">
//                     {info.text}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Social Links & Admin */}
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1.5 border-r border-emerald-600 pr-2">
//                 {socialLinks.map((social, index) => (
//                   <a
//                     key={index}
//                     href={social.href}
//                     aria-label={social.label}
//                     className="text-emerald-200 hover:text-white transition-colors text-sm"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {social.icon}
//                   </a>
//                 ))}
//               </div>
//               <a
//                 href={ADMIN_URL}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="ml-1 px-2.5 py-1 bg-white text-emerald-700 text-xs font-semibold rounded hover:bg-emerald-50 transition-colors shadow-sm flex items-center gap-1"
//               >
//                 <FaTachometerAlt className="text-xs" />
//                 <span className="hidden md:inline">Admin</span>
//                 <span className="md:hidden">Login</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Navigation (Compact) */}
//       <nav className={`bg-white shadow-sm sticky top-0 z-50 font-sans transition-all duration-300 ${
//         scrolled ? 'shadow-md' : 'shadow-sm'
//       }`}>
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center h-16 md:h-20">
//             {/* Logo - Compact */}
//             <div className="flex items-center">
//               <NavLink 
//                 to="/" 
//                 className="flex items-center"
//                 onClick={() => {
//                   setIsMobileMenuOpen(false);
//                   setActiveDropdown(null);
//                   // Scroll to top when clicking logo
//                   window.scrollTo({ top: 0, behavior: 'smooth' });
//                 }}
//               >
//                 <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300">
//                   <img
//                     src="/matakiri-logo.png"
//                     alt="Matakiri Tumaini logo"
//                     className="w-full h-full object-contain"
//                     onError={(e) => { 
//                       e.target.onerror = null;
//                       e.target.src = "/assets/images/fallback-logo.png";
//                     }}
//                   />
//                   <span className="sr-only">Matakiri Tumaini</span>
//                 </div>
//               </NavLink>
//             </div>

//             {/* Desktop Navigation - Compact */}
//             <div className="hidden lg:flex items-center space-x-0">
//               {navItems.map((item, index) => (
//                 <div key={index} className="relative group">
//                   {item.subItems ? (
//                     <button
//                       onClick={() => handleDropdownToggle(index)}
//                       className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                         activeDropdown === index || 
//                         (item.isSection && location.hash === item.path) ||
//                         (!item.isSection && window.location.pathname.startsWith(item.path))
//                           ? 'text-emerald-700 bg-emerald-50'
//                           : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
//                       }`}
//                     >
//                       <span>{item.label}</span>
//                       <FiChevronDown className={`transition-transform duration-200 text-xs ${
//                         activeDropdown === index ? 'rotate-180' : ''
//                       }`} />
//                     </button>
//                   ) : (
//                     renderNavLink(item)
//                   )}
                  
//                   {/* Dropdown Menu */}
//                   {item.subItems && activeDropdown === index && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
//                     >
//                       {item.subItems.map((subItem, subIndex) => (
//                         <div key={subIndex}>
//                           {renderNavLink(subItem, true)}
//                         </div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Tablet Menu Button */}
//             <div className="hidden md:flex lg:hidden">
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors font-medium text-sm"
//               >
//                 <span>Menu</span>
//                 <FiMenu />
//               </button>
//             </div>

//             {/* Mobile menu button */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
//               aria-label="Toggle menu"
//             >
//               {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
//             </button>
//           </div>

//           {/* Tablet Dropdown Menu */}
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10, height: 0 }}
//                 animate={{ opacity: 1, y: 0, height: 'auto' }}
//                 exit={{ opacity: 0, y: -10, height: 0 }}
//                 className="hidden md:flex lg:hidden flex-wrap gap-1 pt-3 pb-3 border-t border-gray-100"
//               >
//                 {navItems.map((item) => (
//                   <div key={item.path}>
//                     {renderNavLink(item)}
//                   </div>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Mobile Navigation */}
//         <AnimatePresence>
//           {isMobileMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
//             >
//               <div className="px-4 py-3">
//                 {/* Mobile Contact Info */}
//                 <div className="mb-3 pb-3 border-b border-gray-100">
//                   <div className="space-y-2">
//                     {contactInfo.map((info, index) => (
//                       <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
//                         <div className="text-emerald-500 text-sm">
//                           {info.icon}
//                         </div>
//                         <span className="text-xs">{info.text}</span>
//                       </div>
//                     ))}
//                   </div>
                  
//                   {/* Mobile Social Links */}
//                   <div className="flex items-center gap-3 mt-3">
//                     {socialLinks.map((social, index) => (
//                       <a
//                         key={index}
//                         href={social.href}
//                         aria-label={social.label}
//                         className="text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {social.icon}
//                       </a>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Mobile Navigation Links */}
//                 <div className="space-y-0.5">
//                   {navItems.map((item) => (
//                     <div key={item.path}>
//                       <div
//                         className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
//                           (item.isSection && location.hash === item.path) ||
//                           (!item.isSection && window.location.pathname === item.path)
//                             ? 'text-emerald-700 bg-emerald-50'
//                             : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
//                         }`}
//                       >
//                         {item.isSection ? (
//                           <a
//                             href={item.path}
//                             onClick={(e) => handleNavClick(item.path, e)}
//                             className="flex-1"
//                           >
//                             {item.label}
//                           </a>
//                         ) : (
//                           <NavLink
//                             to={item.path}
//                             end={item.exact}
//                             onClick={(e) => handleNavClick(item.path, e)}
//                             className="flex-1"
//                           >
//                             {item.label}
//                           </NavLink>
//                         )}
//                         {item.subItems && <FiChevronDown className="text-gray-400 text-xs" />}
//                       </div>
                      
//                       {/* Mobile Submenu */}
//                       {item.subItems && (
//                         <div className="ml-3 mt-0.5 space-y-0.5 border-l border-gray-200 pl-3">
//                           {item.subItems.map((subItem) => (
//                             <div key={subItem.path}>
//                               {subItem.isSection ? (
//                                 <a
//                                   href={subItem.path}
//                                   onClick={(e) => handleNavClick(subItem.path, e)}
//                                   className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                                     location.hash === subItem.path
//                                       ? 'text-emerald-700 bg-emerald-50'
//                                       : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
//                                   }`}
//                                 >
//                                   {subItem.label}
//                                 </a>
//                               ) : (
//                                 <NavLink
//                                   to={subItem.path}
//                                   onClick={(e) => handleNavClick(subItem.path, e)}
//                                   className={({ isActive }) =>
//                                     `block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                                       isActive
//                                         ? 'text-emerald-700 bg-emerald-50'
//                                         : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
//                                     }`
//                                   }
//                                 >
//                                   {subItem.label}
//                                 </NavLink>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Admin Link in Mobile Menu */}
//                 <div className="mt-3 pt-3 border-t border-gray-100">
//                   <a
//                     href={ADMIN_URL}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     <FaTachometerAlt className="text-emerald-600 text-sm" />
//                     <span>Admin Dashboard</span>
//                   </a>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </nav>
//     </>
//   );
// };

// export default Header;

























// // import React, { useState, useEffect } from 'react';
// // import { NavLink, Link } from 'react-router-dom';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { 
// //   FiMenu, 
// //   FiX, 
// //   FiPhone, 
// //   FiMail, 
// //   FiMapPin,
// //   FiChevronDown
// // } from 'react-icons/fi';
// // import { 
// //   FaFacebook,
// //   FaTwitter,
// //   FaInstagram,
// //   FaLinkedin,
// //   FaTachometerAlt
// // } from 'react-icons/fa';

// // const Header = () => {
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //   const [scrolled, setScrolled] = useState(false);
// //   const [activeDropdown, setActiveDropdown] = useState(null);

// //   // Admin URL from env or global window.__env__, default to relative /admin to avoid hardcoded localhost
// //   const ADMIN_URL = (typeof process !== 'undefined' && (process.env.REACT_APP_ADMIN_URL || process.env.VITE_ADMIN_URL)) ||
// //     (typeof window !== 'undefined' && window.__env__ && window.__env__.VITE_ADMIN_URL) || '/admin';

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       setScrolled(window.scrollY > 20);
// //     };
// //     window.addEventListener('scroll', handleScroll);
// //     return () => window.removeEventListener('scroll', handleScroll);
// //   }, []);

// //   const navItems = [
// //     { path: '/', label: 'Home', exact: true },
// //     { path: '/about', label: 'About Us' },
// //     { 
// //       path: '/programs', 
// //       label: 'Programs',
// //       subItems: [
// //         { path: '/programs?category=education', label: 'Education' },
// //         { path: '/programs?category=health', label: 'Health' },
// //         { path: '/programs?category=agriculture', label: 'Agriculture' },
// //         { path: '/programs?category=water', label: 'Water & Sanitation' }
// //       ]
// //     },
// //     { 
// //       path: '/projects', 
// //       label: 'Projects',
// //       subItems: [
// //         { path: '/projects', label: 'All Projects' },
// //         { path: '/ai-projects', label: 'AI Projects' },
// //         { path: '/projects?featured=true', label: 'Featured Projects' }
// //       ]
// //     },
// //     { path: '/team', label: 'Team' },
// //     { path: '/partners', label: 'Partners' },
// //     { path: '/news', label: 'News' },
// //     { path: '/gallery', label: 'Gallery' },
// //     { path: '/contact', label: 'Contact' },
// //   ];

// //   const socialLinks = [
// //     { icon: <FaFacebook />, href: '#', label: 'Facebook' },
// //     { icon: <FaTwitter />, href: '#', label: 'Twitter' },
// //     { icon: <FaInstagram />, href: '#', label: 'Instagram' },
// //     { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
// //   ];

// //   const contactInfo = [
// //     { icon: <FiPhone />, text: '+254112727453' },
// //     { icon: <FiMail />, text: 'info@matakiri.org' },
// //     { icon: <FiMapPin />, text: 'Tharaka, Kenya' },
// //   ];

// //   const handleDropdownToggle = (index) => {
// //     setActiveDropdown(activeDropdown === index ? null : index);
// //   };

// //   return (
// //     <>
// //       {/* Top Bar - Contact & Social (Compact) */}
// //       <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-sans hidden sm:block">
// //         <div className="container mx-auto px-4">
// //           <div className="flex justify-between items-center py-1.5 md:py-1">
// //             {/* Contact Info */}
// //             <div className="flex items-center gap-3 md:gap-4 text-xs">
// //               {contactInfo.map((info, index) => (
// //                 <div key={index} className="flex items-center gap-1.5 group">
// //                   <div className="text-emerald-300 text-xs group-hover:text-white transition-colors">
// //                     {info.icon}
// //                   </div>
// //                   <span className="group-hover:text-emerald-100 transition-colors whitespace-nowrap">
// //                     {info.text}
// //                   </span>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Social Links & Admin */}
// //             <div className="flex items-center gap-2">
// //               <div className="flex items-center gap-1.5 border-r border-emerald-600 pr-2">
// //                 {socialLinks.map((social, index) => (
// //                   <a
// //                     key={index}
// //                     href={social.href}
// //                     aria-label={social.label}
// //                     className="text-emerald-200 hover:text-white transition-colors text-sm"
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                   >
// //                     {social.icon}
// //                   </a>
// //                 ))}
// //               </div>
// //               <a
// //                 href={ADMIN_URL}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="ml-1 px-2.5 py-1 bg-white text-emerald-700 text-xs font-semibold rounded hover:bg-emerald-50 transition-colors shadow-sm flex items-center gap-1"
// //               >
// //                 <FaTachometerAlt className="text-xs" />
// //                 <span className="hidden md:inline">Admin</span>
// //                 <span className="md:hidden">Login</span>
// //               </a>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Navigation (Compact) */}
// //       <nav className={`bg-white shadow-sm sticky top-0 z-50 font-sans transition-all duration-300 ${
// //         scrolled ? 'shadow-md' : 'shadow-sm'
// //       }`}>
// //         <div className="container mx-auto px-4">
// //           <div className="flex justify-between items-center h-16 md:h-20">
// //             {/* Logo - Compact */}
// //             <div className="flex items-center">
// //               <NavLink 
// //                 to="/" 
// //                 className="flex items-center"
// //                 onClick={() => {
// //                   setIsMobileMenuOpen(false);
// //                   setActiveDropdown(null);
// //                 }}
// //               >
// //                 <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300">
// //                   <img
// //                     src="/matakiri-logo.png"
// //                     alt="Matakiri Tumaini logo"
// //                     className="w-full h-full object-contain"
// //                     onError={(e) => { 
// //                       e.target.onerror = null;
// //                       e.target.src = "/assets/images/fallback-logo.png";
// //                     }}
// //                   />
// //                   <span className="sr-only">Matakiri Tumaini</span>
// //                 </div>
// //               </NavLink>
// //             </div>

// //             {/* Desktop Navigation - Compact */}
// //             <div className="hidden lg:flex items-center space-x-0">
// //               {navItems.map((item, index) => (
// //                 <div key={index} className="relative group">
// //                   {item.subItems ? (
// //                     <button
// //                       onClick={() => handleDropdownToggle(index)}
// //                       className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
// //                         activeDropdown === index || window.location.pathname.startsWith(item.path)
// //                           ? 'text-emerald-700 bg-emerald-50'
// //                           : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// //                       }`}
// //                     >
// //                       <span>{item.label}</span>
// //                       <FiChevronDown className={`transition-transform duration-200 text-xs ${
// //                         activeDropdown === index ? 'rotate-180' : ''
// //                       }`} />
// //                     </button>
// //                   ) : (
// //                     <NavLink
// //                       to={item.path}
// //                       end={item.exact}
// //                       className={({ isActive }) =>
// //                         `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
// //                           isActive
// //                             ? 'text-emerald-700 bg-emerald-50'
// //                             : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// //                         }`
// //                       }
// //                     >
// //                       {item.label}
// //                     </NavLink>
// //                   )}
                  
// //                   {/* Dropdown Menu */}
// //                   {item.subItems && activeDropdown === index && (
// //                     <motion.div
// //                       initial={{ opacity: 0, y: -10 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       exit={{ opacity: 0, y: -10 }}
// //                       className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
// //                     >
// //                       {item.subItems.map((subItem, subIndex) => (
// //                         <NavLink
// //                           key={subIndex}
// //                           to={subItem.path}
// //                           onClick={() => setActiveDropdown(null)}
// //                           className={({ isActive }) =>
// //                             `block px-4 py-2 text-sm font-medium transition-colors ${
// //                               isActive
// //                                 ? 'text-emerald-700 bg-emerald-50'
// //                                 : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// //                             }`
// //                           }
// //                         >
// //                           {subItem.label}
// //                         </NavLink>
// //                       ))}
// //                     </motion.div>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Tablet Menu Button */}
// //             <div className="hidden md:flex lg:hidden">
// //               <button
// //                 onClick={() => setIsMenuOpen(!isMenuOpen)}
// //                 className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors font-medium text-sm"
// //               >
// //                 <span>Menu</span>
// //                 <FiMenu />
// //               </button>
// //             </div>

// //             {/* Mobile menu button */}
// //             <button
// //               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
// //               className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
// //               aria-label="Toggle menu"
// //             >
// //               {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
// //             </button>
// //           </div>

// //           {/* Tablet Dropdown Menu */}
// //           <AnimatePresence>
// //             {isMenuOpen && (
// //               <motion.div
// //                 initial={{ opacity: 0, y: -10, height: 0 }}
// //                 animate={{ opacity: 1, y: 0, height: 'auto' }}
// //                 exit={{ opacity: 0, y: -10, height: 0 }}
// //                 className="hidden md:flex lg:hidden flex-wrap gap-1 pt-3 pb-3 border-t border-gray-100"
// //               >
// //                 {navItems.map((item) => (
// //                   <NavLink
// //                     key={item.path}
// //                     to={item.path}
// //                     end={item.exact}
// //                     onClick={() => setIsMenuOpen(false)}
// //                     className={({ isActive }) =>
// //                       `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
// //                         isActive
// //                           ? 'text-emerald-700 bg-emerald-50'
// //                           : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// //                       }`
// //                     }
// //                   >
// //                     <span>{item.label}</span>
// //                   </NavLink>
// //                 ))}
// //               </motion.div>
// //             )}
// //           </AnimatePresence>
// //         </div>

// //         {/* Mobile Navigation */}
// //         <AnimatePresence>
// //           {isMobileMenuOpen && (
// //             <motion.div
// //               initial={{ opacity: 0, height: 0 }}
// //               animate={{ opacity: 1, height: 'auto' }}
// //               exit={{ opacity: 0, height: 0 }}
// //               className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
// //             >
// //               <div className="px-4 py-3">
// //                 {/* Mobile Contact Info */}
// //                 <div className="mb-3 pb-3 border-b border-gray-100">
// //                   <div className="space-y-2">
// //                     {contactInfo.map((info, index) => (
// //                       <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
// //                         <div className="text-emerald-500 text-sm">
// //                           {info.icon}
// //                         </div>
// //                         <span className="text-xs">{info.text}</span>
// //                       </div>
// //                     ))}
// //                   </div>
                  
// //                   {/* Mobile Social Links */}
// //                   <div className="flex items-center gap-3 mt-3">
// //                     {socialLinks.map((social, index) => (
// //                       <a
// //                         key={index}
// //                         href={social.href}
// //                         aria-label={social.label}
// //                         className="text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                       >
// //                         {social.icon}
// //                       </a>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Mobile Navigation Links */}
// //                 <div className="space-y-0.5">
// //                   {navItems.map((item) => (
// //                     <div key={item.path}>
// //                       <NavLink
// //                         to={item.path}
// //                         end={item.exact}
// //                         onClick={() => setIsMobileMenuOpen(false)}
// //                         className={({ isActive }) =>
// //                           `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
// //                             isActive
// //                               ? 'text-emerald-700 bg-emerald-50'
// //                               : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// //                           }`
// //                         }
// //                       >
// //                         <span>{item.label}</span>
// //                         {item.subItems && <FiChevronDown className="text-gray-400 text-xs" />}
// //                       </NavLink>
                      
// //                       {/* Mobile Submenu */}
// //                       {item.subItems && (
// //                         <div className="ml-3 mt-0.5 space-y-0.5 border-l border-gray-200 pl-3">
// //                           {item.subItems.map((subItem) => (
// //                             <NavLink
// //                               key={subItem.path}
// //                               to={subItem.path}
// //                               onClick={() => setIsMobileMenuOpen(false)}
// //                               className={({ isActive }) =>
// //                                 `block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
// //                                   isActive
// //                                     ? 'text-emerald-700 bg-emerald-50'
// //                                     : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
// //                                 }`
// //                               }
// //                             >
// //                               {subItem.label}
// //                             </NavLink>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* Admin Link in Mobile Menu */}
// //                 <div className="mt-3 pt-3 border-t border-gray-100">
// //                   <a
// //                     href="http://localhost:3002"
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                     className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
// //                     onClick={() => setIsMobileMenuOpen(false)}
// //                   >
// //                     <FaTachometerAlt className="text-emerald-600 text-sm" />
// //                     <span>Admin Dashboard</span>
// //                   </a>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </nav>
// //     </>
// //   );
// // };

// // export default Header;

























// // // import React, { useState, useEffect } from 'react';
// // // import { NavLink, Link } from 'react-router-dom';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import { 
// // //   FiMenu, 
// // //   FiX, 
// // //   FiPhone, 
// // //   FiMail, 
// // //   FiMapPin,
// // //   FiChevronDown
// // // } from 'react-icons/fi';
// // // import { 
// // //   FaFacebook,
// // //   FaTwitter,
// // //   FaInstagram,
// // //   FaLinkedin,
// // //   FaTachometerAlt
// // // } from 'react-icons/fa';

// // // const Header = () => {
// // //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// // //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// // //   const [scrolled, setScrolled] = useState(false);
// // //   const [activeDropdown, setActiveDropdown] = useState(null);

// // //   useEffect(() => {
// // //     const handleScroll = () => {
// // //       setScrolled(window.scrollY > 20);
// // //     };
// // //     window.addEventListener('scroll', handleScroll);
// // //     return () => window.removeEventListener('scroll', handleScroll);
// // //   }, []);

// // //   const navItems = [
// // //     { path: '/', label: 'Home', exact: true },
// // //     { path: '/about', label: 'About Us' },
// // //     { 
// // //       path: '/programs', 
// // //       label: 'Programs',
// // //       subItems: [
// // //         { path: '/programs?category=education', label: 'Education' },
// // //         { path: '/programs?category=health', label: 'Health' },
// // //         { path: '/programs?category=agriculture', label: 'Agriculture' },
// // //         { path: '/programs?category=water', label: 'Water & Sanitation' }
// // //       ]
// // //     },
// // //     { 
// // //       path: '/projects', 
// // //       label: 'Projects',
// // //       subItems: [
// // //         { path: '/projects', label: 'All Projects' },
// // //         { path: '/ai-projects', label: 'AI Projects' },
// // //         { path: '/projects?featured=true', label: 'Featured Projects' }
// // //       ]
// // //     },
// // //     { path: '/team', label: 'Team' },
// // //     { path: '/partners', label: 'Partners' },
// // //     { path: '/news', label: 'News' },
// // //     { path: '/gallery', label: 'Gallery' },
// // //     { path: '/contact', label: 'Contact' },
// // //   ];

// // //   const socialLinks = [
// // //     { icon: <FaFacebook />, href: '#', label: 'Facebook' },
// // //     { icon: <FaTwitter />, href: '#', label: 'Twitter' },
// // //     { icon: <FaInstagram />, href: '#', label: 'Instagram' },
// // //     { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
// // //   ];

// // //   const contactInfo = [
// // //     { icon: <FiPhone />, text: '+254112727453' },
// // //     { icon: <FiMail />, text: 'info@matakiri.org' },
// // //     { icon: <FiMapPin />, text: 'Tharaka, Kenya' },
// // //   ];

// // //   const handleDropdownToggle = (index) => {
// // //     setActiveDropdown(activeDropdown === index ? null : index);
// // //   };

// // //   return (
// // //     <>
// // //       {/* Top Bar - Contact & Social */}
// // //       <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-sans hidden sm:block">
// // //         <div className="container mx-auto px-4">
// // //           <div className="flex flex-col md:flex-row justify-between items-center py-2 md:py-1">
// // //             {/* Contact Info */}
// // //             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 text-xs md:text-sm">
// // //               {contactInfo.map((info, index) => (
// // //                 <div key={index} className="flex items-center gap-2 group">
// // //                   <div className="text-emerald-300 group-hover:text-white transition-colors">
// // //                     {info.icon}
// // //                   </div>
// // //                   <span className="group-hover:text-emerald-100 transition-colors">{info.text}</span>
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {/* Social Links & Admin */}
// // //             <div className="flex items-center gap-3 mt-1 md:mt-0">
// // //               <div className="flex items-center gap-2 border-r border-emerald-600 pr-3">
// // //                 {socialLinks.map((social, index) => (
// // //                   <a
// // //                     key={index}
// // //                     href={social.href}
// // //                     aria-label={social.label}
// // //                     className="text-emerald-200 hover:text-white transition-colors hover:scale-110"
// // //                     target="_blank"
// // //                     rel="noopener noreferrer"
// // //                   >
// // //                     {social.icon}
// // //                   </a>
// // //                 ))}
// // //               </div>
// // //               <a
// // //                 href="http://localhost:3002"
// // //                 target="_blank"
// // //                 rel="noopener noreferrer"
// // //                 className="ml-2 px-3 py-1 bg-white text-emerald-700 text-xs md:text-sm font-semibold rounded hover:bg-emerald-50 transition-colors shadow flex items-center gap-1"
// // //               >
// // //                 <FaTachometerAlt className="text-xs" />
// // //                 <span className="hidden md:inline">Admin</span>
// // //                 <span className="md:hidden">Login</span>
// // //               </a>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Main Navigation */}
// // //       <nav className={`bg-white shadow-sm sticky top-0 z-50 font-sans transition-all duration-300 ${
// // //         scrolled ? 'shadow-lg' : 'shadow'
// // //       }`}>
// // //         <div className="container mx-auto px-4">
// // //           <div className="flex justify-between items-center h-24 md:h-28 lg:h-32">
// // //             {/* Logo */}
// // //             <div className="flex items-center">
// // //               <NavLink 
// // //                 to="/" 
// // //                 className="flex items-center space-x-3 group"
// // //                 onClick={() => {
// // //                   setIsMobileMenuOpen(false);
// // //                   setActiveDropdown(null);
// // //                 }}
// // //               >
// // //                 <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
// // //                   <img
// // //                     src="/matakiri-logo.png"
// // //                     alt="Matakiri Tumaini logo"
// // //                     className="w-full h-full object-contain bg-white"
// // //                     onError={(e) => { e.target.style.display = 'none'; }}
// // //                   />
// // //                   <span className="sr-only">Matakiri Tumaini</span>
// // //                 </div>
// // //                 {/* logo only: title and tagline removed */}
// // //               </NavLink>
// // //             </div>

// // //             {/* Desktop Navigation */}
// // //             <div className="hidden lg:flex items-center space-x-1 ">
// // //               {navItems.map((item, index) => (
// // //                 <div key={index} className="relative group ">
// // //                   {item.subItems ? (
// // //                     <button
// // //                       onClick={() => handleDropdownToggle(index)}
// // //                       className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-md font-semibold transition-all ${
// // //                         activeDropdown === index || window.location.pathname.startsWith(item.path)
// // //                           ? 'text-emerald-700 bg-emerald-50'
// // //                           : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// // //                       }`}
// // //                     >
// // //                       <span>{item.label}</span>
// // //                       <FiChevronDown className={`transition-transform duration-200 ${
// // //                         activeDropdown === index ? 'rotate-180' : ''
// // //                       }`} />
// // //                     </button>
// // //                   ) : (
// // //                     <NavLink
// // //                       to={item.path}
// // //                       end={item.exact}
// // //                       className={({ isActive }) =>
// // //                         `px-4 py-2 rounded-lg text-md font-semibold transition-all ${
// // //                           isActive
// // //                             ? 'text-emerald-700 bg-emerald-50'
// // //                             : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// // //                         }`
// // //                       }
// // //                     >
// // //                       {item.label}
// // //                     </NavLink>
// // //                   )}
                  
// // //                   {/* Dropdown Menu */}
// // //                   {item.subItems && activeDropdown === index && (
// // //                     <motion.div
// // //                       initial={{ opacity: 0, y: -10 }}
// // //                       animate={{ opacity: 1, y: 0 }}
// // //                       exit={{ opacity: 0, y: -10 }}
// // //                       className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
// // //                     >
// // //                       {item.subItems.map((subItem, subIndex) => (
// // //                         <NavLink
// // //                           key={subIndex}
// // //                           to={subItem.path}
// // //                           onClick={() => setActiveDropdown(null)}
// // //                           className={({ isActive }) =>
// // //                             `block px-4 py-2 text-sm font-semibold transition-colors ${
// // //                               isActive
// // //                                 ? 'text-emerald-700 bg-emerald-50'
// // //                                 : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// // //                             }`
// // //                           }
// // //                         >
// // //                           {subItem.label}
// // //                         </NavLink>
// // //                       ))}
// // //                     </motion.div>
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {/* Tablet Menu Button */}
// // //             <div className="hidden md:flex lg:hidden">
// // //               <button
// // //                 onClick={() => setIsMenuOpen(!isMenuOpen)}
// // //                 className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors font-medium"
// // //               >
// // //                 <span>Menu</span>
// // //                 <FiMenu />
// // //               </button>
// // //             </div>

// // //             {/* Mobile menu button */}
// // //             <button
// // //               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
// // //               className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
// // //               aria-label="Toggle menu"
// // //             >
// // //               {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
// // //             </button>
// // //           </div>

// // //           {/* Tablet Dropdown Menu */}
// // //           <AnimatePresence>
// // //             {isMenuOpen && (
// // //               <motion.div
// // //                 initial={{ opacity: 0, y: -10, height: 0 }}
// // //                 animate={{ opacity: 1, y: 0, height: 'auto' }}
// // //                 exit={{ opacity: 0, y: -10, height: 0 }}
// // //                 className="hidden md:flex lg:hidden flex-wrap gap-2 pt-4 pb-4 border-t border-gray-100"
// // //               >
// // //                 {navItems.map((item) => (
// // //                   <NavLink
// // //                     key={item.path}
// // //                     to={item.path}
// // //                     end={item.exact}
// // //                     onClick={() => setIsMenuOpen(false)}
// // //                         className={({ isActive }) =>
// // //                           `px-4 py-2 rounded-lg text-xl font-bold transition-all ${
// // //                         isActive
// // //                           ? 'text-emerald-700 bg-emerald-50'
// // //                           : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// // //                       }`
// // //                     }
// // //                   >
// // //                     <span>{item.label}</span>
// // //                   </NavLink>
// // //                 ))}
// // //               </motion.div>
// // //             )}
// // //           </AnimatePresence>
// // //         </div>

// // //         {/* Mobile Navigation */}
// // //         <AnimatePresence>
// // //           {isMobileMenuOpen && (
// // //             <motion.div
// // //               initial={{ opacity: 0, height: 0 }}
// // //               animate={{ opacity: 1, height: 'auto' }}
// // //               exit={{ opacity: 0, height: 0 }}
// // //               className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
// // //             >
// // //               <div className="px-4 py-2">
// // //                 {/* Mobile Contact Info */}
// // //                 <div className="mb-4 pb-4 border-b border-gray-100">
// // //                   <div className="space-y-2">
// // //                     {contactInfo.map((info, index) => (
// // //                       <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
// // //                         <div className="text-emerald-500">
// // //                           {info.icon}
// // //                         </div>
// // //                         <span>{info.text}</span>
// // //                       </div>
// // //                     ))}
// // //                   </div>
                  
// // //                   {/* Mobile Social Links */}
// // //                   <div className="flex items-center gap-4 mt-4">
// // //                     {socialLinks.map((social, index) => (
// // //                       <a
// // //                         key={index}
// // //                         href={social.href}
// // //                         aria-label={social.label}
// // //                         className="text-emerald-600 hover:text-emerald-700 transition-colors"
// // //                         target="_blank"
// // //                         rel="noopener noreferrer"
// // //                       >
// // //                         {social.icon}
// // //                       </a>
// // //                     ))}
// // //                   </div>
// // //                 </div>

// // //                 {/* Mobile Navigation Links */}
// // //                 <div className="space-y-1">
// // //                   {navItems.map((item) => (
// // //                     <div key={item.path}>
// // //                       <NavLink
// // //                         to={item.path}
// // //                         end={item.exact}
// // //                         onClick={() => setIsMobileMenuOpen(false)}
// // //                         className={({ isActive }) =>
// // //                           `flex items-center justify-between px-4 py-3 rounded-lg text-xl font-bold transition-colors ${
// // //                             isActive
// // //                               ? 'text-emerald-700 bg-emerald-50'
// // //                               : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
// // //                           }`
// // //                         }
// // //                       >
// // //                         <span>{item.label}</span>
// // //                         {item.subItems && <FiChevronDown className="text-gray-400" />}
// // //                       </NavLink>
                      
// // //                       {/* Mobile Submenu */}
// // //                       {item.subItems && (
// // //                         <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
// // //                           {item.subItems.map((subItem) => (
// // //                             <NavLink
// // //                               key={subItem.path}
// // //                               to={subItem.path}
// // //                               onClick={() => setIsMobileMenuOpen(false)}
// // //                               className={({ isActive }) =>
// // //                                 `block px-4 py-2 text-xl font-bold rounded-lg transition-colors ${
// // //                                   isActive
// // //                                     ? 'text-emerald-700 bg-emerald-50'
// // //                                     : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
// // //                                 }`
// // //                               }
// // //                             >
// // //                               {subItem.label}
// // //                             </NavLink>
// // //                           ))}
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   ))}
// // //                 </div>

// // //                 {/* Admin Link in Mobile Menu */}
// // //                 {/* <div className="mt-4 pt-4 border-t border-gray-100">
// // //                   <a
// // //                     href="http://localhost:3002"
// // //                     target="_blank"
// // //                     rel="noopener noreferrer"
// // //                     className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
// // //                     onClick={() => setIsMobileMenuOpen(false)}
// // //                   >
// // //                     <FaTachometerAlt className="text-emerald-600" />
// // //                     <span>Admin Dashboard</span>
// // //                   </a>
// // //                 </div> */}
// // //               </div>
// // //             </motion.div>
// // //           )}
// // //         </AnimatePresence>
// // //       </nav>
// // //     </>
// // //   );
// // // };

// // // export default Header;






