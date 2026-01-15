import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHandsHelping,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  // Function to scroll to a section
  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    
    // If we're already on home page, scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100; // Adjust for header
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle home click - scroll to top if already on home
  const handleHomeClick = (e) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  // Define footer links for sections on the home page
  const footerLinks = {
    "Quick Links": [
      { id: "home", label: "Home" },
      { id: "about", label: "About Us" },
      { id: "projects", label: "Our Projects" },
      { id: "team", label: "Our Team" },
    ],
    "Explore": [
      { id: "partners", label: "Partners" },
      { id: "gallery", label: "Photo Gallery" },
      { id: "news", label: "News & Updates" },
      { id: "contact", label: "Contact Us" },
    ],
    // 'Support': [
    //   { to: '/donate', label: 'Donate' },
    //   { to: '/volunteer', label: 'Volunteer' },
    //   { to: '/contact', label: 'Contact Us' },
    //   { to: '/reports', label: 'Annual Reports' },
    // ]
  };

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: <FaPhone />, text: '+254112727453' },
    { icon: <FaEnvelope />, text: 'info@matakiri.org' },
    { icon: <FaMapMarkerAlt />, text: 'Tharaka South Division, Tharaka, Kenya' },
  ];

  return (
    <footer className="bg-primary-700 text-white font-sans">
      {/* Newsletter Section */}
      {/* <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FaHandsHelping className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold font-display mb-4 text-accent-500">
              Stay Updated with Our Work
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest updates on our
              projects, success stories, and upcoming events.
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
      </div> */}

      {/* Main Footer Content */}
      <div className="py-12 font-sans">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Organization Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="w-full h-32 md:h-20">
                <a href="/" onClick={handleHomeClick} className="cursor-pointer">
                  <img
                    src="/matakiri-logo.png"
                    alt="Matakiri Tumaini Centre Logo"
                    className="h-full w-auto object-contain align-top"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/images/fallback-logo.png";
                    }}
                  />
                </a>
              </div>
              <p className="text-neutral-200 font-semibold text-sm">
                A humanitarian and innovation-driven institution focused on
                community development and AI-based solutions for sustainable
                impact in Kenya.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors shadow"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links - Section Navigation */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold mb-4 border-b border-accent-500 pb-2 text-accent-500">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => link.id === 'home' ? handleHomeClick({ preventDefault: () => {} }) : scrollToSection(link.id)}
                        className="text-neutral-200 text-sm hover:text-accent-500 transition-colors flex items-center group font-semibold w-full text-left"
                      >
                        <span className="w-1 h-1 bg-accent-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                        <span>{link.label}</span>
                      </button>
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
              <div className="space-y-4 font-semibold text-sm">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-accent-500 mt-1 flex-shrink-0">
                      {info.icon}
                    </div>
                    <span className="text-neutral-200">
                      {info.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-accent-500 py-6 font-bold">
        <div className="container mx-auto px-4">
          <div className="flex  md:flex-row justify-center items-center">
            <div className="text-neutral-200 text-sm">
              © {currentYear} Matakiri Tumaini Centre. All rights reserved.
            </div>
           
            {/* Optional: Privacy and Terms links if you have separate pages for these */}
            {/* <div className="text-neutral-200 text-sm mt-2 md:mt-0 flex gap-4">
              <button
                onClick={() => navigate('/privacy')}
                className="hover:text-accent-500 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate('/terms')}
                className="hover:text-accent-500 transition-colors"
              >
                Terms of Service
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

















// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   FaFacebook,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedin,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaEnvelope,
//   FaHandsHelping,
//   FaArrowRight,
// } from "react-icons/fa";

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   const footerLinks = {
//     "Quick Links": [
//       { to: "/", label: "Home" },
//       { to: "/about", label: "About Us" },
//       { to: "/programs", label: "Our Programs" },
//       { to: "/ai-projects", label: "AI Projects" },
//     ],
//     Resources: [
//       { to: "/news", label: "News & Updates" },
//       { to: "/gallery", label: "Photo Gallery" },
//       { to: "/projects", label: "Projects" },
//       { to: "/partners", label: "Partners" },
//     ],
//     // 'Support': [
//     //   { to: '/donate', label: 'Donate' },
//     //   { to: '/volunteer', label: 'Volunteer' },
//     //   { to: '/contact', label: 'Contact Us' },
//     //   { to: '/reports', label: 'Annual Reports' },
//     // ]
//   };

//   return (
//     <footer className="bg-primary-700 text-white font-sans">
//       {/* Newsletter Section */}
//       {/* <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-12">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
//               <FaHandsHelping className="text-2xl" />
//             </div>
//             <h3 className="text-2xl font-bold font-display mb-4 text-accent-500">
//               Stay Updated with Our Work
//             </h3>
//             <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
//               Subscribe to our newsletter for the latest updates on our
//               projects, success stories, and upcoming events.
//             </p>
//             <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
//               <input
//                 type="email"
//                 placeholder="Your email address"
//                 className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-accent-500 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
//               />
//               <button
//                 type="submit"
//                 className="px-6 py-3 bg-accent-500 text-primary-700 rounded-lg font-semibold hover:bg-accent-600 transition-colors flex items-center justify-center shadow"
//               >
//                 Subscribe
//                 <FaArrowRight className="ml-2" />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div> */}

//       {/* Main Footer Content */}
//       <div className="py-12 font-sans">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
//             {/* Organization Info */}
//             <div className="lg:col-span-2 space-y-6">
//               <div className="w-full h-32 md:h-20">
//   <img
//     src="/matakiri-logo.png"
//     alt="Matakiri Tumaini Centre Logo"
//     className="h-full w-auto object-contain align-top"
//     onError={(e) => {
//       e.target.onerror = null;
//       e.target.src = "/assets/images/fallback-logo.png";
//     }}
//   />
// </div>
//               <p className="text-neutral-200 font-semibold text-sm">
//                 A humanitarian and innovation-driven institution focused on
//                 community development and AI-based solutions for sustainable
//                 impact in Kenya.
//               </p>
//               <div className="flex space-x-4">
//                 {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map(
//                   (Icon, index) => (
//                     <a
//                       key={index}
//                       href="#"
//                       className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors shadow"
//                     >
//                       <Icon className="text-white" />
//                     </a>
//                   )
//                 )}
//               </div>
//             </div>

//             {/* Footer Links */}
//             {Object.entries(footerLinks).map(([category, links]) => (
//               <div key={category}>
//                 <h4 className="text-lg font-semibold mb-4 border-b border-accent-500 pb-2 text-accent-500">
//                   {category}
//                 </h4>
//                 <ul className="space-y-3">
//                   {links.map((link) => (
//                     <li key={link.to}>
//                       <Link
//                         to={link.to}
//                         className="text-neutral-200 text-sm hover:text-accent-500 transition-colors flex items-center group font-semibold"
//                       >
//                         <span className="w-1 h-1 bg-accent-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
//                         <span>{link.label}</span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}

//             {/* Contact Info */}
//             <div>
//               <h4 className="text-lg font-semibold mb-4 border-b border-accent-500 pb-2 text-accent-500">
//                 Contact Us
//               </h4>
//               <div className="space-y-4 font-semibold text-sm">
//                 <div className="flex items-start space-x-3">
//                   <FaMapMarkerAlt className="text-accent-500 mt-1 flex-shrink-0" />
//                   <span className="text-neutral-200 ">
//                     Tharaka South Division
//                     <br />
//                     Tharaka, Kenya
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <FaPhone className="text-accent-500 flex-shrink-0" />
//                   <span className="text-neutral-200">+254112727453</span>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <FaEnvelope className="text-accent-500 flex-shrink-0" />
//                   <span className="text-neutral-200">
//                     info@matakiri.org
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Copyright */}
//       <div className="border-t border-accent-500 py-6 font-bold">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="text-neutral-200 text-sm">
//               © {currentYear} Matakiri Tumaini Centre. All rights reserved.
//             </div>
//             <div className="text-neutral-200 text-sm mt-2 md:mt-0">
//               Registered Charity No: 1204161
//               {/* OP.218/051/12-0392/10036 */}
//             </div>
//             {/* <div className="text-neutral-200 text-sm mt-2 md:mt-0 flex gap-4">
//               <Link
//                 to="/privacy"
//                 className="hover:text-accent-500 transition-colors"
//               >
//                 Privacy Policy
//               </Link>
//               <Link
//                 to="/terms"
//                 className="hover:text-accent-500 transition-colors"
//               >
//                 Terms of Service
//               </Link>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
