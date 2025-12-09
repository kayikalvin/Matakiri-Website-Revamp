// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import About from './pages/About';
// import Programs from './pages/Programs';
// import Projects from './pages/Projects';
// import AIProjects from './pages/AIProjects';
// import Partners from './pages/Partners';
// import News from './pages/News';
// import Gallery from './pages/Gallery';
// import Contact from './pages/Contact';
// import ScrollToTop from './components/Common/ScrollToTop';
// import Layout from './components/Layout/Layout';

// function App() {
//   return (
//     <>
//       <ScrollToTop />
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="about" element={<About />} />
//           <Route path="programs" element={<Programs />} />
//           <Route path="projects" element={<Projects />} />
//           <Route path="ai-projects" element={<AIProjects />} />
//           <Route path="partners" element={<Partners />} />
//           <Route path="news" element={<News />} />
//           <Route path="gallery" element={<Gallery />} />
//           <Route path="contact" element={<Contact />} />
//         </Route>
//       </Routes>
//     </>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';

// Import pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import AIProjects from './pages/AIProjects';
import Programs from './pages/Programs';
import News from './pages/News';
import Gallery from './pages/Gallery';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import APIConnectionTest from './components/Test/APIConnectionTest';

// Error boundary component
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingSpinner from './components/Common/LoadingSpinner';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <React.Suspense fallback={<LoadingSpinner fullScreen />}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/ai" element={<AIProjects />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* API Test Page (remove in production) */}
                  <Route path="/test-api" element={<APIConnectionTest />} />
                  
                  {/* Redirect any unknown routes to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </React.Suspense>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;