import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Team data — unchanged
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

const teamMembers = [...boardMembers, ...advisoryTeam];

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

  return (
    <>
      {/* Hero */}
      <section className="bg-soil-900 text-parchment-50 py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400">
              Meet the Team
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-medium mt-3 mb-6">
              Our Team
            </h1>
            <p className="text-parchment-100/70 max-w-xl mx-auto text-sm">
              A diverse collective of professionals united by passion and expertise.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="font-mono text-2xl text-laterite-400">{boardMembers.length}</div>
                <div className="text-xs text-parchment-100/60">Board Members</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl text-acacia-400">{advisoryTeam.length}</div>
                <div className="text-xs text-parchment-100/60">Advisors</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl text-maize-400">{teamMembers.length}</div>
                <div className="text-xs text-parchment-100/60">Total Team</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-10 bg-parchment-50 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 text-xs font-mono border transition-colors ${
                  filter === cat.id
                    ? 'border-laterite-500 text-laterite-600 bg-laterite-50'
                    : 'border-border text-ink-500 hover:border-laterite-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-20 bg-parchment-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-16 text-ink-500 font-mono text-sm">
              No team members found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member, idx) => (
                <motion.div
                  key={member.name + idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`bg-white border transition-all duration-300 ${
                    hoveredCard === idx
                      ? 'border-laterite-500/50 -translate-y-1'
                      : 'border-border'
                  }`}
                >
                  <div className="p-6 text-center space-y-4">
                    {/* Avatar */}
                    <div className="relative mx-auto w-28 h-28">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full border-2 border-border"
                        onError={(e) => {
                          e.target.src = '/assets/images/default-profile.png';
                        }}
                        loading="lazy"
                      />
                    </div>

                    {/* Name & Role */}
                    <div>
                      <h3 className="font-sans font-semibold text-ink-800 text-sm leading-tight">
                        {member.name}
                      </h3>
                      <p className={`text-xs font-mono mt-1 ${
                        member.category === 'board' ? 'text-laterite-500' : 'text-maize-600'
                      }`}>
                        {member.role}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-ink-500 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Category tag */}
                    <div className="pt-3 border-t border-border">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
                        {member.category === 'board' ? 'Board' : 'Advisory'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Team;