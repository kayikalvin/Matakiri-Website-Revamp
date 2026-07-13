import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  UserGroupIcon,
  LightBulbIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  HandRaisedIcon,
  HeartIcon,
  ChartBarIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const About = () => {
  // The accordion remains, but now only one panel can open; it's an intentional
  // sequence, not decorative, so we keep it but refine the styling.
  const [openAccordion, setOpenAccordion] = useState(null);

  // Impact stats – now rendered as a single, typographic block rather than
  // a templated grid. The whole block fades in as one unit, respecting the
  // "one motion idea per section" rule.
  const impactStats = [
    { number: '232', label: 'Youths trained', icon: AcademicCapIcon },
    { number: '29', label: 'Tutors trained', icon: UserGroupIcon },
    { number: '18', label: 'Companies supported', icon: BuildingOfficeIcon },
    { number: '80', label: 'Elderly supported', icon: HeartIcon },
  ];

  const supportAreas = [
    {
      id: 1,
      icon: AcademicCapIcon,
      title: 'Youth Empowerment',
      description:
        'Hands‑on, practical courses with real‑world projects and entrepreneurship focus.',
      features: ['Hands‑on projects', 'Entrepreneurship focus', 'Job‑ready skills'],
      accent: 'laterite',
    },
    {
      id: 2,
      icon: UserGroupIcon,
      title: 'Engaging the elderly',
      description:
        'Social events, health checks, and cultural activities to support wellbeing.',
      features: ['Social events', 'Health checks', 'Cultural activities'],
      accent: 'acacia',
    },
    {
      id: 3,
      icon: BeakerIcon,
      title: 'Conservation agriculture',
      description:
        'Practical farming training focused on sustainability and value addition.',
      features: ['Practical training', 'Soil management', 'Value addition'],
      accent: 'maize',
    },
    {
      id: 4,
      icon: ComputerDesktopIcon,
      title: 'Computer literacy',
      description:
        'Digital skills training for students and community members.',
      features: ['Basic digital skills', 'Internet safety', 'Community sessions'],
      accent: 'laterite',
    },
    {
      id: 5,
      icon: MapPinIcon,
      title: 'Access to clean water',
      description:
        'Renewable‑energy water system with community access point.',
      features: ['Rainwater harvesting', 'Solar‑powered', 'Community access'],
      accent: 'acacia',
    },
  ];

  const specializedSupport = [
    {
      title: 'Refugee Education',
      description: 'Tailored programs for refugee communities.',
      icon: GlobeAltIcon,
      size: 'large',
    },
    {
      title: 'Inclusive Learning',
      description: 'Specialised support for diverse learning needs.',
      icon: HandRaisedIcon,
      size: 'small',
    },
    {
      title: 'Community Integration',
      description: 'Programmes promoting community cohesion.',
      icon: ChartBarIcon,
      size: 'small',
    },
  ];

  return (
    <div id="about" className="bg-parchment-50">
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header — fraunces display scale, no multi‑fade */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500 font-sans">
              About Us
            </span>
            <h1 className="font-display text-display-lg md:text-display-xl font-medium text-ink-800 mt-3 mb-6">
              Empowering Youth
              <span className="block text-laterite-500">Through Technology & Education</span>
            </h1>
            <p className="text-ink-500 max-w-3xl mx-auto text-sm">
              A community learning centre in Tharaka, Kenya, combining practical skill‑building,
              sustainable agriculture, and inclusive social care.
            </p>

            {/* Impact stats – single motion group, typographic */}
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mt-12 font-mono text-ink-800">
              {impactStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl tabular-nums font-medium">
                    {stat.number}
                  </div>
                  <div className="text-xs text-ink-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main content: asymmetric grid */}
          <div className="grid lg:grid-cols-5 gap-8 mb-20">
            {/* Left column (span 3): what we do + specialized support in a 1+2 layout */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-white border border-border p-8 relative overflow-hidden">
                {/* Subtle laterite soil-crack texture */}
                <div
                  className="absolute inset-0 opacity-[0.03] bg-repeat"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M10,10 L25,15 L40,10 L50,30 L30,50 L10,40 Z\" fill=\"none\" stroke=\"%23B5522E\" stroke-width=\"0.5\"/%3E%3C/svg%3E')",
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <LightBulbIcon className="h-7 w-7 text-laterite-500" />
                    <h2 className="font-display text-display-md font-medium text-ink-800">
                      What We Do
                    </h2>
                  </div>
                  <p className="text-ink-500 text-sm mb-6">
                    We work with organisations to fill gaps with our expertise in quality skill‑based
                    education and capacity development in computing and technology subjects.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Technical Skills Training',
                      'Entrepreneurship Development',
                      'Inclusive Education',
                      'Community Cohesion',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-ink-500">
                        <span className="w-1.5 h-1.5 bg-laterite-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specialised support: one large card + two smaller ones */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {specializedSupport
                  .filter((s) => s.size === 'large')
                  .map((area) => (
                    <div
                      key={area.title}
                      className="md:col-span-3 bg-white border border-border p-6 flex flex-col justify-between"
                    >
                      <area.icon className="h-6 w-6 text-laterite-500 mb-3" />
                      <h3 className="font-sans font-semibold text-ink-800 text-base">
                        {area.title}
                      </h3>
                      <p className="text-sm text-ink-500 mt-2">{area.description}</p>
                    </div>
                  ))}
                <div className="md:col-span-2 grid grid-cols-1 gap-4">
                  {specializedSupport
                    .filter((s) => s.size === 'small')
                    .map((area) => (
                      <div key={area.title} className="bg-white border border-border p-5">
                        <area.icon className="h-5 w-5 text-laterite-500 mb-2" />
                        <h3 className="font-sans font-semibold text-ink-800 text-sm">
                          {area.title}
                        </h3>
                        <p className="text-xs text-ink-500 mt-1">{area.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Right column (span 2): dark card with acacia leaf texture */}
            <div className="lg:col-span-2 bg-soil-950 text-parchment-50 p-8 flex flex-col justify-between relative overflow-hidden">
              {/* Acacia leaf silhouette scatter pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] bg-repeat"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"20\" cy=\"30\" r=\"3\" fill=\"%234F7942\"/%3E%3Ccircle cx=\"70\" cy=\"80\" r=\"4\" fill=\"%234F7942\"/%3E%3Cellipse cx=\"50\" cy=\"15\" rx=\"5\" ry=\"2\" fill=\"%234F7942\"/%3E%3C/svg%3E')",
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheckIcon className="h-7 w-7 text-laterite-400" />
                  <h2 className="font-display text-display-md font-medium">About Us</h2>
                </div>
                <p className="text-parchment-100/80 text-sm mb-6">
                  We are a Community & Learning Centre in Matakiri, Kenya, addressing urgent local
                  needs including:
                </p>
                <ul className="space-y-2 text-sm text-parchment-100/70">
                  <li className="flex items-start gap-2">
                    <span className="text-laterite-400 mt-1 text-xs">▸</span>
                    Technical skills training for youth
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-laterite-400 mt-1 text-xs">▸</span>
                    Sustainable agriculture practices
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-laterite-400 mt-1 text-xs">▸</span>
                    Elderly care and social services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-laterite-400 mt-1 text-xs">▸</span>
                    Community savings & credit cooperative
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-parchment-100/20 relative z-10">
                <p className="text-xs text-parchment-100/50 font-mono">
                  UK Registered Charity · Youth Empowerment · Inclusive Education
                </p>
              </div>
            </div>
          </div>

          {/* Support Areas – accordion preserved but with focus states and cleaner numbering */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500 font-sans">
                Our Support Areas
              </span>
              <h2 className="font-display text-display-lg font-medium text-ink-800 mt-2 mb-3">
                Comprehensive Support
              </h2>
              <p className="text-ink-500 text-sm max-w-xl mx-auto">
                A full spectrum of services leading to quality education and community development.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-3">
              {supportAreas.map((area, idx) => (
                <div key={area.id} className="border border-border bg-white">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left focus-visible:outline-2 focus-visible:outline-laterite-500 focus-visible:outline-offset-2"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-ink-500 w-6 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <area.icon className="h-5 w-5 text-laterite-500" />
                      <span className="font-sans font-semibold text-ink-800 text-sm">
                        {area.title}
                      </span>
                    </div>
                    <span className="text-ink-400 text-xs font-mono">
                      {openAccordion === idx ? '−' : '+'}
                    </span>
                  </button>

                  {openAccordion === idx && (
                    <div className="px-4 pb-6 pt-0 pl-16 text-sm text-ink-500 space-y-2">
                      <p>{area.description}</p>
                      <div className="space-y-1">
                        {area.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="w-1 h-1 bg-laterite-500" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA — subtle signal gradient top border */}
          <div className="text-center border border-border bg-white p-10 md:p-14 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-signal" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500 font-sans">
              Get Involved
            </span>
            <h2 className="font-display text-display-md font-medium text-ink-800 mt-2 mb-3">
              Ready to make an impact together?
            </h2>
            <p className="text-ink-500 text-sm max-w-lg mx-auto mb-8">
              Partner with us to create opportunities and transform communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-laterite-500 hover:bg-laterite-600 text-white px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500 focus-visible:outline-offset-2"
              >
                Become a Partner <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 hover:bg-laterite-50 px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500 focus-visible:outline-offset-2"
              >
                Support Our Work
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;