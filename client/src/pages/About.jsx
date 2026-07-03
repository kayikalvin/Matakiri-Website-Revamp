import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  UserGroupIcon,
  LightBulbIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CodeBracketIcon,
  CircleStackIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  HandRaisedIcon,
  SunIcon,
  SparklesIcon,
  HeartIcon,
  ChartBarIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const About = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

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
    },
    {
      id: 2,
      icon: UserGroupIcon,
      title: 'Engaging the elderly',
      description:
        'Social events, health checks, and cultural activities to support wellbeing.',
      features: ['Social events', 'Health checks', 'Cultural activities'],
    },
    {
      id: 3,
      icon: BeakerIcon,
      title: 'Conservation agriculture',
      description:
        'Practical farming training focused on sustainability and value addition.',
      features: ['Practical training', 'Soil management', 'Value addition'],
    },
    {
      id: 4,
      icon: ComputerDesktopIcon,
      title: 'Computer literacy',
      description:
        'Digital skills training for students and community members.',
      features: ['Basic digital skills', 'Internet safety', 'Community sessions'],
    },
    {
      id: 5,
      icon: MapPinIcon,
      title: 'Access to clean water',
      description:
        'Renewable‑energy water system with community access point.',
      features: ['Rainwater harvesting', 'Solar‑powered', 'Community access'],
    },
  ];

  const specializedSupport = [
    {
      title: 'Refugee Education',
      description: 'Tailored programs for refugee communities.',
      icon: GlobeAltIcon,
    },
    {
      title: 'Inclusive Learning',
      description: 'Specialised support for diverse learning needs.',
      icon: HandRaisedIcon,
    },
    {
      title: 'Community Integration',
      description: 'Programmes promoting community cohesion.',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div id="about" className="bg-parchment-50">
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-ink-800 mt-3 mb-6">
              Empowering Youth
              <span className="block text-laterite-500">Through Technology & Education</span>
            </h1>
            <p className="text-ink-500 max-w-3xl mx-auto text-sm">
              Empowering youth through technical skills training, entrepreneurship development,
              and inclusive learning environments.
            </p>

            {/* Impact stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {impactStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white border border-border p-5 text-center"
                >
                  <stat.icon className="h-6 w-6 text-laterite-500 mx-auto mb-2" />
                  <div className="font-mono text-2xl text-ink-800 tabular-nums">{stat.number}</div>
                  <div className="text-xs text-ink-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {/* Left column: What We Do */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <LightBulbIcon className="h-7 w-7 text-laterite-500" />
                  <h2 className="font-display text-xl font-medium text-ink-800">What We Do</h2>
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

              {/* Specialised support */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {specializedSupport.map((area, idx) => (
                  <div key={idx} className="bg-white border border-border p-6">
                    <area.icon className="h-5 w-5 text-laterite-500 mb-3" />
                    <h3 className="font-sans font-semibold text-ink-800 text-sm">{area.title}</h3>
                    <p className="text-xs text-ink-500 mt-1">{area.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: About card */}
            <div className="bg-soil-900 text-parchment-50 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheckIcon className="h-7 w-7 text-laterite-400" />
                  <h2 className="font-display text-xl font-medium">About Us</h2>
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
              <div className="mt-8 pt-6 border-t border-parchment-100/20">
                <p className="text-xs text-parchment-100/50 font-mono">
                  UK Registered Charity · Youth Empowerment · Inclusive Education
                </p>
              </div>
            </div>
          </div>

          {/* Support Areas accordion */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
                Our Support Areas
              </span>
              <h2 className="font-display text-3xl font-medium text-ink-800 mt-2 mb-3">
                Comprehensive Support
              </h2>
              <p className="text-ink-500 text-sm max-w-xl mx-auto">
                A full spectrum of services leading to quality education and community development.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {supportAreas.map((area, idx) => (
                <div key={area.id} className="border border-border bg-white">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-ink-500 w-6">
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

          {/* CTA */}
          <div className="text-center border border-border bg-white p-10 md:p-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
              Get Involved
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-medium text-ink-800 mt-2 mb-3">
              Ready to make an impact together?
            </h2>
            <p className="text-ink-500 text-sm max-w-lg mx-auto mb-8">
              Partner with us to create opportunities and transform communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-laterite-500 hover:bg-laterite-600 text-white px-6 py-3 text-sm font-medium transition-colors"
              >
                Become a Partner <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 hover:bg-laterite-50 px-6 py-3 text-sm font-medium transition-colors"
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