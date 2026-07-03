import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackStats = [
    {
      number: '5,000+',
      label: 'Beneficiaries',
      icon: UserGroupIcon,
      description: 'Lives transformed through our initiatives',
    },
    {
      number: '25+',
      label: 'Projects',
      icon: BriefcaseIcon,
      description: 'Successful community projects delivered',
    },
    {
      number: '15+',
      label: 'Communities',
      icon: MapPinIcon,
      description: 'Regions across Kenya empowered',
    },
    {
      number: '5+',
      label: 'Years',
      icon: CalendarDaysIcon,
      description: 'Of consistent community development',
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await require('../../services/api').projectsAPI.getStats();
        const mappedStats = [
          {
            number: data?.totalBeneficiaries ? `${data.totalBeneficiaries}+` : '5,000+',
            label: 'Beneficiaries',
            icon: UserGroupIcon,
            description: 'Lives transformed through our initiatives',
          },
          {
            number: data?.totalProjects ? `${data.totalProjects}+` : '25+',
            label: 'Projects',
            icon: BriefcaseIcon,
            description: 'Successful community projects delivered',
          },
          {
            number: data?.communitiesServed ? `${data.communitiesServed}+` : '15+',
            label: 'Communities',
            icon: MapPinIcon,
            description: 'Regions across Kenya empowered',
          },
          {
            number: data?.yearsOfImpact ? `${data.yearsOfImpact}+` : '5+',
            label: 'Years',
            icon: CalendarDaysIcon,
            description: 'Of consistent community development',
          },
        ];
        setStats(mappedStats);
      } catch (err) {
        console.error('Stats API error:', err);
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section id='stats' className="py-20 md:py-28 bg-parchment-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
            Our Impact
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-ink-800 mt-2">
            Making a Measurable Difference
          </h2>
          <p className="text-ink-500 text-sm mt-3">
            Through years of dedicated work, tangible impact across communities — here in numbers.
          </p>
        </motion.div>

        {/* Stats grid */}
        {loading ? (
          <div className="text-center py-12 text-ink-500 font-mono text-sm flex items-center justify-center gap-2">
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
            Loading stats…
          </div>
        ) : error ? (
          <div className="text-center text-status-danger font-mono text-sm py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white border border-border p-6 space-y-4 hover:border-laterite-500/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
                      {stat.label}
                    </span>
                    <stat.icon className="h-5 w-5 text-laterite-500" />
                  </div>
                  <div className="font-mono text-3xl text-ink-800 tabular-nums">
                    {stat.number}
                  </div>
                  <p className="text-ink-500 text-xs">{stat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No "Impact Note" or progress bars — clean, minimal */}
      </div>
    </section>
  );
};

export default StatsSection;