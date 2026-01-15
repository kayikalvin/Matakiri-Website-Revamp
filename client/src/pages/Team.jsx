import React, { useState } from "react";

// Team data - organized as requested
const boardMembers = [
  {
    name: "Paul Muriku",
    role: "Director",
    image: "/team/paulDirector.png",
    bio: "Board Director with extensive experience in organizational leadership and strategic direction.",
    category: "board"
  },
  {
    name: "Bismillah Binti Kader",
    role: "Curriculum Lead",
    image: "/team/Bismillah.png",
    bio: `Bismillah was born in Penang, Malaysia and educated at St George's in Balik Pulau and the Convent Pulau Tikus. She completed her degree, postgraduate studies and research at Birmingham University, UK. She taught at Birmingham University, Aston University's Business School and in Further Education colleges in the UK and has over 30 years' experience in education.`,
    category: "board"
  },
  {
    name: "David Toeman",
    role: "EduTech Lead",
    image: "/team/david_toeman.jpeg",
    bio: `David is a graduate of UMIST (BSc Physics), Sussex University (MSc History & Philosophy of Science) and the Open University (BA in Mathematics and Philosophy). He lectured in science, mathematics and philosophy, and tutored for the Open University and Nottingham University.`,
    category: "board"
  },
  {
    name: "Edward Kunyanga",
    role: "Planning & Management",
    image: "/team/edward_kunyanga.jpg",
    bio: "Planning and operational management expert with extensive experience in systems strengthening and community empowerment.",
    category: "board"
  },
  {
    name: "Prof. Wanja Mwaura-Tenambergen",
    role: "CPD & Employability",
    image: "/team/prof_wanja.jpeg",
    bio: `Prof. Wanja Mwaura-Tenambergen, PhD, is an Associate Professor in the Department of Health Systems Management at Kenya Methodist University. She specialises in strengthening health systems and improving the quality of learning and teaching in higher education.`,
    category: "board"
  },
  {
    name: "Peter Wells",
    role: "Charity Governance",
    image: "/team/peter_wells.png",
    bio: `Peter spent most of his career in the IT industry, including several years in Kenya. More recently he has taken on roles in the voluntary sector and served as a trustee for several organisations.`,
    category: "board"
  },
  {
    name: "John Kanyaru",
    role: "Chair",
    image: "/team/jk.jpg",
    bio: "A software engineering academic and practitioner providing strategic leadership and technical oversight.",
    category: "board"
  }
];

const advisoryTeam = [
  {
    name: "Dr Yasmin Bailey (nee Weaver)",
    role: "EduTech Advisor",
    image: "/team/yasmin.jpg",
    bio: `Yasmin holds a PhD in Comparative Cell Physiology and a BSc (Hons). She has strong interests in educational technology and an extensive track record in education management, including serving as Principal of an international college.`,
    category: "advisory"
  },
  {
    name: "Timothy Bailey",
    role: "Team Builder",
    image: "/team/timothy.jpg",
    bio: `Tim has a passion for building teams of professionals skilled in developing innovative learning technologies. He holds an MSc in Information Systems (Distinction), a B.Eng.(Hons) Civil Engineering (2:1), and a Postgraduate Certificate in Designing and Facilitating e-learning (A+).`,
    category: "advisory"
  },
  {
    name: "Benjamin Makai",
    role: "Corporate & Entrepreneurship",
    image: "/team/benjamin.jpg",
    bio: `Benjamin leads the Technology for Development (T4D) unit at Safaricom PLC, designing and transitioning sustainable products and services that deliver social impact. With 15+ years' experience across Africa and Kenya.`,
    category: "advisory"
  },
  {
    name: "Colin Turnbull",
    role: "CPD & Ethics",
    image: "/team/colinturnbull.png",
    bio: `Colin is a Practice Services Internal Auditor with an international multidisciplinary engineering consultancy. He specialises in management systems, ISO standards (9001, 14001, 45001) and auditing across consultancy and manufacturing.`,
    category: "advisory"
  },
  {
    name: "Esnas Turnbull",
    role: "Community Services Lead",
    image: "/team/Esnas.jpg",
    bio: `Esnas is a Humanistic & Integrative Counsellor (MBACP) with extensive experience supporting clients in private practice and hospice settings. She specialises in mental health and wellbeing.`,
    category: "advisory"
  },
  {
    name: "Samuel Gesora",
    role: "Social Media & Branding",
    image: "/team/samuel.jpg",
    bio: `Samuel is a design thinker and problem solver with experience in graphic design and marketing content creation. He advises on social media strategy and brand presence.`,
    category: "advisory"
  },
  {
    name: "Beatrice Boore",
    role: "Health & Wellbeing",
    image: "/team/bernice.jpg",
    bio: `Beatrice is a KRCHN nurse with over 20 years' experience in acute hospitals, community health care and management. She is passionate about health education, disease prevention, and community empowerment.`,
    category: "advisory"
  },
  {
    name: "Dr Patricia Davies",
    role: "Research & Outreach",
    image: "/team/patricia.jpg",
    bio: `Patricia holds a Doctorate in Educational Leadership, Policy and Management. She was Head of Computer Science at an American college in England and holds an MSc in Mathematics and an MA in Educational Technology.`,
    category: "advisory"
  },
  {
    name: "Muli Boniface",
    role: "Developer",
    image: "/team/muli.jpg",
    bio: `Software developer with expertise in web technologies and application development.`,
    category: "advisory"
  },
  {
    name: "Sarah Mueni Mutambu",
    role: "Developer",
    image: "/team/sarah.jpg",
    bio: `Full-stack developer specializing in modern web applications and user experience design.`,
    category: "advisory"
  },
  {
    name: "Kalvin Kayi",
    role: "Developer",
    image: "/team/kayi.png",
    bio: `Data scientist with expertise in machine learning, data analysis, and statistical modeling.`,
    category: "advisory"
  }
];

// Combine all members
const teamMembers = [...boardMembers, ...advisoryTeam];

// Role styles for different categories
const roleStyles = {
  'board': {
    bg: 'bg-gradient-to-br from-primary-50 to-white',
    border: 'border-primary-100',
    badge: 'bg-gradient-to-r from-primary-600 to-accent-600 text-white',
    dot: 'bg-primary-600',
    gradient: 'from-primary-600/5',
    text: 'text-primary-700',
    title: 'Our Board',
    description: 'Strategic leadership and governance team providing direction and oversight.'
  },
  'advisory': {
    bg: 'bg-gradient-to-br from-accent-50 to-white',
    border: 'border-accent-100',
    badge: 'bg-accent-100 text-accent-700',
    dot: 'bg-accent-500',
    gradient: 'from-accent-500/5',
    text: 'text-accent-700',
    title: 'Our Advisory Team',
    description: 'Expert advisors providing specialized knowledge and guidance across various domains.'
  },
  'default': {
    bg: 'bg-gradient-to-br from-neutral-100 to-white',
    border: 'border-neutral-300',
    badge: 'bg-neutral-100 text-neutral-400',
    dot: 'bg-neutral-400',
    gradient: 'from-neutral-400/5',
    text: 'text-neutral-400'
  }
};

const Team = () => {
  const [filter, setFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  const categories = [
    { id: 'all', label: 'All Members' },
    { id: 'board', label: 'Our Board' },
    { id: 'advisory', label: 'Advisory Team' }
  ];

  const filteredMembers = filter === 'all' 
    ? teamMembers 
    : filter === 'board'
    ? boardMembers
    : advisoryTeam;

  const getCurrentTeamData = () => {
    if (filter === 'all') {
      return { title: "Meet Our Team", description: "A diverse collective of professionals united by passion and expertise" };
    }
    return roleStyles[filter] || roleStyles.default;
  };

  const currentTeam = getCurrentTeamData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-100/30 to-white py-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-primary-100/20 to-accent-100/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-r from-accent-100/20 to-primary-100/20 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
              <span className="mx-4 text-neutral-400 font-medium font-display tracking-wider">MEET THE TEAM</span>
              <div className="w-24 h-1 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
              {filter === 'all' ? 'Meet ' : ''}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                {currentTeam.title}
              </span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              {filter === 'all' 
                ? "A diverse collective of professionals united by passion and expertise, driving innovation and creating meaningful impact across all our initiatives."
                : currentTeam.description
              }
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 font-display text-sm
                  ${filter === category.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white text-gray-700 border border-neutral-300 hover:border-primary-300 hover:text-primary-700 hover:shadow-md'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {/* Team Stats */}
          {filter === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-300 hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  {boardMembers.length}
                </div>
                <div className="text-neutral-400 mt-1 text-sm">Board Members</div>
                <div className="w-10 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mt-2"></div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-300 hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  {advisoryTeam.length}
                </div>
                <div className="text-neutral-400 mt-1 text-sm">Advisors</div>
                <div className="w-10 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mt-2"></div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-300 hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  {teamMembers.length}
                </div>
                <div className="text-neutral-400 mt-1 text-sm">Total Team</div>
                <div className="w-10 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mt-2"></div>
              </div>
            </div>
          )}

          {/* Team Section Header for specific views */}
          {filter !== 'all' && (
            <div className="mb-10">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${filter === 'board' ? 'bg-primary-50' : 'bg-accent-50'} mb-4`}>
                <div className={`w-3 h-3 rounded-full ${filter === 'board' ? 'bg-primary-500' : 'bg-accent-500'}`}></div>
                <span className={`text-sm font-medium ${filter === 'board' ? 'text-primary-700' : 'text-accent-700'}`}>
                  {filter === 'board' ? 'Governance & Strategy' : 'Expert Guidance & Support'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{currentTeam.title}</h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">{currentTeam.description}</p>
            </div>
          )}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, idx) => {
            const styles = roleStyles[member.category] || roleStyles.default;
            
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative rounded-xl p-5 border transition-all duration-500 animate-fade-in
                  ${styles.bg} ${styles.border}
                  ${hoveredCard === idx 
                    ? 'shadow-xl transform -translate-y-1 border-transparent' 
                    : 'shadow-md hover:shadow-lg'
                  }`}
              >
                {/* Profile Image Container */}
                <div className="relative mb-6">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} to-transparent rounded-full blur-xl opacity-0 transition-opacity duration-500 ${
                    hoveredCard === idx ? 'opacity-100' : ''
                  }`}></div>
                  
                  {/* Profile Image */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-lg transition-all duration-500 group-hover:blur-xl"></div>
                    <img
                      src={member.image}
                      alt={`${member.name}, ${member.role}`}
                      className={`relative w-32 h-32 mx-auto object-cover rounded-full border-4 border-white
                        transition-all duration-500 ease-out
                        ${hoveredCard === idx ? 'scale-105 shadow-lg' : 'scale-100 shadow-md'}`}
                      onError={(e) => {
                        e.target.src = '/assets/images/default-profile.png';
                        e.target.className = e.target.className + ' bg-gradient-to-br from-neutral-100 to-neutral-200';
                      }}
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Role Badge */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm transition-all duration-300 font-display
                      ${styles.badge}
                      ${hoveredCard === idx ? 'scale-105 shadow-md' : ''}`}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-lg font-bold text-center text-gray-900 mb-2 leading-tight font-display">
                  {member.name}
                </h2>

                {/* Bio */}
                <div className="relative h-16 overflow-hidden">
                  <p className="text-neutral-400 text-center text-xs leading-relaxed transition-all duration-300 line-clamp-3">
                    {member.bio}
                  </p>
                  {hoveredCard === idx && (
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/80 to-transparent"></div>
                  )}
                </div>

                {/* Category indicator */}
                <div className="mt-4 pt-4 border-t border-neutral-300/50">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
                    <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      {member.category}
                    </span>
                  </div>
                </div>

                {/* Hover overlay */}
                {hoveredCard === idx && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent rounded-xl pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-display">No team members found</h3>
            <p className="text-neutral-400">Try selecting a different category</p>
          </div>
        )}

        {/* Footer note */}
        {/* <div className="mt-12 pt-8 border-t border-neutral-300 text-center">
          <p className="text-neutral-400 mb-4 max-w-2xl mx-auto">
            Our team brings together diverse expertise from education, technology, healthcare, and community development 
            to drive innovation and create meaningful impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:-translate-y-0.5 font-display text-sm">
              <span>Join Our Team</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 border border-neutral-300 font-medium rounded-full hover:shadow-md hover:border-primary-300 transition-all duration-300 font-display text-sm">
              <span>Contact Us</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Team;