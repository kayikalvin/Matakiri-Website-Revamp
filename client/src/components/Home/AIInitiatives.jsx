import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { projectsAPI } from '../../services/api';
import { 
  FaRobot, 
  FaBrain, 
  FaChartLine, 
  FaMobileAlt, 
  FaDatabase, 
  FaShieldAlt,
  FaSeedling,
  FaHeartbeat,
  FaGraduationCap,
  FaHandsHelping,
  FaLightbulb,
  FaCogs
} from 'react-icons/fa';

// Helper to map backend category to icon
const getProjectIcon = (category) => {      
  switch (category) {
    case "Agriculture": return <FaSeedling className="text-3xl" />;
    case "Health": return <FaHeartbeat className="text-3xl" />;
    case "Environment": return <FaCogs className="text-3xl" />;
    case "Education": return <FaGraduationCap className="text-3xl" />;
    case "Market": return <FaChartLine className="text-3xl" />;
    case "Mobile": return <FaMobileAlt className="text-3xl" />;
    default: return <FaRobot className="text-3xl" />;
  }
};

const AIInitiatives = () => {
  const [aiProjects, setAIProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch AI projects from backend using shared API service
  useEffect(() => {
    projectsAPI.getAIProjects()
      .then(data => {
        const projects = data.data.map(project => ({
          ...project,
          icon: getProjectIcon(project.category)
        }));
        setAIProjects(projects);
        console.log('Fetched AI Projects:', projects);
      })
      .catch(() => setError('Failed to load AI projects'))
      .finally(() => setLoading(false));
  }, []);

  const innovationPrinciples = [
    {
      icon: <FaHandsHelping className="text-2xl" />,
      title: "Community First",
      description: "All solutions are designed with and for the community we serve."
    },
    {
      icon: <FaLightbulb className="text-2xl" />,
      title: "Sustainable Impact",
      description: "We build solutions that are maintainable and scalable long-term."
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Ethical AI",
      description: "We prioritize transparency, fairness, and privacy in all our AI systems."
    },
    {
      icon: <FaBrain className="text-2xl" />,
      title: "Local Innovation",
      description: "We develop solutions that work within local constraints and resources."
    }
  ];

  const technologyStack = [
    { name: "Machine Learning", count: 8, color: "bg-purple-500" },
    { name: "Natural Language Processing", count: 3, color: "bg-blue-500" },
    { name: "Computer Vision", count: 4, color: "bg-green-500" },
    { name: "IoT Integration", count: 5, color: "bg-yellow-500" },
    { name: "Mobile Applications", count: 6, color: "bg-red-500" },
    { name: "Cloud Infrastructure", count: 7, color: "bg-indigo-500" }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pilot Phase': return 'bg-blue-100 text-blue-800';
      case 'Development': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>AI & Innovation Initiatives - Matakiri Tumaini Centre</title>
        <meta name="description" content="Explore our cutting-edge AI projects and innovative solutions for community development and social impact." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                <FaRobot className="text-4xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
                AI & Innovation Initiatives
              </h1>
              <p className="text-xl text-gray-200">
                Leveraging artificial intelligence and innovative technology to solve community challenges and drive sustainable development.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{aiProjects.length}</div>
                <div className="text-gray-600">AI Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {aiProjects.reduce((sum, p) => sum + (p.beneficiaries || 0), 0).toLocaleString()}
                </div>
                <div className="text-gray-600">Direct Beneficiaries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {aiProjects.reduce((acc, p) => acc.concat(p.technologies || []), []).filter((v, i, arr) => arr.indexOf(v) === i).length}
                </div>
                <div className="text-gray-600">Technologies Used</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {aiProjects.filter((v, i, arr) => arr.findIndex(p => p.category === v.category) === i).length}
                </div>
                <div className="text-gray-600">Sectors Impacted</div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                Our AI Projects
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Explore our portfolio of AI-powered solutions creating real impact in communities.
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-10 text-lg text-gray-500">Loading AI projects...</div>
            ) : error ? (
              <div className="text-center py-10 text-lg text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {aiProjects.map((project) => (
                  <motion.div
                    key={project._id || project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
                  >
                    {/* Project Image */}
                    <div className="h-48 w-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
                      {project.images && project.images.length > 0 && project.images[0].url ? (
                        <img src={project.images[0].url} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                          {project.icon}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Launched: {formatDate(project.launchDate)}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {project.description}
                      </p>
                      <div className="mb-4">
                        <div className="text-sm font-semibold text-gray-700 mb-1">Impact:</div>
                        <p className="text-primary-600 font-medium">{project.impact}</p>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm font-semibold text-gray-700 mb-1">Beneficiaries:</div>
                        <p className="text-gray-600">{(project.beneficiaries || 0).toLocaleString()} people</p>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-2">Technologies:</div>
                        <div className="flex flex-wrap gap-2">
                          {(project.technologies || []).map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* <div className="px-6 py-4 bg-gray-50 border-t">
                      <button className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                        View Project Details
                      </button>
                    </div> */}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Innovation Principles */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                Our Innovation Principles
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                These core principles guide every AI project we develop and implement.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {innovationPrinciples.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-4">
                    <div className="text-primary-600">
                      {principle.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

           {/* Technology Stack */}
         {/* <section className="py-16 bg-gradient-to-r from-primary-50 to-primary-100">
           <div className="container mx-auto px-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center mb-12"
             >
               <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                 Technology Stack
               </h2>
               <p className="text-gray-600 max-w-3xl mx-auto">
                 We leverage a diverse range of technologies to build robust and scalable AI solutions.
               </p>
             </motion.div>

             <div className="max-w-4xl mx-auto">
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                 {technologyStack.map((tech, index) => (
                   <motion.div
                     key={tech.name}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                     className="text-center"
                   >
                     <div className={`${tech.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                       <span className="text-white font-bold">{tech.count}</span>
                     </div>
                     <div className="text-sm font-medium text-gray-700">{tech.name}</div>
                   </motion.div>
                 ))}
               </div>
             </div>
           </div>
         </section> */}

         {/* Process Section */}
         <section className="py-16 bg-white">
           <div className="container mx-auto px-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center mb-12"
             >
               <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                 Our AI Development Process
               </h2>
               <p className="text-gray-600 max-w-3xl mx-auto">
                 From ideation to deployment, we follow a structured approach to ensure successful implementation.
               </p>
             </motion.div>

             <div className="max-w-5xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   {
                     step: "1",
                     title: "Community Needs Assessment",
                     description: "Identify specific challenges and requirements through community engagement"
                   },
                   {
                     step: "2",
                     title: "Solution Design & Prototyping",
                     description: "Design AI solutions and create working prototypes for testing"
                   },
                   {
                     step: "3",
                     title: "Pilot Implementation",
                     description: "Deploy in controlled environments and gather real-world feedback"
                   },
                   {
                     step: "4",
                     title: "Scale & Impact Assessment",
                     description: "Expand successful solutions and measure long-term impact"
                   }
                 ].map((process, index) => (
                   <motion.div
                     key={index}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                     className="text-center relative"
                   >
                     <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                       <span className="text-white font-bold text-xl">{process.step}</span>
                     </div>
                     {index < 3 && (
                       <div className="hidden md:block absolute top-7 left-3/4 w-full h-0.5 bg-primary-200"></div>
                     )}
                     <h3 className="text-lg font-semibold text-gray-800 mb-2">
                       {process.title}
                     </h3>
                     <p className="text-gray-600 text-sm">
                       {process.description}
                     </p>
                   </motion.div>
                 ))}
               </div>
             </div>
           </div>
         </section>

         {/* Call to Action */}
         <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
           <div className="container mx-auto px-4">
             <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-3xl font-bold font-display mb-6">
                 Join Our AI Innovation Journey
               </h2>
               <p className="text-xl mb-8 text-primary-100">
                 Whether you're a researcher, developer, or organization interested in AI for social good, 
                 there are many ways to collaborate with us.
               </p>
              
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                   <div className="text-2xl font-bold mb-2">Research</div>
                   <p className="text-primary-100">
                     Collaborate on cutting-edge AI research for social impact
                   </p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                   <div className="text-2xl font-bold mb-2">Development</div>
                   <p className="text-primary-100">
                     Contribute to building and deploying AI solutions
                   </p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                   <div className="text-2xl font-bold mb-2">Partnership</div>
                   <p className="text-primary-100">
                     Partner with us to scale successful AI initiatives
                   </p>
                 </div>
               </div>

               {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button className="px-8 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                   Download AI Portfolio
                 </button>
                 <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                   Contact Innovation Team
                 </button>
               </div> */}
             </div>
           </div>
         </section>

         {/* Success Stories */}
         <section className="py-16 bg-gray-50">
           <div className="container mx-auto px-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center mb-12"
             >
               <h2 className="text-3xl font-bold font-display text-gray-800 mb-4">
                 AI Success Stories
               </h2>
               <p className="text-gray-600 max-w-3xl mx-auto">
                 Real impact stories from communities using our AI solutions.
               </p>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 {
                   title: "From Traditional to Smart Farming",
                   story: "John Omondi increased his maize yield by 40% using our AI agriculture advisor, transforming his family's livelihood.",
                   metrics: "40% yield increase, 50% less water usage",
                   project: "AI-Powered Agricultural Advisor"
                 },
                 {
                   title: "Early Disease Detection Saves Lives",
                   story: "Our AI diagnostic tool helped identify 15 cases of early-stage diabetes in a remote community health screening.",
                   metrics: "500+ patients screened, 15 early detections",
                   project: "Healthcare Diagnostic Tool"
                 }
               ].map((story, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                   className="bg-white rounded-xl shadow-lg p-6"
                 >
                   <h3 className="text-xl font-bold text-gray-800 mb-3">
                     {story.title}
                   </h3>
                   <p className="text-gray-600 mb-4">
                     {story.story}
                   </p>
                   <div className="mb-4">
                     <div className="text-sm font-medium text-gray-700 mb-1">Impact Metrics:</div>
                     <div className="text-primary-600 font-medium">{story.metrics}</div>
                   </div>
                   <div className="text-sm text-gray-500">
                     Project: <span className="font-medium">{story.project}</span>
                   </div>
                 </motion.div>
               ))}
             </div>
           </div>
         </section>
       </div>
     </>
   );
 };

export default AIInitiatives;


































