import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap,
  FaChalkboardTeacher,
  FaLaptop,
  FaUserFriends,
  FaCode,
  FaDatabase,
  FaBusinessTime,
  FaUserGraduate,
  FaSchool,
  FaBuilding,
  FaHandHoldingHeart,
  FaLightbulb,
  FaShieldAlt,
  FaChartLine,
  FaHandsHelping,
  FaGlobe,
  FaArrowRight
} from 'react-icons/fa';

const About = () => {
  // Impact Statistics
  const impactStats = [
    { number: "232", label: "Youths trained", icon: <FaUserGraduate />, color: "text-primary-600", bg: "bg-primary-50" },
    { number: "29", label: "Tutors trained", icon: <FaSchool />, color: "text-accent-600", bg: "bg-accent-50" },
    { number: "18", label: "Companies supported", icon: <FaBuilding />, color: "text-blue-600", bg: "bg-blue-50" },
    { number: "80", label: "Elderly supported", icon: <FaHandHoldingHeart />, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  // Our Support Areas - Main Focus
  const supportAreas = [
    {
      icon: <FaGraduationCap />,
      title: "Access to Tuition",
      description: "Identifying youths with excellent potential hindered by lack of access to personalized learning. We provide bespoke tuition schedules to give each young person a fair chance to succeed.",
      features: ["Personalized learning plans", "Individual mentoring", "Flexible scheduling", "Progress tracking"],
      color: "border-primary-200",
      bg: "bg-gradient-to-br from-primary-50 to-white",
      iconBg: "from-primary-500 to-primary-600"
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Capacity Building",
      description: "Providing continuing professional development courses for teachers during convenient times around their teaching engagements through partnerships with various institutions.",
      features: ["Teacher training programs", "Professional development", "Institution partnerships", "Curriculum support"],
      color: "border-accent-200",
      bg: "bg-gradient-to-br from-accent-50 to-white",
      iconBg: "from-accent-500 to-accent-600"
    },
    {
      icon: <FaLaptop />,
      title: "Learning Infrastructure",
      description: "Renting venues with computers and encouraging clients to bring laptops for continued practice at home. All learning materials are shared through cloud services.",
      features: ["Computer-equipped venues", "Cloud-based materials", "Bring your own device", "Home practice support"],
      color: "border-blue-200",
      bg: "bg-gradient-to-br from-blue-50 to-white",
      iconBg: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaUserFriends />,
      title: "Mentoring",
      description: "Connecting youth with business mentors for workshops on entrepreneurship, accessing capital, taxation, staff recruitment, and financial management.",
      features: ["Business workshops", "Entrepreneurship guidance", "Industry connections", "Practical business skills"],
      color: "border-purple-200",
      bg: "bg-gradient-to-br from-purple-50 to-white",
      iconBg: "from-purple-500 to-purple-600"
    }
  ];

  // Why Work With Us - Key Differentiators
  const whyWorkWithUs = [
    {
      icon: <FaCode />,
      title: "Problem Solving Approach",
      description: "We use a problem-based approach to delivering core programming concepts in engaging ways. From micro-controllers like Arduinos and Raspberry Pi to mobile app development, there's an entry point for everyone.",
      benefits: ["Hands-on learning", "Real-world projects", "Multiple entry levels", "Practical applications"],
      color: "border-primary-200",
      bg: "bg-gradient-to-br from-white to-primary-50",
      number: "01"
    },
    {
      icon: <FaDatabase />,
      title: "Data Analytics Focus",
      description: "Teaching the complete Python ecosystem for data analytics, SQL, data engineering skills, and introducing Machine Learning to meet real market demand for data professionals.",
      benefits: ["Python ecosystem", "SQL training", "Data engineering", "Machine Learning intro"],
      color: "border-accent-200",
      bg: "bg-gradient-to-br from-white to-accent-50",
      number: "02"
    },
    {
      icon: <FaBusinessTime />,
      title: "Business & Entrepreneurship",
      description: "Focusing on how to use skills gained to plan and establish business enterprises that become employers within the community, creating sustainable economic impact.",
      benefits: ["Business planning", "Entrepreneurship training", "Market access strategies", "Community employment"],
      color: "border-green-200",
      bg: "bg-gradient-to-br from-white to-green-50",
      number: "03"
    }
  ];

  // Specialized Support Areas
  const specializedSupport = [
    {
      title: "Refugee Education",
      description: "Tailored programs for refugee communities to bridge educational gaps and provide market-relevant skills.",
      icon: <FaGlobe />
    },
    {
      title: "Inclusive Learning",
      description: "Specialized support for those hard of hearing, partially sighted, and deaf/mute communities.",
      icon: <FaHandsHelping />
    },
    {
      title: "Community Integration",
      description: "Programs that promote community cohesion and cultural integration through shared learning experiences.",
      icon: <FaChartLine />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-primary-100/30 to-accent-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-tr from-accent-100/20 to-primary-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center gap-2 mb-6"
            >
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-primary-400"></div>
              <span className="text-xs font-semibold text-primary-600 tracking-widest uppercase px-3 py-1.5 bg-primary-50 rounded-full">
                Our Impact
              </span>
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-accent-400"></div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8"
            >
              Empowering Youth
              <span className="block mt-2 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Through Technology & Education
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
            >
              A UK-registered charity empowering youth through technical skills training, entrepreneurship development, 
              and creating inclusive learning environments that foster community cohesion.
            </motion.p>

            {/* Impact Statistics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
            >
              {impactStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                        <div className={`text-xl ${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {/* Left Column: Who We Are */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* What We Do Summary */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl">
                    <FaLightbulb className="text-2xl text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full mt-2"></div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  We work with like-minded organisations to identify gaps that we can help fill with our expertise. 
                  We are passionate about quality skill-based education in niche areas of computing and support 
                  capacity development of colleagues teaching these subjects in schools and colleges.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                    Technical Skills Training
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-accent-400 rounded-full"></div>
                    Entrepreneurship Development
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Inclusive Education
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    Community Cohesion
                  </div>
                </div>
              </div>

              {/* Specialized Support */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {specializedSupport.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 border border-gray-100 hover:border-primary-200 transition-colors"
                  >
                    <div className="text-primary-500 mb-3">
                      {area.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{area.title}</h3>
                    <p className="text-sm text-gray-500">{area.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: About Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl p-8 text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <FaShieldAlt className="text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">About Us</h2>
                      <div className="w-12 h-1 bg-white/40 rounded-full mt-2"></div>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    A UK-registered charity focused on supporting youths to gain technical and entrepreneurial skills. 
                    Our work enhances community cohesion and leaves no one behind.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">UK Registered Charity</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Youth Empowerment Focus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Inclusive Education</span>
                    </div>
                  </div>
                  <button className="w-full mt-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    Learn More About Our Work
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Our Support Areas - Full Width Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary-400 to-transparent"></div>
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                  Comprehensive Support
                </span>
                <div className="w-8 h-0.5 bg-gradient-to-l from-accent-400 to-transparent"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Support Areas
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We focus on a comprehensive spectrum of issues that lead to access to quality education
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className={`h-full rounded-2xl border ${area.color} ${area.bg} p-6 transition-all duration-300 group-hover:shadow-xl`}>
                    <div className="mb-6">
                      <div className={`inline-flex p-4 bg-gradient-to-br ${area.iconBg} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-2xl text-white">
                          {area.icon}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {area.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {area.description}
                    </p>
                    
                    <div className="space-y-2">
                      {area.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Support Area {index + 1}
                      </div>
                    </div> */}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why Work With Matakiri Tumaini Trust */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary-400 to-transparent"></div>
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                  Our Approach
                </span>
                <div className="w-8 h-0.5 bg-gradient-to-l from-accent-400 to-transparent"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Work With Matakiri Tumaini Trust
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Access to education is an international issue. We work with grassroots organisations 
                supporting disadvantaged communities to provide quality skills training.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {whyWorkWithUs.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg">
                    {reason.number}
                  </div>
                  
                  <div className={`h-full rounded-2xl border ${reason.color} ${reason.bg} p-8 pt-12`}>
                    <div className="mb-6">
                      <div className="text-3xl text-primary-500 mb-4">
                        {reason.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {reason.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {reason.description}
                    </p>
                    
                    <div className="space-y-3">
                      {reason.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"></div>
                          <span className="text-sm text-gray-500">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* <button className="mt-8 flex items-center gap-2 text-primary-600 font-semibold text-sm hover:gap-3 transition-all">
                      Learn more about this approach
                      <FaArrowRight className="text-xs" />
                    </button> */}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12 border border-primary-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Ready to Make an Impact Together?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Partner with us to create opportunities, build skills, and transform communities through education and technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                    Become a Partner
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-200 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
                    Support Our Work
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;












































// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//   FaBrain, 
//   FaHandsHelping, 
//   FaLightbulb,
//   FaSeedling,
//   FaUsers,
//   FaGlobeAfrica,
//   FaHeart,
//   FaChartLine,
//   FaArrowRight
// } from 'react-icons/fa';

// const About = () => {
//   const values = [
//     {
//       icon: <FaHandsHelping />,
//       title: "Community First",
//       description: "Local needs drive our AI solutions. We prioritize community input at every stage of development.",
//       color: "from-emerald-500 to-emerald-600"
//     },
//     {
//       icon: <FaLightbulb />,
//       title: "Innovation",
//       description: "Cutting-edge technology applied to traditional problems with cultural sensitivity.",
//       color: "from-amber-500 to-amber-600"
//     },
//     {
//       icon: <FaSeedling />,
//       title: "Sustainability",
//       description: "Solutions designed to grow and evolve with communities over generations.",
//       color: "from-green-500 to-green-600"
//     },
//     {
//       icon: <FaUsers />,
//       title: "Collaboration",
//       description: "Strategic partnerships that amplify impact and ensure long-term success.",
//       color: "from-blue-500 to-blue-600"
//     }
//   ];

//   const initiatives = [
//     {
//       title: "Smart Agriculture",
//       description: "AI-powered crop monitoring and predictive analytics for small-scale farmers.",
//       icon: <FaSeedling />,
//       stats: "40% yield increase"
//     },
//     {
//       title: "Healthcare Analytics",
//       description: "Predictive models and diagnostic tools for rural healthcare facilities.",
//       icon: <FaHeart />,
//       stats: "15 clinics served"
//     },
//     {
//       title: "Education Tech",
//       description: "Personalized learning platforms using adaptive AI algorithms.",
//       icon: <FaUsers />,
//       stats: "2,500+ students"
//     },
//     {
//       title: "Environmental AI",
//       description: "Satellite imagery analysis for conservation and climate adaptation.",
//       icon: <FaGlobeAfrica />,
//       stats: "50K hectares monitored"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
//       {/* Hero Section */}
//       <section className="relative py-24 px-4 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30" />
//         <div className="max-w-6xl mx-auto relative">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center mb-20"
//           >
//             <div className="inline-flex items-center justify-center gap-3 mb-8">
//               <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-emerald-400" />
//               <span className="text-sm font-semibold text-emerald-700 tracking-wider uppercase px-4 py-2 bg-emerald-100 rounded-full">
//                 About Us
//               </span>
//               <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-emerald-400" />
//             </div>
            
//             <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
//               Where <span className="font-bold text-emerald-800">Humanitarian Work</span>
//               <br />
//               Meets <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Innovation</span>
//             </h1>
            
//             <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
//               Matakiri Tumaini Centre empowers marginalized communities in Kenya through 
//               ethical AI applications, creating sustainable solutions while preserving cultural heritage.
//             </p>
            
//             <div className="flex items-center justify-center gap-6">
//               <div className="flex items-center gap-2 text-emerald-700">
//                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
//                 <span className="text-sm font-medium">Founded in Kenya</span>
//               </div>
//               <div className="w-1 h-1 bg-gray-300 rounded-full" />
//               <div className="flex items-center gap-2 text-emerald-700">
//                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
//                 <span className="text-sm font-medium">10+ AI Projects</span>
//               </div>
//               <div className="w-1 h-1 bg-gray-300 rounded-full" />
//               <div className="flex items-center gap-2 text-emerald-700">
//                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
//                 <span className="text-sm font-medium">5K+ Lives Impacted</span>
//               </div>
//             </div>
//           </motion.div>

//           {/* Mission & Vision */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true, margin: "-100px" }}
//               transition={{ duration: 0.6 }}
//               className="group"
//             >
//               <div className="bg-white rounded-2xl p-8 shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-500 border border-emerald-100">
//                 <div className="flex items-start space-x-4 mb-6">
//                   <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl group-hover:scale-110 transition-transform duration-500">
//                     <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
//                       <span className="text-white text-sm font-bold">M</span>
//                     </div>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h2>
//                     <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" />
//                   </div>
//                 </div>
                
//                 <p className="text-gray-700 leading-relaxed text-lg mb-8">
//                   We develop and deploy artificial intelligence solutions that directly address the most pressing 
//                   challenges faced by marginalized communities in Kenya and across East Africa.
//                 </p>
                
//                 <div className="pt-6 border-t border-emerald-50">
//                   <div className="inline-flex items-center text-emerald-700 font-medium">
//                     <span>Empowerment through technology</span>
//                     <FaArrowRight className="ml-2 text-sm" />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true, margin: "-100px" }}
//               transition={{ duration: 0.6, delay: 0.1 }}
//               className="group"
//             >
//               <div className="bg-white rounded-2xl p-8 shadow-lg shadow-teal-100/50 hover:shadow-xl hover:shadow-teal-200/50 transition-all duration-500 border border-teal-100">
//                 <div className="flex items-start space-x-4 mb-6">
//                   <div className="p-3 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl group-hover:scale-110 transition-transform duration-500">
//                     <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center">
//                       <span className="text-white text-sm font-bold">V</span>
//                     </div>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h2>
//                     <div className="w-12 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" />
//                   </div>
//                 </div>
                
//                 <p className="text-gray-700 leading-relaxed text-lg mb-8">
//                   We envision a world where artificial intelligence is not a luxury but a fundamental tool 
//                   for sustainable development, accessible to all communities regardless of their location or resources.
//                 </p>
                
//                 <div className="pt-6 border-t border-teal-50">
//                   <div className="inline-flex items-center text-teal-700 font-medium">
//                     <span>AI for everyone, everywhere</span>
//                     <FaArrowRight className="ml-2 text-sm" />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* AI Initiatives */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="mb-28"
//           >
//             <div className="text-center mb-16">
//               <div className="inline-flex items-center gap-4 mb-6">
//                 <FaBrain className="text-2xl text-emerald-500 animate-pulse" />
//                 <span className="text-sm font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100 px-4 py-2 rounded-full">
//                   AI For Social Good
//                 </span>
//                 <FaChartLine className="text-2xl text-emerald-500 animate-pulse" />
//               </div>
              
//               <h2 className="text-4xl font-bold text-gray-900 mb-6">
//                 Our <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Initiatives</span>
//               </h2>
              
//               <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//                 Leveraging artificial intelligence to create measurable impact across key sectors in East Africa.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {initiatives.map((initiative, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1, duration: 0.5 }}
//                   whileHover={{ y: -10 }}
//                 >
//                   <div className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100/50 h-full">
//                     <div className="mb-6">
//                       <div className="inline-flex p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
//                         <div className="text-2xl text-emerald-600">
//                           {initiative.icon}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <h3 className="text-xl font-bold text-gray-900 mb-3">
//                       {initiative.title}
//                     </h3>
                    
//                     <p className="text-gray-600 mb-4 text-sm leading-relaxed">
//                       {initiative.description}
//                     </p>
                    
//                     <div className="mt-6 pt-5 border-t border-gray-100 group-hover:border-emerald-200 transition-colors">
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
//                           {initiative.stats}
//                         </span>
//                         <span className="inline-flex items-center text-emerald-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
//                           Learn more
//                           <FaArrowRight className="ml-2 text-xs" />
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Core Values */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="mb-28"
//           >
//             <div className="text-center mb-16">
//               <div className="inline-flex items-center justify-center gap-4 mb-6">
//                 <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full" />
//                 <span className="text-sm font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100 px-4 py-2 rounded-full">
//                   Our Values
//                 </span>
//                 <div className="w-12 h-0.5 bg-gradient-to-l from-emerald-300 to-emerald-500 rounded-full" />
//               </div>
              
//               <h2 className="text-4xl font-bold text-gray-900 mb-6">
//                 Guiding <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Principles</span>
//               </h2>
              
//               <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//                 The ethical foundation that shapes every decision and action we take.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {values.map((value, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.1, duration: 0.5 }}
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   <div className="group bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 h-full">
//                     <div className="mb-6">
//                       <div className={`inline-flex p-4 bg-gradient-to-br ${value.color} rounded-xl transform group-hover:rotate-12 transition-transform duration-500`}>
//                         <div className="text-2xl text-white">
//                           {value.icon}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <h3 className="text-xl font-bold text-gray-900 mb-3">
//                       {value.title}
//                     </h3>
                    
//                     <p className="text-gray-600 text-sm leading-relaxed">
//                       {value.description}
//                     </p>
                    
//                     <div className="mt-6 pt-5 border-t border-gray-100">
//                       <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         Core Principle {index + 1}
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Impact Statement */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="relative overflow-hidden rounded-3xl"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
            
//             {/* Simplified background pattern */}
//             <div className="absolute inset-0 opacity-10">
//               <div className="absolute inset-0" style={{
//                 backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 2px)`,
//                 backgroundSize: '50px 50px'
//               }} />
//             </div>
            
//             <div className="relative p-12 md:p-16 text-center">
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                 className="inline-flex items-center justify-center mb-8"
//               >
//                 <div className="w-8 h-8 bg-white/20 rounded-full mr-3" />
//                 <div className="w-10 h-10 bg-white/30 rounded-full mr-3" />
//                 <div className="w-12 h-12 bg-white/40 rounded-full" />
//               </motion.div>
              
//               <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
//                 Building a future where <span className="text-emerald-200">technology serves humanity</span>
//               </h2>
              
//               <p className="text-emerald-100 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
//                 Through ethical AI and community-centered design, we're creating tools that don't just solve problems—they empower people to build their own futures and preserve cultural heritage.
//               </p>
              
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
//                 >
//                   Explore Our Work
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-8 py-4 bg-transparent text-white border-2 border-white/30 rounded-xl font-bold hover:bg-white/10 transition-all"
//                 >
//                   Partner With Us
//                 </motion.button>
//               </div>
              
//               <div className="mt-12 pt-8 border-t border-white/20">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                   {["Ethical AI", "Cultural Preservation", "Community Led", "Sustainable Impact"].map((item, i) => (
//                     <div key={i} className="text-white/90">
//                       <div className="text-2xl font-bold mb-1">✓</div>
//                       <div className="text-sm font-medium">{item}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default About;

