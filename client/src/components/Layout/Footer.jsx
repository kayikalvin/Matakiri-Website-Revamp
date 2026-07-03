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

  // Footer links with type: 'home', 'scroll', or 'route'
  const footerLinks = {
    'Quick Links': [
      { id: 'home', label: 'Home', type: 'home' },
      { id: 'about', label: 'About Us', type: 'route', path: '/about' },
      { id: 'projects', label: 'Our Projects', type: 'scroll' },
      { id: 'team', label: 'Our Team', type: 'route', path: '/team' },
    ],
    Explore: [
      { id: 'partners', label: 'Partners', type: 'scroll' },
      { id: 'gallery', label: 'Gallery', type: 'route', path: '/gallery' },
      { id: 'news', label: 'News & Updates', type: 'scroll' },
      { id: 'contact', label: 'Contact Us', type: 'route', path: '/contact' },
    ],
  };

  const contactInfo = [
    { icon: PhoneIcon, text: '+254112727453' },
    { icon: EnvelopeIcon, text: 'info@matakiri.org' },
    { icon: MapPinIcon, text: 'Tharaka South Division, Tharaka, Kenya' },
  ];

  // Universal click handler
  const handleFooterClick = (link) => (e) => {
    e?.preventDefault?.();
    if (link.type === 'home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
    } else if (link.type === 'route') {
      navigate(link.path);
    } else if (link.type === 'scroll') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(link.id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        const el = document.getElementById(link.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="bg-soil-900 text-parchment-50 font-sans">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <a href="/" onClick={(e) => { e.preventDefault(); handleFooterClick({ type: 'home' })(); }} className="inline-block">
              <img
                src="/matakiri-logo.png"
                alt="Matakiri Tumaini Centre"
                className="h-12 w-auto object-contain brightness-0 invert"
                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/fallback-logo.png'; }}
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

          {/* Footer link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display text-lg font-medium text-maize-400 mb-4 border-b border-maize-400/30 pb-2">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={handleFooterClick(link)}
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