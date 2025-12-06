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
        <HeroSection />
        <StatsSection />
        {/* Comment out other components until we fix the imports */}
        <FeaturedProjects />
        <AIInitiatives />
        <LatestNews />
        <PartnersShowcase />
        <CallToAction /> 
      </motion.div>
    </>
  );
};

export default Home;