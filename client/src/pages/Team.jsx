// import React from "react";

// // Example team data. Replace with real data or fetch from API if needed.
// const teamMembers = [
//   {
//     name: "Colin Turnbull",
//     role: "Risk Analyst and Environmentalist",
//     image: "/team/colinturnbull.png",
//     bio: "Risk assessment, climate and environment expert"
//   },
//   {
//     name: "Wanja",
//     role: "Product Manager",
//     image: "/team/prof_wanja.jpeg",
//     bio: "Academic Professor and quality expert"
//   },
//   {
//     name: "Esnas Turnbull",
//     role: "Trustee",
//     image: "/team/Esnas.jpg",
//     bio: "Counsellor and personal development coach"
//   },
//   {
//     name: "David Toeman",
//     role: "Trustee",
//     image: "/team/david_toeman.jpeg",
//     bio: "Curriculum development expert"
//   },
//   {
//     name: "Peter Wells",
//     role: "Trustee",
//     image: "/team/peter_wells.png",
//     bio: "Business management and operations"
//   },
//   {
//     name: "Edward Kunyanga",
//     role: "Trustee",
//     image: "/team/edward_kunyanga.jpg",
//     bio: "Systems Strengthening, international and global expert in community empowerment"
//   },
//   {
//     name: "Bismillah Kader",
//     role: "Trustee",
//     image: "/team/Bismillah.png",
//     bio: "An educationist, entrepreneur and leader"
//   },
//   {
//     name: "John Kanyaru",
//     role: "Director & Chair",
//     image: "/team/jk.jpg",
//     bio: "A software engineering academic and practitioner"
//   }
// ];

// const Team = () => {
//   return (
//     <div className="container mx-auto py-12 px-4">
//       <h1 className="text-4xl font-bold mb-8 text-center">Meet Our Team</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {teamMembers.map((member, idx) => (
//           <div key={idx} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
//             <img
//               src={member.image}
//               alt={member.name}
//               className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-primary"
//               onError={e => { e.target.src = '/assets/images/default-profile.png'; }}
//             />
//             <h2 className="text-2xl font-semibold mb-2">{member.name}</h2>
//             <p className="text-primary font-medium mb-2">{member.role}</p>
//             <p className="text-gray-600 text-center">{member.bio}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Team;


import React, { useState } from "react";

// Example team data. Replace with real data or fetch from API if needed.
const teamMembers = [
  {
    name: "Colin Turnbull",
    role: "Risk Analyst and Environmentalist",
    image: "/team/colinturnbull.png",
    bio: "Risk assessment, climate and environment expert",
    category: "expert"
  },
  {
    name: "Wanja",
    role: "Product Manager",
    image: "/team/prof_wanja.jpeg",
    bio: "Academic Professor and quality expert",
    category: "expert"
  },
  {
    name: "Esnas Turnbull",
    role: "Trustee",
    image: "/team/Esnas.jpg",
    bio: "Counsellor and personal development coach",
    category: "trustee"
  },
  {
    name: "David Toeman",
    role: "Trustee",
    image: "/team/david_toeman.jpeg",
    bio: "Curriculum development expert",
    category: "trustee"
  },
  {
    name: "Peter Wells",
    role: "Trustee",
    image: "/team/peter_wells.png",
    bio: "Business management and operations",
    category: "trustee"
  },
  {
    name: "Edward Kunyanga",
    role: "Trustee",
    image: "/team/edward_kunyanga.jpg",
    bio: "Systems Strengthening, international and global expert in community empowerment",
    category: "trustee"
  },
  {
    name: "Bismillah Kader",
    role: "Trustee",
    image: "/team/Bismillah.png",
    bio: "An educationist, entrepreneur and leader",
    category: "trustee"
  },
  {
    name: "John Kanyaru",
    role: "Director & Chair",
    image: "/team/jk.jpg",
    bio: "A software engineering academic and practitioner",
    category: "leadership"
  }
];

// Modern color scheme - Professional & Elegant
const colors = {
  primary: {
    light: '#4F46E5', // Indigo
    DEFAULT: '#4338CA', // Darker Indigo
    dark: '#3730A3'
  },
  secondary: {
    light: '#0EA5E9', // Sky Blue
    DEFAULT: '#0284C7', // Cyan
    dark: '#0369A1'
  },
  accent: {
    light: '#10B981', // Emerald
    DEFAULT: '#059669',
    dark: '#047857'
  },
  neutral: {
    light: '#F8FAFC',
    DEFAULT: '#F1F5F9',
    dark: '#64748B'
  },
  background: {
    from: '#FFFFFF',
    to: '#F8FAFC',
    card: '#FFFFFF'
  }
};

// Role-based styling with new color scheme
const roleStyles = {
  'trustee': {
    bg: 'bg-gradient-to-br from-indigo-50/80 to-white',
    border: 'border-indigo-100',
    badge: 'bg-indigo-100 text-indigo-800',
    dot: 'bg-indigo-500',
    gradient: 'from-indigo-500/5'
  },
  'expert': {
    bg: 'bg-gradient-to-br from-emerald-50/80 to-white',
    border: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-800',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-500/5'
  },
  'leadership': {
    bg: 'bg-gradient-to-br from-violet-50/80 to-white',
    border: 'border-violet-100',
    badge: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
    dot: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    gradient: 'from-violet-500/5'
  },
  'default': {
    bg: 'bg-gradient-to-br from-slate-50/80 to-white',
    border: 'border-slate-100',
    badge: 'bg-slate-100 text-slate-800',
    dot: 'bg-slate-500',
    gradient: 'from-slate-500/5'
  }
};

const Team = () => {
  const [filter, setFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Get unique categories from team members
  const categories = ['all', ...new Set(teamMembers.map(member => member.category))];

  const filteredMembers = filter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-r from-emerald-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"></div>
              <span className="mx-4 text-slate-400 font-medium">OUR TEAM</span>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">Our Team</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              A diverse collective of professionals united by passion and expertise, 
              driving innovation and creating meaningful impact across all our initiatives.
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105
                  ${filter === category
                    ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md'
                  }`}
              >
                {category === 'all' ? 'All Members' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                {teamMembers.length}
              </div>
              <div className="text-slate-600 mt-2">Team Members</div>
              <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full mt-3"></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                {teamMembers.filter(m => m.category === 'trustee').length}
              </div>
              <div className="text-slate-600 mt-2">Trustees</div>
              <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full mt-3"></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                {teamMembers.filter(m => m.role.toLowerCase().includes('expert')).length}+
              </div>
              <div className="text-slate-600 mt-2">Experts</div>
              <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full mt-3"></div>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMembers.map((member, idx) => {
            const styles = roleStyles[member.category] || roleStyles.default;
            
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative rounded-2xl p-6 border transition-all duration-500 
                  ${styles.bg} ${styles.border}
                  ${hoveredCard === idx 
                    ? 'shadow-2xl transform -translate-y-2 border-transparent' 
                    : 'shadow-lg hover:shadow-xl'
                  }`}
              >
                {/* Profile Image Container */}
                <div className="relative mb-8">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} to-transparent rounded-full blur-xl opacity-0 transition-opacity duration-500 ${
                    hoveredCard === idx ? 'opacity-100' : ''
                  }`}></div>
                  
                  {/* Profile Image */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-emerald-400/20 rounded-full blur-lg transition-all duration-500 group-hover:blur-xl"></div>
                    <img
                      src={member.image}
                      alt={`${member.name}, ${member.role}`}
                      className={`relative w-40 h-40 mx-auto object-cover rounded-full border-4 border-white
                        transition-all duration-500 ease-out
                        ${hoveredCard === idx ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'}`}
                      onError={(e) => {
                        e.target.src = '/assets/images/default-profile.png';
                        e.target.className = e.target.className + ' bg-gradient-to-br from-slate-100 to-slate-200';
                      }}
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Role Badge */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-md transition-all duration-300
                      ${styles.badge}
                      ${hoveredCard === idx ? 'scale-105 shadow-lg' : ''}`}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-center text-slate-900 mb-3 leading-tight">
                  {member.name}
                </h2>

                {/* Bio */}
                <div className="relative h-20 overflow-hidden">
                  <p className="text-slate-600 text-center text-sm leading-relaxed transition-all duration-300 line-clamp-3">
                    {member.bio}
                  </p>
                  {hoveredCard === idx && (
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent"></div>
                  )}
                </div>

                {/* Category indicator */}
                <div className="mt-6 pt-5 border-t border-slate-200/50">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${member.category === 'leadership' ? styles.dot : ` ${styles.dot}`}`}></span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {member.category}
                    </span>
                  </div>
                </div>

                {/* Hover overlay */}
                {hoveredCard === idx && (
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent rounded-2xl pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-3xl mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-3">No team members found</h3>
            <p className="text-slate-500">Try selecting a different category</p>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-16 pt-10 border-t border-slate-100 text-center">
          <p className="text-slate-600 mb-4">
            Our team is committed to excellence, innovation, and collaborative success across all our initiatives.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
            <span>Join Our Team</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;