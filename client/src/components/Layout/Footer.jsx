// import React from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   const footerLinks = {
//     'Quick Links': [
//       { to: '/', label: 'Home' },
//       { to: '/about', label: 'About Us' },
//       { to: '/programs', label: 'Our Programs' },
//       { to: '/ai-projects', label: 'AI Projects' },
//     ],
//     'Resources': [
//       { to: '/news', label: 'News & Updates' },
//       { to: '/gallery', label: 'Photo Gallery' },
//       { to: '/projects', label: 'Projects' },
//       { to: '/partners', label: 'Partners' },
//     ],
//     'Legal': [
//       { to: '/privacy', label: 'Privacy Policy' },
//       { to: '/terms', label: 'Terms of Service' },
//       { to: '/reports', label: 'Annual Reports' },
//     ],
//   };

//   return (
//     <footer className="bg-gray-900 text-white pt-12 pb-8">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Organization Info */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">MTC</span>
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold font-display">Matakiri Tumaini Centre</h3>
//                 <p className="text-gray-400 text-sm">Transforming Communities Through Innovation</p>
//               </div>
//             </div>
//             <p className="text-gray-300">
//               A humanitarian and innovation-driven institution focused on community development and AI-based solutions.
//             </p>
//             <div className="flex space-x-4">
//               {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
//                 <motion.a
//                   key={index}
//                   href="#"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
//                 >
//                   <Icon className="text-white" />
//                 </motion.a>
//               ))}
//             </div>
//           </div>

//           {/* Footer Links */}
//           {Object.entries(footerLinks).map(([category, links]) => (
//             <div key={category}>
//               <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
//                 {category}
//               </h4>
//               <ul className="space-y-2">
//                 {links.map((link) => (
//                   <li key={link.to}>
//                     <Link
//                       to={link.to}
//                       className="text-gray-400 hover:text-primary-400 transition-colors flex items-center space-x-2"
//                     >
//                       <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
//                       <span>{link.label}</span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}

//           {/* Contact Info */}
//           <div>
//             <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
//               Contact Us
//             </h4>
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3">
//                 <FaMapMarkerAlt className="text-primary-400 mt-1" />
//                 <span className="text-gray-300">
//                   Matakiri Village, Kisumu County<br />
//                   Kenya
//                 </span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <FaPhone className="text-primary-400" />
//                 <span className="text-gray-300">+254 712 345 678</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <FaEnvelope className="text-primary-400" />
//                 <span className="text-gray-300">info@matakiritrust.org</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-gray-800 mt-8 pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400 text-sm">
//               © {currentYear} Matakiri Tumaini Centre. All rights reserved.
//             </p>
//             <p className="text-gray-400 text-sm mt-2 md:mt-0">
//               Registered Charity No: OP.218/051/12-0392/10036
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaHandsHelping,
  FaArrowRight
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About Us' },
      { to: '/programs', label: 'Our Programs' },
      { to: '/ai-projects', label: 'AI Projects' },
    ],
    'Resources': [
      { to: '/news', label: 'News & Updates' },
      { to: '/gallery', label: 'Photo Gallery' },
      { to: '/projects', label: 'Projects' },
      { to: '/partners', label: 'Partners' },
    ],
    'Support': [
      { to: '/donate', label: 'Donate' },
      { to: '/volunteer', label: 'Volunteer' },
      { to: '/contact', label: 'Contact Us' },
      { to: '/reports', label: 'Annual Reports' },
    ]
  };

  return (
    <footer className="bg-primary-700 text-white font-sans">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FaHandsHelping className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold font-display mb-4 text-accent-500">Stay Updated with Our Work</h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest updates on our projects, success stories, and upcoming events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-accent-500 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent-500 text-primary-700 rounded-lg font-semibold hover:bg-accent-600 transition-colors flex items-center justify-center shadow"
              >
                Subscribe
                <FaArrowRight className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 font-sans">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Organization Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 shadow-lg flex items-center justify-center overflow-hidden">
                  <img
                    src="/matakiri-logo.png"
                    alt="Matakiri Tumaini Centre logo"
                    className="w-full h-full object-contain bg-white"
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-accent-500">Matakiri Tumaini Centre</h3>
                  <p className="text-accent-500 text-sm">Transforming Communities Through Innovation</p>
                </div>
              </div>
              <p className="text-neutral-200">
                A humanitarian and innovation-driven institution focused on community development 
                and AI-based solutions for sustainable impact in Kenya.
              </p>
              <div className="flex space-x-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors shadow"
                  >
                    <Icon className="text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold mb-4 border-b border-accent-500 pb-2 text-accent-500">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-neutral-200 hover:text-accent-500 transition-colors flex items-center group font-semibold"
                      >
                        <span className="w-1 h-1 bg-accent-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-accent-500 pb-2 text-accent-500">
                Contact Us
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-accent-500 mt-1 flex-shrink-0" />
                  <span className="text-neutral-200">
                    Matakiri Village<br />
                    Tharaka County, Kenya
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-accent-500 flex-shrink-0" />
                  <span className="text-neutral-200">+254 712 345 678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-accent-500 flex-shrink-0" />
                  <span className="text-neutral-200">info@matakiritrust.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-accent-500 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-200 text-sm">
              © {currentYear} Matakiri Tumaini Centre. All rights reserved.
            </div>
            <div className="text-neutral-200 text-sm mt-2 md:mt-0">
              Registered Charity No: 1204161
              {/* OP.218/051/12-0392/10036 */}
            </div>
            <div className="text-neutral-200 text-sm mt-2 md:mt-0 flex gap-4">
              <Link to="/privacy" className="hover:text-accent-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-accent-500 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;