import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BeakerIcon,
  CpuChipIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import HeroSection from "../components/Home/HeroSection";
import StatsSection from "../components/Home/StatsSection";
import { projectsAPI, partnersAPI, newsAPI } from "../services/api";
import { MapPinIcon } from "lucide-react";

// ---------- Section Header (reusable) ----------
const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="text-center max-w-2xl mx-auto mb-12">
    {eyebrow && (
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
        {eyebrow}
      </span>
    )}
    <h2 className="font-display text-3xl md:text-4xl font-medium text-ink-800 mt-2">
      {title}
    </h2>
    {description && <p className="text-ink-500 text-sm mt-3">{description}</p>}
  </div>
);

// ---------- Focus Area Card ----------
const FocusCard = ({ icon: Icon, title, description, accent }) => {
  const borderColor =
    accent === "laterite" ? "border-laterite-500" : "border-maize-400";
  return (
    <div className={`border ${borderColor} bg-white p-6 space-y-4`}>
      <div
        className={`h-10 w-10 flex items-center justify-center ${accent === "laterite" ? "text-laterite-500" : "text-maize-500"}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-medium text-ink-800">{title}</h3>
      <p className="text-ink-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [partners, setPartners] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [projRes, partRes, newsRes] = await Promise.all([
          projectsAPI.getAll({ limit: 3, sort: "-createdAt" }),
          partnersAPI.getAll({ limit: 8 }),
          newsAPI.getAll({ limit: 3, sort: "-createdAt" }),
        ]);
        // apiService.get returns the full body { success, data: [...] }
        setFeaturedProjects(projRes.data || []);
        setPartners(partRes.data || []);
        setNews(newsRes.data || []);
      } catch (err) {
        console.error("Home data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const focusAreas = [
    {
      icon: BeakerIcon,
      title: "Sustainable Agriculture",
      description:
        "Climate‑smart farming techniques, water harvesting, and soil conservation that put food on the table and income in pockets.",
      accent: "laterite",
    },
    {
      icon: CpuChipIcon,
      title: "AI & Data Training",
      description:
        "Teaching young people to build machine‑learning models for crop disease detection, market pricing, and local health mapping.",
      accent: "maize",
    },
    {
      icon: UserGroupIcon,
      title: "Community & Elder Care",
      description:
        "Supporting the elderly, improving water access, and running literacy programmes that strengthen the whole community.",
      accent: "laterite",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Matakiri Tumaini Centre — Community & AI Innovation in Tharaka, Kenya
        </title>
        <meta
          name="description"
          content="A community learning centre in rural Tharaka doing hands‑on agriculture, elderly care, water access, and AI/data‑science training."
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <HeroSection />

        {/* What we do */}
        <section id="home" className="py-20 md:py-28 bg-parchment-50">
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Our Focus"
              title="Hands‑on work, real results"
              description="Three areas where community need meets technical skill."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {focusAreas.map((area) => (
                <FocusCard key={area.title} {...area} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <StatsSection />

        {/* Featured Projects */}
        <section id="projects" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Field Work"
              title="Recent projects"
              description="A few of the initiatives we're running right now."
            />

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-border bg-parchment-50 animate-pulse"
                  >
                    <div className="aspect-video bg-soil-900/10" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-soil-900/10 w-3/4" />
                      <div className="h-4 bg-soil-900/10 w-full" />
                      <div className="h-4 bg-soil-900/10 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && featuredProjects.length === 0 && (
              <div className="text-center py-16 max-w-md mx-auto">
                <div className="text-6xl mb-4 opacity-20">🏗️</div>
                <p className="text-ink-500 font-mono text-sm mb-4">
                  No projects have been added yet. Check back soon for updates
                  from the field.
                </p>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-xs font-mono text-laterite-500 hover:text-laterite-600 transition-colors"
                >
                  View all projects <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Project cards */}
            {!loading && featuredProjects.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {featuredProjects.map((project) => (
                    <Link
                      key={project._id || project.id}
                      to={`/projects/${project._id || project.id}`}
                      className="group block border border-border bg-white hover:border-laterite-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-video bg-soil-900/5 relative overflow-hidden">
                        {project.images?.[0] ? (
                          <img
                            src={
                              typeof project.images[0] === "string"
                                ? project.images[0]
                                : project.images[0].url
                            }
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-soil-900/10 text-ink-300">
                            <PhotoIcon className="h-10 w-10" />
                          </div>
                        )}

                        {/* Category badge */}
                        {project.category && (
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-white/90 text-ink-700 border border-border px-2 py-0.5">
                              {project.category}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="font-display text-lg font-medium text-ink-800 group-hover:text-laterite-600 transition-colors line-clamp-1">
                          {project.title || project.name}
                        </h3>
                        <p className="text-ink-500 text-sm line-clamp-2">
                          {project.description || "No description available."}
                        </p>
                        {/* Optional: date or location */}
                        <div className="flex items-center gap-3 text-xs text-ink-400 font-mono pt-2 border-t border-border">
                          {project.startDate && (
                            <span>
                              {new Date(project.startDate).getFullYear()}
                            </span>
                          )}
                          {project.location && (
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="h-3 w-3" />
                              {project.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 text-sm text-laterite-500 hover:text-laterite-600 transition-colors font-medium"
                  >
                    View all projects <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Partners strip */}
        <section
          id="partners"
          className="py-16 bg-parchment-50 border-y border-border"
        >
          <div className="container mx-auto px-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500 text-center mb-8">
              Trusted by
            </p>

            {loading ? (
              /* Skeleton state */
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-12 w-20 bg-soil-900/10 animate-pulse"
                  />
                ))}
              </div>
            ) : partners.length === 0 ? (
              <p className="text-center text-xs font-mono text-ink-500">
                Partnerships coming soon.
              </p>
            ) : (
              <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 opacity-70">
                {partners.map((p) => (
                  <div
                    key={p._id || p.id}
                    className="h-14 flex items-center justify-center transition-opacity hover:opacity-100 group"
                  >
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt={p.name || "Partner"}
                        className="max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <span className="font-display text-sm text-ink-500 tracking-wider group-hover:text-laterite-500 transition-colors">
                        {p.name || "Partner"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {partners.length > 0 && (
              <div className="text-center mt-8">
                <Link
                  to="/partners"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-500 hover:text-laterite-500 transition-colors"
                >
                  See all partners <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Latest News */}
        <section id="news" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <SectionHeader
              eyebrow="Updates"
              title="From the field"
              description="Stories, announcements, and reports from our work."
            />
            {loading ? (
              <div className="text-center text-ink-500 font-mono text-sm">
                Loading news…
              </div>
            ) : news.length === 0 ? (
              <div className="text-center text-ink-500 font-mono text-sm">
                No articles yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {news.map((article) => (
                  <Link
                    key={article._id || article.id}
                    to={`/news/${article._id || article.id}`}
                    className="group border border-border bg-parchment-50 hover:border-laterite-500/40 transition-colors p-5 space-y-3"
                  >
                    <p className="text-xs font-mono text-ink-500">
                      {new Date(
                        article.createdAt || article.publishedAt,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <h3 className="font-display text-lg font-medium text-ink-800 group-hover:text-laterite-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-ink-500 text-sm line-clamp-2">
                      {article.excerpt || article.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-laterite-500">
                      Read more <ArrowRightIcon className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <div className="text-center mt-10">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-sm text-laterite-500 hover:text-laterite-600 transition-colors"
              >
                All updates <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 md:py-32 bg-soil-900 text-parchment-50">
          <div className="container mx-auto px-4 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400">
              Get involved
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-medium mt-3 mb-4">
              Ready to partner with us?
            </h2>
            <p className="text-parchment-100/70 max-w-xl mx-auto text-sm mb-8">
              Whether you’re a donor, an NGO, a university, or a community
              member — there’s a place for you here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-laterite-500 hover:bg-laterite-600 text-white px-6 py-3 text-sm font-medium transition-colors"
              >
                Contact us <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-parchment-100/30 hover:border-laterite-500 text-parchment-50 px-6 py-3 text-sm font-medium transition-colors"
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Home;
