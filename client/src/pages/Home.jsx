// import React from 'react';
// import { motion } from 'framer-motion';
// import { Helmet } from 'react-helmet-async';
// import FeaturedProjects from '../components/Home/FeaturedProjects';
// import AIInitiatives from '../components/Home/AIInitiatives';
// import LatestNews from '../components/Home/LatestNews';
// import PartnersShowcase from '../components/Home/PartnersShowcase';
// import CallToAction from '../components/Home/CallToAction';
// import HeroSection from '../components/Home/HeroSection';
// import StatsSection from '../components/Home/StatsSection';
// import Contact from '../pages/Contact';
// import Projects from '../pages/Projects';
// import Gallery from '../pages/Gallery';
// import Team from '../pages/Team';
// import About from '../pages/About';



// const Home = () => {
//   return (
//     <>
//       <Helmet>
//         <title>Matakiri Tumaini Centre - Transforming Communities Through Innovation</title>
//         <meta name="description" content="A humanitarian and innovation-driven institution focused on community development, AI-based solutions, and sustainable projects in Kenya." />
//       </Helmet>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <HeroSection />
//         <About/>
//         <PartnersShowcase />
//         <StatsSection />
//         {/* Comment out other components until we fix the imports */}
//         {/* <FeaturedProjects /> */}
//         <Projects/>
//         <Gallery/>
//         {/* <AIInitiatives /> */}
//         <Team/>
//         <CallToAction /> 
//         <LatestNews />
//         <Contact/>
//       </motion.div>
//     </>
//   );
// };

// export default Home;


import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import FeaturedProjects from '../components/Home/FeaturedProjects';
import AIInitiatives from '../components/Home/AIInitiatives';
import LatestNews from '../components/Home/LatestNews';
import PartnersShowcase from '../components/Home/PartnersShowcase';
import CallToAction from '../components/Home/CallToAction';
import HeroSection from '../components/Home/HeroSection';
import StatsSection from '../components/Home/StatsSection';
import Contact from '../pages/Contact';
import Projects from '../pages/Projects';
import Gallery from '../pages/Gallery';
import Team from '../pages/Team';
import About from '../pages/About';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Matakiri Tumaini Centre - Transforming Communities Through Innovation</title>
        <meta name="description" content="A humanitarian and innovation-driven institution focused on community development, AI-based solutions, and sustainable projects in Kenya." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section id="home">
          <HeroSection />
        </section>
        
        {/* About Section */}
        <section id="about">
          <About />
        </section>
        
        {/* Partners Section */}
        <section id="partners">
          <PartnersShowcase />
        </section>
        
        {/* Stats Section */}
        <section id="stats">
          <StatsSection />
        </section>
        
        {/* Projects Section */}
        <section id="projects">
          <Projects />
        </section>
        
        {/* Gallery Section */}
        <section id="gallery">
          <Gallery />
        </section>
        
        {/* Team Section */}
        <section id="team">
          <Team />
        </section>
        
        {/* Call to Action Section */}
        <section id="cta">
          <CallToAction />
        </section>
        
        {/* News Section */}
        <section id="news">
          <LatestNews />
        </section>
        
        {/* Contact Section */}
        <section id="contact">
          <Contact />
        </section>
      </motion.div>
    </>
  );
};

export default Home;