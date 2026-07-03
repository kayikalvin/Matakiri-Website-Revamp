import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const footerLinks = {
    'Quick Links': [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About Us' },
      { id: 'projects', label: 'Our Projects' },
      { id: 'team', label: 'Our Team' },
    ],
    Explore: [
      { id: 'partners', label: 'Partners' },
      { id: 'gallery', label: 'Gallery' },
      { id: 'news', label: 'News & Updates' },
      { id: 'contact', label: 'Contact Us' },
    ],
  };

  const contactInfo = [
    { icon: PhoneIcon, text: '+254112727453' },
    { icon: EnvelopeIcon, text: 'info@matakiri.org' },
    { icon: MapPinIcon, text: 'Tharaka South Division, Tharaka, Kenya' },
  ];

  return (
    <footer className="bg-soil-900 text-parchment-50 font-sans">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <a href="/" onClick={handleHomeClick} className="inline-block">
              <img
                src="/matakiri-logo.png"
                alt="Matakiri Tumaini Centre"
                className="h-12 w-auto object-contain brightness-0 invert"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/images/fallback-logo.png';
                }}
              />
            </a>
            <p className="text-parchment-100/70 text-sm leading-relaxed">
              A humanitarian and innovation-driven institution focused on community development
              and AI-based solutions for sustainable impact in Kenya.
            </p>
            <p className="text-xs font-mono text-parchment-100/50">
              Registered Charity No: 1204161
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display text-lg font-medium text-maize-400 mb-4 border-b border-maize-400/30 pb-2">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() =>
                        link.id === 'home'
                          ? handleHomeClick({ preventDefault: () => {} })
                          : scrollToSection(link.id)
                      }
                      className="text-parchment-100/70 hover:text-laterite-400 transition-colors text-sm text-left w-full"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-medium text-maize-400 mb-4 border-b border-maize-400/30 pb-2">
              Contact
            </h4>
            <div className="space-y-3">
              {contactInfo.map((info, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-parchment-100/70">
                  <info.icon className="h-5 w-5 text-maize-400 mt-0.5 flex-shrink-0" />
                  <span>{info.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-parchment-100/10 py-5">
        <div className="container mx-auto px-4 text-center text-xs font-mono text-parchment-100/40">
          © {currentYear} Matakiri Tumaini Centre. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;