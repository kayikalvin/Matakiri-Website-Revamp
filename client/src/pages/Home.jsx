import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BeakerIcon,
  CpuChipIcon,
  UserGroupIcon,
  MapPinIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { projectsAPI, partnersAPI, newsAPI } from "../services/api";

// ---------- Contour Line SVG ----------
const ContourLine = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Measure the path length after mount for dasharray/offset
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      setMounted(true);
    }
  }, []);

  // Scroll progress of the whole homepage container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll value a bit for a more organic draw
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Map scroll progress to stroke-dashoffset (full length → 0)
  const strokeDashoffset = useTransform(
    smoothProgress,
    [0, 1],
    [pathLength, 0]
  );

  // When reduced motion is preferred, we skip the scroll animation and just show the path
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The contour path – a gentle, river-like curve. Designed to look organic
  // even when stretched with preserveAspectRatio="none".
  const pathD =
    "M 100,100 C 200,200 150,400 300,600 C 450,800 400,1000 600,1200 " +
    "C 750,1400 600,1600 500,1800 C 400,2000 550,2200 700,2400 " +
    "C 850,2600 750,2800 600,3000 C 450,3200 600,3400 800,3600 " +
    "C 950,3800 850,4000 750,4200 C 650,4400 700,4600 800,4800 " +
    "C 900,5000 750,5200 600,5400 C 450,5600 550,5800 700,6000";

  return (
    <svg
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 1000 6000"
      style={{ zIndex: 0 }}
    >
      <defs>
        <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B5522E" /> {/* laterite-500 */}
          <stop offset="33%" stopColor="#B5522E" />
          <stop offset="33%" stopColor="#4F7942" /> {/* acacia-500 */}
          <stop offset="66%" stopColor="#4F7942" />
          <stop offset="66%" stopColor="#D6A62C" /> {/* maize-500 */}
          <stop offset="100%" stopColor="#D6A62C" />
        </linearGradient>
      </defs>

      <motion.path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#signalGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={
          prefersReducedMotion
            ? { strokeDashoffset: 0 }
            : { strokeDashoffset: pathLength }
        }
        animate={
          prefersReducedMotion
            ? {}
            : { strokeDashoffset: 0, transition: { duration: 1.8, ease: [0.65, 0, 0.35, 1], delay: 0.3 } }
        }
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: prefersReducedMotion ? 0 : strokeDashoffset,
        }}
      />
    </svg>
  );
};

// ---------- Focus Cluster (asymmetric) ----------
const FocusCluster = () => {
  const focusAreas = [
    {
      icon: BeakerIcon,
      title: "Sustainable Agriculture",
      description:
        "Climate‑smart farming, water harvesting, and soil conservation that put food on the table and income in pockets.",
      accent: "laterite",
      size: "large", // primary card
    },
    {
      icon: CpuChipIcon,
      title: "AI & Data Training",
      description:
        "Teaching young people to build ML models for crop disease detection, market pricing, and local health mapping.",
      accent: "maize",
      size: "small",
    },
    {
      icon: UserGroupIcon,
      title: "Community & Elder Care",
      description:
        "Supporting the elderly, improving water access, and running literacy programmes that strengthen the community.",
      accent: "laterite",
      size: "small",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
      {/* Large card takes 3 columns on lg */}
      {focusAreas
        .filter((area) => area.size === "large")
        .map((area) => (
          <div
            key={area.title}
            className="lg:col-span-3 bg-white border border-laterite-500 p-8 space-y-4 relative overflow-hidden"
          >
            {/* subtle maize row-line pattern as illustration texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cline x1=\"0\" y1=\"20\" x2=\"40\" y2=\"20\" stroke=\"%23000\" stroke-width=\"1\"/%3E%3C/svg%3E')" }} />
            <div className="relative z-10">
              <area.icon className="h-8 w-8 text-laterite-500 mb-2" />
              <h3 className="font-display text-2xl font-medium text-ink-800 mb-3">
                {area.title}
              </h3>
              <p className="text-ink-500 text-base leading-relaxed max-w-md">
                {area.description}
              </p>
            </div>
          </div>
        ))}

      {/* Two smaller cards in the remaining 2 columns */}
      <div className="lg:col-span-2 grid grid-cols-1 gap-6">
        {focusAreas
          .filter((area) => area.size === "small")
          .map((area) => (
            <div
              key={area.title}
              className={`bg-white border ${
                area.accent === "laterite"
                  ? "border-laterite-500"
                  : "border-maize-400"
              } p-6 space-y-3`}
            >
              <area.icon
                className={`h-6 w-6 ${
                  area.accent === "laterite" ? "text-laterite-500" : "text-maize-500"
                }`}
              />
              <h3 className="font-display text-lg font-medium text-ink-800">
                {area.title}
              </h3>
              <p className="text-ink-500 text-sm leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

// ---------- Stats Module (count-up on scroll) ----------
const StatsModule = ({ stats }) => {
  return (
    <div className="relative max-w-4xl mx-auto py-12">
      {/* The contour line passes through here; we leave space for it */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((stat, i) => (
          <CountUpItem key={i} number={stat.number} label={stat.label} />
        ))}
      </div>
    </div>
  );
};

const CountUpItem = ({ number, label }) => {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(number, 10);
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, number]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="font-display text-5xl md:text-6xl font-medium text-soil-900">
        {count}+
      </div>
      <p className="text-ink-500 text-sm font-medium tracking-wide">{label}</p>
    </div>
  );
};

// ---------- Project Showcase (asymmetric) ----------
const ProjectShowcase = ({ projects, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-border bg-parchment-50 animate-pulse h-72" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl opacity-20">🏗️</span>
        <p className="text-ink-500 font-mono text-sm mt-4">No projects yet.</p>
        <Link to="/projects" className="text-laterite-500 text-xs font-mono mt-2 inline-block">
          View all projects &rarr;
        </Link>
      </div>
    );
  }

  // Show first project larger, the rest in a 2‑column grid
  const [first, ...rest] = projects;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Featured project – full width, large image */}
      {first && (
        <Link
          to={`/projects/${first._id || first.id}`}
          className="group block border border-border bg-white hover:border-laterite-500/40 transition-all duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-video md:aspect-auto bg-soil-900/5 overflow-hidden">
              {first.images?.[0] ? (
                <img
                  src={typeof first.images[0] === "string" ? first.images[0] : first.images[0].url}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-soil-900/10 text-ink-300">
                  <PhotoIcon className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col justify-center space-y-3">
              {first.category && (
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-laterite-50 text-laterite-700 self-start px-2 py-0.5 border border-laterite-200">
                  {first.category}
                </span>
              )}
              <h3 className="font-display text-2xl font-medium text-ink-800 group-hover:text-laterite-600 transition-colors">
                {first.title || first.name}
              </h3>
              <p className="text-ink-500 text-sm line-clamp-3">
                {first.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-ink-400 font-mono pt-2">
                {first.startDate && <span>{new Date(first.startDate).getFullYear()}</span>}
                {first.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3" /> {first.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Remaining projects in a 2‑column grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((project) => (
            <Link
              key={project._id || project.id}
              to={`/projects/${project._id || project.id}`}
              className="group block border border-border bg-white hover:border-laterite-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-video bg-soil-900/5 overflow-hidden relative">
                {project.images?.[0] ? (
                  <img
                    src={typeof project.images[0] === "string" ? project.images[0] : project.images[0].url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-soil-900/10 text-ink-300">
                    <PhotoIcon className="h-10 w-10" />
                  </div>
                )}
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
                <div className="flex items-center gap-3 text-xs text-ink-400 font-mono pt-2 border-t border-border">
                  {project.startDate && <span>{new Date(project.startDate).getFullYear()}</span>}
                  {project.location && (
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" /> {project.location}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-laterite-500 hover:text-laterite-600 transition-colors font-medium"
        >
          View all projects <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

// ---------- News Feed (asymmetric) ----------
const NewsFeed = ({ articles, loading }) => {
  if (loading) {
    return <div className="text-center text-ink-500 font-mono text-sm">Loading news…</div>;
  }
  if (articles.length === 0) {
    return <div className="text-center text-ink-500 font-mono text-sm">No articles yet.</div>;
  }

  const [featured, ...rest] = articles;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {featured && (
        <Link
          to={`/news/${featured._id || featured.id}`}
          className="group block bg-white border border-border hover:border-laterite-500/40 transition-colors p-6 md:p-8"
        >
          <p className="text-xs font-mono text-ink-500 mb-3">
            {new Date(featured.createdAt || featured.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <h3 className="font-display text-2xl font-medium text-ink-800 group-hover:text-laterite-600 transition-colors mb-3">
            {featured.title}
          </h3>
          <p className="text-ink-500 text-sm leading-relaxed">
            {featured.excerpt || featured.description}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-laterite-500 mt-4">
            Read more <ArrowRightIcon className="h-3 w-3" />
          </span>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((article) => (
            <Link
              key={article._id || article.id}
              to={`/news/${article._id || article.id}`}
              className="group border border-border bg-parchment-50 hover:border-laterite-500/40 transition-colors p-5 space-y-3"
            >
              <p className="text-xs font-mono text-ink-500">
                {new Date(article.createdAt || article.publishedAt).toLocaleDateString("en-US", {
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
          className="inline-flex items-center gap-2 text-sm text-laterite-500 hover:text-laterite-600 transition-colors font-medium"
        >
          All updates <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

// ---------- Home Page ----------
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

  // Example stats – replace with real data from API or static
  const stats = [
    { number: "1200", label: "Families Reached" },
    { number: "45", label: "Active Projects" },
    { number: "18", label: "Partner Organizations" },
  ];

  return (
    <>
      <Helmet>
        <title>Matakiri Tumaini Centre — Community & AI Innovation in Tharaka, Kenya</title>
        <meta
          name="description"
          content="A community learning centre in rural Tharaka doing hands‑on agriculture, elderly care, water access, and AI/data‑science training."
        />
      </Helmet>

      {/* Entire page container for the contour line overlay */}
      <div className="relative">
        {/* Contour line behind everything */}
        <ContourLine />

        {/* Hero (keeping the existing HeroSection but with relative z-index) */}
        <div className="relative z-10">
          <HeroSection />
        </div>

        {/* Focus Areas – asymmetric */}
        <section id="home" className="py-20 md:py-28 bg-parchment-50 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
                Our Focus
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-ink-800 mt-2">
                Hands‑on work, real results
              </h2>
              <p className="text-ink-500 text-sm mt-3">
                Three areas where community need meets technical skill.
              </p>
            </div>
            <FocusCluster />
          </div>
        </section>

        {/* Stats – count up, minimal */}
        <section className="py-16 bg-white relative z-10">
          <div className="container mx-auto px-4">
            <StatsModule stats={stats} />
          </div>
        </section>

        {/* Projects – asymmetric showcase */}
        <section id="projects" className="py-20 md:py-28 bg-parchment-50 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
                Field Work
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-ink-800 mt-2">
                Recent projects
              </h2>
              <p className="text-ink-500 text-sm mt-3">
                A few of the initiatives we're running right now.
              </p>
            </div>
            <ProjectShowcase projects={featuredProjects} loading={loading} />
          </div>
        </section>

        {/* Partners strip – keeps existing layout but with a subtle signal line above */}
        <section id="partners" className="py-16 bg-parchment-50 border-y border-border relative z-10">
          {/* Thin signal underline as decorative */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-signal opacity-40" />
          <div className="container mx-auto px-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500 text-center mb-8">
              Trusted by
            </p>
            {loading ? (
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 w-20 bg-soil-900/10 animate-pulse" />
                ))}
              </div>
            ) : partners.length === 0 ? (
              <p className="text-center text-xs font-mono text-ink-500">Partnerships coming soon.</p>
            ) : (
              <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 opacity-70">
                {partners.map((p) => (
                  <div key={p._id || p.id} className="h-14 flex items-center justify-center transition-opacity hover:opacity-100 group">
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
                <Link to="/partners" className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-500 hover:text-laterite-500 transition-colors">
                  See all partners <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* News – asymmetric feed */}
        <section id="news" className="py-20 md:py-28 bg-white relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-laterite-500">
                Updates
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-ink-800 mt-2">
                From the field
              </h2>
              <p className="text-ink-500 text-sm mt-3">
                Stories, announcements, and reports from our work.
              </p>
            </div>
            <NewsFeed articles={news} loading={loading} />
          </div>
        </section>

        {/* CTA – with signal gradient accent line */}
        <section className="py-24 md:py-32 bg-soil-900 text-parchment-50 relative z-10">
          {/* Signal line as top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-signal" />
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
      </div>
    </>
  );
};

export default Home;