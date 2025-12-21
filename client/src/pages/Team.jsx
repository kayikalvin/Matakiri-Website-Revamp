import React from "react";

// Example team data. Replace with real data or fetch from API if needed.
const teamMembers = [
  {
    name: "Colin Turnbull",
    role: "Risk Analyst and Environmentalist",
    image: "/team/colinturnbull.png",
    bio: "Risk assessment, climate and environment expert"
  },
  {
    name: "Wanja",
    role: "Product Manager",
    image: "/team/prof_wanja.jpeg",
    bio: "Academic Professor and quality expert"
  },
  {
    name: "Esnas Turnbull",
    role: "Trustee",
    image: "/team/Esnas.jpg",
    bio: "Counsellor and personal development coach"
  },
  {
    name: "David Toeman",
    role: "Trustee",
    image: "/team/david_toeman.jpeg",
    bio: "Curriculum development expert"
  },
  {
    name: "Peter Wells",
    role: "Trustee",
    image: "/team/peter_wells.png",
    bio: "Business management and operations"
  },
  {
    name: "Edward Kunyanga",
    role: "Trustee",
    image: "/team/edward_kunyanga.jpg",
    bio: "Systems Strengthening, international and global expert in community empowerment"
  },
  {
    name: "Bismillah Kader",
    role: "Trustee",
    image: "/team/Bismillah.png",
    bio: "An educationist, entrepreneur and leader"
  },
  {
    name: "John Kanyaru",
    role: "Director & Chair",
    image: "/team/jk.jpg",
    bio: "A software engineering academic and practitioner"
  }
];

const Team = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Meet Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-primary"
              onError={e => { e.target.src = '/assets/images/default-profile.png'; }}
            />
            <h2 className="text-2xl font-semibold mb-2">{member.name}</h2>
            <p className="text-primary font-medium mb-2">{member.role}</p>
            <p className="text-gray-600 text-center">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
