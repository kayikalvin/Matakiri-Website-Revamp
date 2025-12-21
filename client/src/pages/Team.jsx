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

// Role-based styling using your theme colors
const roleStyles = {
  'trustee': {
    bg: 'bg-gradient-to-br from-primary-50 to-white',
    border: 'border-primary-100',
    badge: 'bg-primary-100 text-primary-700',
    dot: 'bg-primary-500',
    gradient: 'from-primary-500/5',
    text: 'text-primary-700'
  },
  'expert': {
    bg: 'bg-gradient-to-br from-accent-50 to-white',
    border: 'border-accent-100',
    badge: 'bg-accent-100 text-accent-700',
    dot: 'bg-accent-500',
    gradient: 'from-accent-500/5',
    text: 'text-accent-700'
  },
  'leadership': {
    bg: 'bg-gradient-to-br from-primary-50 to-white',
    border: 'border-primary-100',
    badge: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white',
    dot: 'bg-gradient-to-r from-primary-500 to-accent-500',
    gradient: 'from-primary-500/5',
    text: 'text-primary-700'
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

  // Get unique categories from team members
  const categories = ['all', ...new Set(teamMembers.map(member => member.category))];

  const filteredMembers = filter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-100/30 to-white py-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Decorative elements using theme colors */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-primary-100/20 to-accent-100/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-r from-accent-100/20 to-primary-100/20 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
              <span className="mx-4 text-neutral-400 font-medium font-display tracking-wider">OUR TEAM</span>
              <div className="w-24 h-1 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Our Team</span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              A diverse collective of professionals united by passion and expertise, 
              driving innovation and creating meaningful impact across all our initiatives.
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 font-display text-sm
                  ${filter === category
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white text-gray-700 border border-neutral-300 hover:border-primary-300 hover:text-primary-700 hover:shadow-md'
                  }`}
              >
                {category === 'all' ? 'All Members' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-300 hover:shadow-md transition-shadow duration-300">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                {teamMembers.length}
              </div>
              <div className="text-neutral-400 mt-1 text-sm">Team Members</div>
              <div className="w-10 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mt-2"></div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-300 hover:shadow-md transition-shadow duration-300">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                {teamMembers.filter(m => m.category === 'trustee').length}
              </div>
              <div className="text-neutral-400 mt-1 text-sm">Trustees</div>
              <div className="w-10 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mt-2"></div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-300 hover:shadow-md transition-shadow duration-300">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                {teamMembers.filter(m => m.role.toLowerCase().includes('expert')).length}+
              </div>
              <div className="text-neutral-400 mt-1 text-sm">Experts</div>
              <div className="w-10 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mt-2"></div>
            </div>
          </div>
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
        <div className="mt-12 pt-8 border-t border-neutral-300 text-center">
          <p className="text-neutral-400 mb-4">
            Our team is committed to excellence, innovation, and collaborative success across all our initiatives.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:-translate-y-0.5 font-display text-sm">
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