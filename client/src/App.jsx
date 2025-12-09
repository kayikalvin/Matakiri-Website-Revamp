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

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext.js';
// import { ThemeProvider } from './context/ThemeContext.js';
// import Layout from './components/Layout/Layout.jsx';

// // Import pages
// import Home from './pages/Home.jsx';
// import About from './pages/About.jsx';
// import Projects from './pages/Projects.jsx';
// import AIProjects from './pages/AIProjects.jsx';
// import Programs from './pages/Programs.jsx';
// import News from './pages/News.jsx';
// import Gallery from './pages/Gallery.jsx';
// import Partners from './pages/Partners.jsx';
// import Contact from './pages/Contact.jsx';
// import APIConnectionTest from './components/Test/APIConnectionTest.jsx';

// // Error boundary component
// import ErrorBoundary from './components/Common/ErrorBoundary.jsx';
// import LoadingSpinner from './components/Common/LoadingSpinner.jsx';

// function App() {
//   return (
//     <ErrorBoundary>
//       <ThemeProvider>
//         <AuthProvider>
//           <Router>
//             <React.Suspense fallback={<LoadingSpinner fullScreen />}>
//               <Layout>
//                 <Routes>
//                   <Route path="/" element={<Home />} />
//                   <Route path="/about" element={<About />} />
//                   <Route path="/projects" element={<Projects />} />
//                   <Route path="/projects/ai" element={<AIProjects />} />
//                   <Route path="/programs" element={<Programs />} />
//                   <Route path="/news" element={<News />} />
//                   <Route path="/gallery" element={<Gallery />} />
//                   <Route path="/partners" element={<Partners />} />
//                   <Route path="/contact" element={<Contact />} />
                  
//                   {/* API Test Page (remove in production) */}
//                   <Route path="/test-api" element={<APIConnectionTest />} />
                  
//                   {/* Redirect any unknown routes to home */}
//                   <Route path="*" element={<Navigate to="/" replace />} />
//                 </Routes>
//               </Layout>
//             </React.Suspense>
//           </Router>
//         </AuthProvider>
//       </ThemeProvider>
//     </ErrorBoundary>
//   );
// }

// export default App;