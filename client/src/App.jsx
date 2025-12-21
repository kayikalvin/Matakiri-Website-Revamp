import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import ScrollToTop from './components/Common/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Programs from './pages/Programs.jsx';
import Projects from './pages/Projects.jsx';
import AIProjects from './pages/AIProjects.jsx';
import Partners from './pages/Partners.jsx';
import News from './pages/News.jsx';
import Gallery from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';  
import Team from './pages/Team.jsx';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="partners" element={<Partners />} />
          <Route path="programs" element={<Programs />} />
          <Route path="projects" element={<Projects />} />
          <Route path="ai-projects" element={<AIProjects />} />
          <Route path="team" element={<Team />} />
          <Route path="news" element={<News />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
