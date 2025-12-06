import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Projects from './pages/Projects';
import AIProjects from './pages/AIProjects';
import Partners from './pages/Partners';
import News from './pages/News';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import ScrollToTop from './components/Common/ScrollToTop';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="programs" element={<Programs />} />
          <Route path="projects" element={<Projects />} />
          <Route path="ai-projects" element={<AIProjects />} />
          <Route path="partners" element={<Partners />} />
          <Route path="news" element={<News />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;