import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Group icons by category to reduce imports
import {
  FaGraduationCap, FaUserFriends, FaSeedling, FaLaptop, FaTint,
  FaUserGraduate, FaSchool, FaBuilding, FaHandHoldingHeart,
  FaLightbulb, FaShieldAlt, FaGlobe, FaHandsHelping, FaChartLine,
  FaCode, FaDatabase, FaBusinessTime, FaArrowRight
} from 'react-icons/fa';

const About = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  // Data organized into sections
  const sections = {
    impactStats: [
      { number: "232", label: "Youths trained", icon: <FaUserGraduate />, color: "text-primary-600" },
      { number: "29", label: "Tutors trained", icon: <FaSchool />, color: "text-accent-600" },
      { number: "18", label: "Companies supported", icon: <FaBuilding />, color: "text-blue-600" },
      { number: "80", label: "Elderly supported", icon: <FaHandHoldingHeart />, color: "text-purple-600" }
    ],
    
    supportAreas: [
      {
        id: 1,
        icon: <FaGraduationCap />,
        title: "Youth Empowerment",
        description: "Hands-on, practical courses with real-world projects and entrepreneurship focus.",
        features: ["Hands-on projects", "Entrepreneurship focus", "Job-ready skills"]
      },
      {
        id: 2,
        icon: <FaUserFriends />,
        title: "Engaging the elderly",
        description: "Social events, health checks, and cultural activities to support wellbeing.",
        features: ["Social events", "Health checks", "Cultural activities"]
      },
      {
        id: 3,
        icon: <FaSeedling />,
        title: "Conservation agriculture",
        description: "Practical farming training focused on sustainability and value addition.",
        features: ["Practical training", "Soil management", "Value addition"]
      },
      {
        id: 4,
        icon: <FaLaptop />,
        title: "Computer literacy",
        description: "Digital skills training for students and community members.",
        features: ["Basic digital skills", "Internet safety", "Community sessions"]
      },
      {
        id: 5,
        icon: <FaTint />,
        title: "Access to clean water",
        description: "Renewable-energy water system with community access point.",
        features: ["Rainwater harvesting", "Solar-powered", "Community access"]
      }
    ],
    
    whyWorkWithUs: [
      {
        number: "01",
        icon: <FaCode />,
        title: "Problem Solving Approach",
        description: "Project-based learning with hands-on experience in programming and development.",
        benefits: ["Hands-on learning", "Real-world projects", "Multiple skill levels"]
      },
      {
        number: "02",
        icon: <FaDatabase />,
        title: "Data Analytics Focus",
        description: "Complete Python ecosystem training for data professionals.",
        benefits: ["Python & SQL", "Data engineering", "Market-relevant skills"]
      },
      {
        number: "03",
        icon: <FaBusinessTime />,
        title: "Business & Entrepreneurship",
        description: "Skills to establish business enterprises and create economic impact.",
        benefits: ["Business planning", "Entrepreneurship", "Community employment"]
      }
    ],
    
    specializedSupport: [
      {
        title: "Refugee Education",
        description: "Tailored programs for refugee communities.",
        icon: <FaGlobe />
      },
      {
        title: "Inclusive Learning",
        description: "Specialized support for diverse learning needs.",
        icon: <FaHandsHelping />
      },
      {
        title: "Community Integration",
        description: "Programs promoting community cohesion.",
        icon: <FaChartLine />
      }
    ]
  };

  // Reusable components
  const StatCard = ({ stat, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-${stat.color.split('-')[1]}-50 ${stat.color}`}>
          {stat.icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
          <div className="text-sm text-gray-500">{stat.label}</div>
        </div>
      </div>
    </motion.div>
  );

  const AccordionItem = ({ area, index }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-1 mb-4">
      <button
        onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-bold">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="font-semibold text-gray-900">{area.title}</div>
        </div>
        <div className="text-gray-400">
          {openAccordion === index ? '▲' : '▼'}
        </div>
      </button>
      
      {openAccordion === index && (
        <div className="px-6 pb-6 pt-0">
          <p className="text-gray-600 mb-4">{area.description}</p>
          <div className="space-y-2">
            {area.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-500">
                <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const FeatureCard = ({ item, index, isWhyWork }) => (
    <div className={`rounded-2xl border border-gray-200 p-8 ${isWhyWork ? 'pt-12' : ''}`}>
      {isWhyWork && (
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-xl flex items-center justify-center font-bold">
          {item.number}
        </div>
      )}
      <div className={`${isWhyWork ? 'mb-6' : 'text-primary-500 mb-3'}`}>
        {item.icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-3">{item.title}</h3>
      <p className="text-gray-600 mb-4">{item.description}</p>
      {item.features && (
        <div className="space-y-2">
          {item.features.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"></div>
              {benefit}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div id="about" className="bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider px-3 py-1.5 bg-primary-50 rounded-full">
                Our Impact
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Empowering Youth
              <span className="block mt-2 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Through Technology & Education
              </span>
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto mb-12">
              Empowering youth through technical skills training, 
              entrepreneurship development, and inclusive learning environments.
            </p>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {sections.impactStats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div> */}

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* What We Do */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary-50 rounded-xl">
                    <FaLightbulb className="text-2xl text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full mt-2"></div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  We work with organizations to fill gaps with our expertise in quality skill-based education 
                  and capacity development in computing and technology subjects.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {["Technical Skills Training", "Entrepreneurship Development", "Inclusive Education", "Community Cohesion"]
                    .map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                        {item}
                      </div>
                    ))}
                </div>
              </div>

              {/* Specialized Support */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sections.specializedSupport.map((area, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="text-primary-500 mb-3">{area.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{area.title}</h3>
                    <p className="text-sm text-gray-500">{area.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - About Card */}
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
              <p className="mb-6">
                We are a Community & Learning Centre in Matakiri, Kenya, addressing urgent local needs including:
              </p>
              <ul className="space-y-3 mb-6 text-sm">
                <li>• Technical skills training for youth</li>
                <li>• Sustainable agriculture practices</li>
                <li>• Elderly care and social services</li>
                <li>• Community savings & credit cooperative</li>
              </ul>
              <button className="w-full py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50">
                Learn More About Our Work
              </button>
            </div>
          </div>

          {/* Support Areas */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Support Areas</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive support for quality education and community development
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              {sections.supportAreas.map((area, index) => (
                <AccordionItem key={area.id} area={area} index={index} />
              ))}
            </div>
          </div>

          {/* Why Work With Us */}
          {/* <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Access to education is an international issue. We support disadvantaged communities with quality skills training.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {sections.whyWorkWithUs.map((reason, index) => (
                <FeatureCard key={index} item={reason} index={index} isWhyWork={true} />
              ))}
            </div>
          </div> */}

          {/* CTA */}
          {/* <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Make an Impact Together?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Partner with us to create opportunities and transform communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg">
                  Become a Partner
                </button>
              </Link>
              <Link to="/contact">
                <button className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-200 font-semibold rounded-xl hover:bg-primary-50">
                  Support Our Work
                </button>
              </Link>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default About;


