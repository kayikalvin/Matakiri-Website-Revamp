import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaHandsHelping, 
  FaRocket,
  FaBrain,
  FaMicrochip
} from 'react-icons/fa';
import { FaLightbulb } from 'react-icons/fa6';

// Slideshow images - replace with your actual images
const slideshowImages = [
  {
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Community Empowerment",
    description: "Bringing technology and education to rural communities",
    color: "from-yellow-400/20 to-amber-500/20"
  },
  {
    url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "AI in Agriculture",
    description: "Using AI to improve farming practices and crop yields",
    color: "from-emerald-400/20 to-green-500/20"
  },
  {
    url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Digital Education",
    description: "Providing digital literacy and computer skills training",
    color: "from-cyan-400/20 to-blue-500/20"
  },
  {
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Healthcare Innovation",
    description: "Improving healthcare access through technology",
    color: "from-purple-400/20 to-pink-500/20"
  },
  {
    url: "https://images.unsplash.com/photo-1573164713714-d95e436ab490?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    title: "Sustainable Development",
    description: "Creating sustainable solutions for community development",
    color: "from-orange-400/20 to-red-500/20"
  }
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Auto scroll effect with scaling
  useEffect(() => {
    if (isPaused) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused]);

  // Handle mouse wheel for manual scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
        if (e.deltaY > 0) {
          // Scroll down - next slide
          setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
        } else {
          // Scroll up - previous slide
          setCurrentIndex((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Calculate positions for 3D effect
  const getSlidePosition = (index) => {
    const offset = index - currentIndex;
    const totalSlides = slideshowImages.length;
    
    // Normalize offset to handle wrap-around
    let normalizedOffset = offset;
    if (normalizedOffset > totalSlides / 2) normalizedOffset -= totalSlides;
    if (normalizedOffset < -totalSlides / 2) normalizedOffset += totalSlides;
    
    return {
      scale: Math.max(0.8, 1 - Math.abs(normalizedOffset) * 0.2),
      opacity: Math.max(0.2, 1 - Math.abs(normalizedOffset) * 0.5),
      zIndex: 10 - Math.abs(normalizedOffset),
      rotateY: normalizedOffset * 15,
      x: normalizedOffset * 300,
      blur: Math.abs(normalizedOffset) * 2
    };
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-400 to-accent-400 text-white overflow-hidden min-h-[80vh]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-400 to-accent-300"></div>
        
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-200/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-200/20 via-transparent to-transparent"></div>
        </div>

        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-primary-100/30 to-accent-100/30 rounded-full blur-3xl"
        ></motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-l from-primary-200/30 to-accent-200/30 rounded-full blur-3xl"
        ></motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-100/40 to-accent-100/40 backdrop-blur-lg rounded-full px-6 py-3 border border-primary-200 shadow-lg"
            >
              <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full shadow-md">
                <FaHandsHelping className="text-white text-sm" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white">Since 2010</span>
                <span className="mx-2 text-primary-300">•</span>
                <span className="text-sm text-primary-100">Transforming Communities</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-tight">
                Empowering Communities
                <span className="block mt-2 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-200 bg-clip-text text-transparent">
                  Through AI & Innovation
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-primary-800 leading-relaxed max-w-2xl">
                At <span className="font-semibold text-accent-500">Matakiri Tumaini Centre</span>, we blend humanitarian compassion with cutting-edge technology to create sustainable solutions that uplift communities across Kenya.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link
                to="/programs"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explore Our Impact
                  <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              
              <Link
                to="/ai-projects"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-100/40 to-accent-100/40 backdrop-blur-sm text-primary-700 font-semibold rounded-xl border-2 border-primary-200 hover:border-accent-500 hover:bg-primary-100/60 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <FaRocket className="mr-3 group-hover:rotate-12 transition-transform" />
                <span>AI Initiatives</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Advanced Slideshow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Slideshow Container */}
            <div 
              ref={containerRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative h-[600px] rounded-3xl overflow-hidden perspective-1000"
            >
              {/* Auto-scrolling 3D Slideshow */}
              <div className="relative w-full h-full">
                {slideshowImages.map((slide, index) => {
                  const position = getSlidePosition(index);
                  
                  return (
                    <motion.div
                      key={index}
                      className={`absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 ${slide.color}`}
                      style={{
                        transformStyle: 'preserve-3d',
                        scale: position.scale,
                        opacity: position.opacity,
                        zIndex: position.zIndex,
                        rotateY: position.rotateY,
                        x: position.x,
                        filter: `blur(${position.blur}px)`,
                        transformOrigin: 'center center'
                      }}
                      animate={{
                        scale: position.scale,
                        opacity: position.opacity,
                        rotateY: position.rotateY,
                        x: position.x,
                        filter: `blur(${position.blur}px)`
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        duration: 0.5
                      }}
                    >
                      {/* Image with parallax effect */}
                      <motion.div
                        animate={{
                          scale: index === currentIndex ? 1.05 : 1,
                        }}
                        transition={{
                          duration: 5,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0"
                      >
                        <img
                          src={slide.url}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      
                      {/* Content Overlay (only for center slide) */}
                      {index === currentIndex && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="absolute bottom-0 left-0 right-0 p-8"
                        >
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {slide.title}
                          </h3>
                          <p className="text-blue-100 text-sm">
                            {slide.description}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Slide Counter */}
              <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 z-30">
                <div className="text-white text-sm font-medium">
                  <span className="text-xl font-bold">{currentIndex + 1}</span>
                  <span className="mx-1">/</span>
                  <span>{slideshowImages.length}</span>
                </div>
              </div>

              {/* Auto-scroll Indicator */}
              <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 z-30">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-red-400' : 'bg-green-400'}`}></div>
                  <span className="text-white text-sm">
                    {isPaused ? 'Paused' : 'Auto-scrolling'}
                  </span>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
                {slideshowImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  >
                    {index === currentIndex && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute inset-0 bg-white rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating Icons around the slideshow */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 -left-6 p-5 rounded-2xl shadow-2xl bg-gradient-to-br from-yellow-400 to-amber-500 z-30"
            >
              <div className="text-2xl">
                <FaRocket className="text-white" />
              </div>
              <div className="absolute inset-0 bg-yellow-400/30 blur-xl -z-10 rounded-2xl"></div>
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-6 -right-6 p-5 rounded-2xl shadow-2xl bg-gradient-to-br from-cyan-400 to-blue-500 z-30"
            >
              <div className="text-2xl">
                <FaLightbulb className="text-white" />
              </div>
              <div className="absolute inset-0 bg-cyan-400/30 blur-xl -z-10 rounded-2xl"></div>
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -10, 0],
                x: [0, 5, 0]
              }}
              transition={{ 
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute top-8 -right-4 p-4 rounded-xl shadow-2xl bg-gradient-to-br from-emerald-400 to-green-500 z-30"
            >
              <div className="text-xl">
                <FaBrain className="text-white" />
              </div>
              <div className="absolute inset-0 bg-emerald-400/30 blur-lg -z-10 rounded-xl"></div>
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, 10, 0],
                x: [0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
              className="absolute -bottom-4 left-6 p-4 rounded-xl shadow-2xl bg-gradient-to-br from-purple-400 to-pink-500 z-30"
            >
              <div className="text-xl">
                <FaMicrochip className="text-white" />
              </div>
              <div className="absolute inset-0 bg-purple-400/30 blur-lg -z-10 rounded-xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center">
          <span className="text-green-700 font-bold text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-blue-300/40 rounded-full flex justify-center shadow-lg backdrop-blur-sm">
            <div className="w-1 h-3 bg-cyan-300/80 rounded-full mt-2"></div>
          </div>
        </div>
      </motion.div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden">
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 1440 200" 
    className="w-full h-20 md:h-24 lg:h-28 xl:h-32"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.98" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.98" />
      </linearGradient>
    </defs>
    
    <motion.path
      fill="url(#waveGradient)"
      d="M0,160L48,150C96,140,192,120,288,116.7C384,113,480,125,576,125C672,125,768,113,864,113C960,113,1056,125,1152,117.3C1248,110,1344,83,1392,70L1440,56L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C240,200,192,200,144,200L0,200Z"
      animate={{ 
        d: [
          "M0,160L48,150C96,140,192,120,288,116.7C384,113,480,125,576,125C672,125,768,113,864,113C960,113,1056,125,1152,117.3C1248,110,1344,83,1392,70L1440,56L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C240,200,192,200,144,200L0,200Z",
          "M0,140L48,133.3C96,127,192,113,288,106.7C384,100,480,100,576,103C672,107,768,113,864,113C960,113,1056,107,1152,103C1248,100,1344,97,1392,95L1440,93L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C240,200,192,200,144,200L0,200Z",
          "M0,180L48,170C96,160,192,140,288,136.7C384,133,480,145,576,145C672,145,768,133,864,133C960,133,1056,145,1152,137.3C1248,130,1344,103,1392,90L1440,76L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C240,200,192,200,144,200L0,200Z",
          "M0,160L48,150C96,140,192,120,288,116.7C384,113,480,125,576,125C672,125,768,113,864,113C960,113,1056,125,1152,117.3C1248,110,1344,83,1392,70L1440,56L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C240,200,192,200,144,200L0,200Z"
        ]
      }}
      transition={{ 
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </svg>
</div>
    </section>
  );
};

export default HeroSection;

















































// import React from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { 
//   FaArrowRight, 
//   FaHandsHelping, 
//   FaRocket,
//   FaBrain,
//   FaMicrochip
// } from 'react-icons/fa';
// import { FaLightbulb } from 'react-icons/fa6';

// const HeroSection = () => {
//   return (
//     <section className="relative bg-gradient-to-br from-primary-500 via-primary-100 to-accent-100 text-white overflow-hidden min-h-[80vh]">
//       {/* Animated Background Elements - Enhanced Blue Theme */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Main gradient background with blue tones */}
//         <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-100 to-accent-100"></div>
        
//         {/* Animated gradient mesh */}
//         <div className="absolute inset-0 opacity-40">
//           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-200/20 via-transparent to-transparent"></div>
//           <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-200/20 via-transparent to-transparent"></div>
//         </div>

//         {/* Floating gradient orbs - Blue theme */}
//         <motion.div 
//           animate={{ 
//             x: [0, 100, 0],
//             y: [0, -50, 0],
//             scale: [1, 1.1, 1]
//           }}
//           transition={{ 
//             duration: 20,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//           className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-primary-100/30 to-accent-100/30 rounded-full blur-3xl"
//         ></motion.div>
        
//         <motion.div 
//           animate={{ 
//             x: [0, -80, 0],
//             y: [0, 60, 0],
//             scale: [1, 1.2, 1]
//           }}
//           transition={{ 
//             duration: 25,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 2
//           }}
//           className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-l from-primary-200/30 to-accent-200/30 rounded-full blur-3xl"
//         ></motion.div>

//         {/* Subtle grid overlay */}
//         <div className="absolute inset-0 opacity-[0.02]">
//           <div className="absolute inset-0" style={{
//             backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
//                              linear-gradient(to bottom, white 1px, transparent 1px)`,
//             backgroundSize: '40px 40px'
//           }}></div>
//         </div>

//         {/* Animated particles/glitter effect */}
//         <div className="absolute inset-0">
//           {[...Array(20)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute w-1 h-1 bg-blue-300/30 rounded-full"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//               }}
//               animate={{
//                 y: [0, -20, 0],
//                 opacity: [0, 1, 0],
//               }}
//               transition={{
//                 duration: 3 + Math.random() * 2,
//                 repeat: Infinity,
//                 delay: Math.random() * 5,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
//           {/* Left Column - Text Content */}
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className="space-y-8"
//           >
//             {/* Badge - Blue theme */}
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-100/40 to-accent-100/40 backdrop-blur-lg rounded-full px-6 py-3 border border-primary-200 shadow-lg"
//             >
//               <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full shadow-md">
//                 <FaHandsHelping className="text-white text-sm" />
//               </div>
//               <div>
//                 <span className="text-sm font-semibold text-white">Since 2010</span>
//                 <span className="mx-2 text-primary-300">•</span>
//                 <span className="text-sm text-primary-100">Transforming Communities</span>
//               </div>
//             </motion.div>

//             {/* Main Headline */}
//             <div className="space-y-4">
//               <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-tight">
//                 Empowering Communities
//                 <span className="block mt-2 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-200 bg-clip-text text-transparent">
//                   Through AI & Innovation
//                 </span>
//               </h1>
              
//               <p className="text-xl md:text-2xl text-primary-100 leading-relaxed max-w-2xl">
//                 At <span className="font-semibold text-accent-500">Matakiri Tumaini Centre</span>, we blend humanitarian compassion with cutting-edge technology to create sustainable solutions that uplift communities across Kenya.
//               </p>
//             </div>

//             {/* CTA Buttons - Blue theme */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="flex flex-col sm:flex-row gap-4 pt-4"
//             >
//               <Link
//                 to="/programs"
//                 className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
//               >
//                 <span className="relative z-10 flex items-center">
//                   Explore Our Impact
//                   <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
//                 </span>
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500"
//                   initial={{ x: "-100%" }}
//                   whileHover={{ x: 0 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               </Link>
              
//               <Link
//                 to="/ai-projects"
//                 className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-100/40 to-accent-100/40 backdrop-blur-sm text-primary-700 font-semibold rounded-xl border-2 border-primary-200 hover:border-accent-500 hover:bg-primary-100/60 transition-all duration-300 hover:-translate-y-1 shadow-lg"
//               >
//                 <FaRocket className="mr-3 group-hover:rotate-12 transition-transform" />
//                 <span>AI Initiatives</span>
//               </Link>
//             </motion.div>
//           </motion.div>

//           {/* Right Column - Visual Elements */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
//             animate={{ opacity: 1, scale: 1, rotateY: 0 }}
//             transition={{ duration: 0.8, delay: 0.3 }}
//             className="relative"
//           >
//             {/* Main Image Container */}
//             <div className="relative">
//               {/* Floating Image with Frame */}
//               <div className="relative rounded-3xl shadow-2xl border-8 border-blue-400/20 bg-gradient-to-br from-blue-400/10 to-transparent backdrop-blur-sm">
//                 <img
//                   src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
//                   alt="Community empowerment through technology"
//                   className="w-full h-[500px] object-cover rounded-2xl"
//                 />
                
//                 {/* Gradient Overlay - Blue theme */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-blue-900/30 to-transparent rounded-2xl"></div>
//               </div>

//               {/* FLOATING ICONS */}
              
//               {/* Top Left Icon */}
//               <motion.div
//                 animate={{ 
//                   y: [0, -15, 0],
//                   rotate: [0, 5, 0],
//                   scale: [1, 1.1, 1]
//                 }}
//                 transition={{ 
//                   duration: 4,
//                   repeat: Infinity,
//                   ease: "easeInOut"
//                 }}
//                 className="absolute -top-6 -left-6 p-5 rounded-2xl shadow-2xl bg-gradient-to-br from-yellow-400 to-amber-500 z-30"
//               >
//                 <div className="text-2xl">
//                   <FaRocket className="text-white" />
//                 </div>
//                 {/* Glow effect */}
//                 <div className="absolute inset-0 bg-yellow-400/30 blur-xl -z-10 rounded-2xl"></div>
//               </motion.div>
              
//               {/* Bottom Right Icon */}
//               <motion.div
//                 animate={{ 
//                   y: [0, 15, 0],
//                   rotate: [0, -5, 0],
//                   scale: [1, 1.1, 1]
//                 }}
//                 transition={{ 
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 1
//                 }}
//                 className="absolute -bottom-6 -right-6 p-5 rounded-2xl shadow-2xl bg-gradient-to-br from-cyan-400 to-blue-500 z-30"
//               >
//                 <div className="text-2xl">
//                   <FaLightbulb className="text-white" />
//                 </div>
//                 {/* Glow effect */}
//                 <div className="absolute inset-0 bg-cyan-400/30 blur-xl -z-10 rounded-2xl"></div>
//               </motion.div>

//               {/* Top Right Icon */}
//               <motion.div
//                 animate={{ 
//                   y: [0, -10, 0],
//                   x: [0, 5, 0]
//                 }}
//                 transition={{ 
//                   duration: 3.5,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 0.5
//                 }}
//                 className="absolute top-8 -right-4 p-4 rounded-xl shadow-2xl bg-gradient-to-br from-emerald-400 to-green-500 z-30"
//               >
//                 <div className="text-xl">
//                   <FaBrain className="text-white" />
//                 </div>
//                 <div className="absolute inset-0 bg-emerald-400/30 blur-lg -z-10 rounded-xl"></div>
//               </motion.div>

//               {/* Bottom Left Icon */}
//               <motion.div
//                 animate={{ 
//                   y: [0, 10, 0],
//                   x: [0, -5, 0]
//                 }}
//                 transition={{ 
//                   duration: 4,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 1.5
//                 }}
//                 className="absolute -bottom-4 left-6 p-4 rounded-xl shadow-2xl bg-gradient-to-br from-purple-400 to-pink-500 z-30"
//               >
//                 <div className="text-xl">
//                   <FaMicrochip className="text-white" />
//                 </div>
//                 <div className="absolute inset-0 bg-purple-400/30 blur-lg -z-10 rounded-xl"></div>
//               </motion.div>
//             </div>

//             {/* Decorative Elements - Blue */}
//             <motion.div 
//               animate={{ rotate: 360 }}
//               transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
//               className="absolute -z-10 -top-10 -right-10 w-64 h-64 border-2 border-blue-400/10 rounded-full"
//             ></motion.div>
            
//             <div className="absolute -z-10 -bottom-10 -left-10 w-80 h-80 bg-gradient-to-l from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Animated Scroll Indicator */}
//       <motion.div
//         animate={{ y: [0, 10, 0] }}
//         transition={{ duration: 2, repeat: Infinity }}
//         className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
//       >
//         <div className="flex flex-col items-center">
//           <span className="text-green-700 text-sm mb-2">Scroll to explore</span>
//           <div className="w-6 h-10 border-2 border-blue-300/40 rounded-full flex justify-center shadow-lg backdrop-blur-sm">
//             <div className="w-1 h-3 bg-cyan-300/80 rounded-full mt-2"></div>
//           </div>
//         </div>
//       </motion.div>

//       {/* TALLER & SMOOTHER WAVE DIVIDER */}
//       <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden ">
//         {/* Smooth Animated Wave - INCREASED HEIGHT */}
//         <svg 
//           xmlns="http://www.w3.org/2000/svg" 
//           viewBox="0 0 1440 420" 
//           className="w-full h-48 md:h-56 lg:h-64 xl:h-72"
//           preserveAspectRatio="none"
//         >
//           <defs>
//             {/* Smooth gradient for the wave */}
//             <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
//               <stop offset="50%" stopColor="#ffffff" stopOpacity="0.98" />
//               <stop offset="100%" stopColor="#ffffff" stopOpacity="0.98" />
//             </linearGradient>
            
//             {/* Filter for subtle glow */}
//             <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
//               <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
//               <feOffset dx="0" dy="3" result="offsetblur" />
//               <feComponentTransfer>
//                 <feFuncA type="linear" slope="0.25" />
//               </feComponentTransfer>
//               <feMerge>
//                 <feMergeNode />
//                 <feMergeNode in="SourceGraphic" />
//               </feMerge>
//             </filter>
//           </defs>
          
//           {/* Main wave with taller, smoother curves */}
//           <motion.path
//             fill="url(#waveGradient)"
//             filter="url(#waveGlow)"
//             d="M0,320L48,310C96,300,192,280,288,266.7C384,253,480,245,576,245C672,245,768,253,864,253C960,253,1056,245,1152,234.7C1248,224,1344,213,1392,207L1440,202L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z"
//             initial={{ d: "M0,320L48,310C96,300,192,280,288,266.7C384,253,480,245,576,245C672,245,768,253,864,253C960,253,1056,245,1152,234.7C1248,224,1344,213,1392,207L1440,202L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z" }}
//             animate={{ 
//               d: [
//                 "M0,320L48,310C96,300,192,280,288,266.7C384,253,480,245,576,245C672,245,768,253,864,253C960,253,1056,245,1152,234.7C1248,224,1344,213,1392,207L1440,202L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z",
//                 "M0,300L48,293.3C96,287,192,273,288,266.7C384,260,480,260,576,263C672,267,768,273,864,273C960,273,1056,267,1152,257C1248,247,1344,233,1392,227L1440,220L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z",
//                 "M0,340L48,330C96,320,192,300,288,290C384,280,480,280,576,280C672,280,768,280,864,277C960,273,1056,267,1152,257C1248,247,1344,233,1392,227L1440,220L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z",
//                 "M0,320L48,310C96,300,192,280,288,266.7C384,253,480,245,576,245C672,245,768,253,864,253C960,253,1056,245,1152,234.7C1248,224,1344,213,1392,207L1440,202L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z"
//               ]
//             }}
//             transition={{ 
//               duration: 20,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           />
          
//           {/* Subtle secondary wave for depth - also taller */}
//           <path 
//             fill="#ffffff" 
//             fillOpacity="0.25" 
//             d="M0,340L48,330C96,320,192,300,288,293.3C384,287,480,293,576,297C672,300,768,300,864,293.3C960,287,1056,273,1152,263C1248,253,1344,247,1392,243L1440,240L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z"
//           >
//             <animate
//               attributeName="d"
//               dur="25s"
//               repeatCount="indefinite"
//               values="M0,340L48,330C96,320,192,300,288,293.3C384,287,480,293,576,297C672,300,768,300,864,293.3C960,287,1056,273,1152,263C1248,253,1344,247,1392,243L1440,240L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z;
//                       M0,310L48,303.3C96,297,192,283,288,276.7C384,270,480,270,576,273C672,277,768,283,864,283C960,283,1056,277,1152,267C1248,257,1344,243,1392,237L1440,230L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z;
//                       M0,360L48,350C96,340,192,320,288,313.3C384,307,480,313,576,317C672,320,768,320,864,313.3C960,307,1056,293,1152,283C1248,273,1344,267,1392,263L1440,260L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z;
//                       M0,340L48,330C96,320,192,300,288,293.3C384,287,480,293,576,297C672,300,768,300,864,293.3C960,287,1056,273,1152,263C1248,253,1344,247,1392,243L1440,240L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z"
//             />
//           </path>

//           {/* Extra subtle third wave for even more depth */}
//           <path 
//             fill="#ffffff" 
//             fillOpacity="0.15" 
//             d="M0,360L48,353.3C96,347,192,333,288,326.7C384,320,480,320,576,323C672,327,768,333,864,333C960,333,1056,327,1152,317C1248,307,1344,293,1392,287L1440,280L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z"
//           >
//             <animate
//               attributeName="d"
//               dur="30s"
//               repeatCount="indefinite"
//               values="M0,360L48,353.3C96,347,192,333,288,326.7C384,320,480,320,576,323C672,327,768,333,864,333C960,333,1056,327,1152,317C1248,307,1344,293,1392,287L1440,280L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z;
//                       M0,330L48,323.3C96,317,192,303,288,296.7C384,290,480,290,576,293C672,297,768,303,864,303C960,303,1056,297,1152,287C1248,277,1344,263,1392,257L1440,250L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z;
//                       M0,380L48,370C96,360,192,340,288,333.3C384,327,480,333,576,337C672,340,768,340,864,333.3C960,327,1056,313,1152,303C1248,293,1344,287,1392,283L1440,280L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z;
//                       M0,360L48,353.3C96,347,192,333,288,326.7C384,320,480,320,576,323C672,327,768,333,864,333C960,333,1056,327,1152,317C1248,307,1344,293,1392,287L1440,280L1440,420L1392,420C1344,420,1248,420,1152,420C1056,420,960,420,864,420C768,420,672,420,576,420C480,420,384,420,288,420C240,420,192,420,144,420L0,420Z"
//             />
//           </path>
//         </svg>
//       </div>

//       {/* Subtle noise texture overlay */}
//       <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none z-0">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
//           backgroundSize: '200px 200px'
//         }}></div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;