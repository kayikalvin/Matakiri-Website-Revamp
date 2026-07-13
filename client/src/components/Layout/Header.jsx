import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const logoRef = useRef(null);

  // Motion values for scroll
  const scrollY = useMotionValue(0);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.88]);
  const headerBorderOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  // Magnetic logo tilt
  const logoX = useMotionValue(0);
  const logoY = useMotionValue(0);
  const logoRotateX = useSpring(useTransform(logoY, [-20, 20], [6, -6]), {
    stiffness: 300,
    damping: 20,
  });
  const logoRotateY = useSpring(useTransform(logoX, [-20, 20], [-6, 6]), {
    stiffness: 300,
    damping: 20,
  });

  const handleLogoMouseMove = (e) => {
    const rect = logoRef.current?.getBoundingClientRect();
    if (!rect) return;
    logoX.set(e.clientX - (rect.left + rect.width / 2));
    logoY.set(e.clientY - (rect.top + rect.height / 2));
  };
  const handleLogoMouseLeave = () => {
    logoX.set(0);
    logoY.set(0);
  };

  const sections = [
    { id: 'home', label: 'Home', type: 'home' },
    { id: 'about', label: 'About', type: 'route', path: '/about' },
    { id: 'partners', label: 'Partners', type: 'scroll' },
    { id: 'stats', label: 'Stats', type: 'scroll' },
    { id: 'projects', label: 'Projects', type: 'scroll' },
    { id: 'gallery', label: 'Gallery', type: 'route', path: '/gallery' },
    { id: 'team', label: 'Team', type: 'route', path: '/team' },
    { id: 'news', label: 'News', type: 'scroll' },
    { id: 'contact', label: 'Contact', type: 'route', path: '/contact' },
  ];

  const contactInfo = [
    { icon: PhoneIcon, text: '+254112727453' },
    { icon: EnvelopeIcon, text: 'info@matakiri.org' },
    { icon: MapPinIcon, text: 'Tharaka, Kenya' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollY.set(currentScrollY);
      setScrolled(currentScrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    const currentIndex = sections.findIndex(
      (s) => s.type === 'route' && location.pathname === s.path
    );
    if (currentIndex !== -1) setActiveIndex(currentIndex);
    else setActiveIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (section, index) => (e) => {
    e?.preventDefault?.();
    setActiveIndex(index);
    setIsMobileMenuOpen(false);

    if (section.type === 'home') {
      if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
      else navigate('/');
    } else if (section.type === 'route') {
      navigate(section.path);
    } else if (section.type === 'scroll') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(section.id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        const el = document.getElementById(section.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <div className="h-[2px] bg-signal" />

      <motion.nav
        initial={{ background: 'rgba(247,243,234,0)' }}
        animate={{
          background: scrolled
            ? 'rgba(247,243,234,0.88)'
            : 'rgba(247,243,234,0)',
          backdropFilter: scrolled ? 'blur(14px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 z-50 border-b border-transparent"
      >
        {/* Animated hairline border that fades in on scroll */}
        <motion.div
          style={{ opacity: headerBorderOpacity }}
          className="absolute inset-x-0 bottom-0 h-px bg-[rgba(228,220,200,0.8)] pointer-events-none"
        />

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo – magnetic tilt + scroll scale */}
            <motion.a
              ref={logoRef}
              href="/"
              onClick={handleNavClick({ type: 'home' }, 0)}
              onMouseMove={handleLogoMouseMove}
              onMouseLeave={handleLogoMouseLeave}
              style={{
                scale: logoScale,
                rotateX: logoRotateX,
                rotateY: logoRotateY,
                perspective: 400,
              }}
              className="flex items-center flex-shrink-0 origin-left focus-visible:outline-2 focus-visible:outline-laterite-500 focus-visible:outline-offset-2"
            >
              <img
                src="/matakiri-logo.png"
                alt="Matakiri Tumaini"
                className="h-10 md:h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/images/fallback-logo.png';
                }}
              />
            </motion.a>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-1 relative">
              {sections.map((section, index) => {
                const isActive =
                  (section.type === 'scroll' &&
                    location.pathname === '/' &&
                    activeIndex === index) ||
                  (section.type === 'route' && location.pathname === section.path);
                return (
                  <button
                    key={section.id}
                    onClick={handleNavClick(section, index)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-laterite-500 focus-visible:outline-offset-2 group ${
                      isActive ? 'text-laterite-500' : 'text-ink-500 hover:text-ink-800'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {isActive && (
                        <motion.span
                          layoutId="activeNavDot"
                          className="h-1 w-1 rounded-full bg-laterite-500"
                          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                        />
                      )}
                      {section.label}
                    </span>
                    {/* Hover underline – slides from left */}
                    <span className="absolute bottom-0.5 left-3 right-3 h-px bg-ink-300 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                    {/* Active underline */}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavUnderline"
                        className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-signal"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile menu button – animated icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-[1000] lg:hidden p-2 text-ink-500 hover:text-laterite-500 transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500 focus-visible:outline-offset-2"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu – moved outside the nav for proper full‑bleed */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[999] bg-white lg:hidden overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col justify-between px-6 pt-24 pb-10">
              <nav className="space-y-0">
                {sections.map((section, index) => {
                  const isActive =
                    (section.type === 'route' && location.pathname === section.path) ||
                    (section.type === 'scroll' &&
                      location.pathname === '/' &&
                      activeIndex === index);
                  return (
                    <motion.button
                      key={section.id}
                      onClick={handleNavClick(section, index)}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{
                        delay: 0.08 + index * 0.045,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`group w-full flex items-baseline gap-4 py-3 border-b border-border/60 text-left focus-visible:outline-2 focus-visible:outline-laterite-500 ${
                        isActive ? 'text-laterite-500' : 'text-ink-800'
                      }`}
                    >
                      <span className="font-serif text-xs text-ink-300 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-3xl font-serif tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                        {section.label}
                      </span>
                      <ArrowUpRightIcon
                        className={`h-4 w-4 flex-shrink-0 transition-opacity duration-300 ${
                          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="pt-8 space-y-3"
              >
                {contactInfo.map((info, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-ink-500">
                    <info.icon className="h-4 w-4 text-laterite-500 flex-shrink-0" />
                    {info.text}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;