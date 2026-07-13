import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  MagnifyingGlassIcon,
  NewspaperIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { newsAPI } from '../services/api';
import NewsCard from '../components/shared/NewsCard'; // assumes this component is already using the token system

// ---------- Subtle acacia texture for the hero ----------
const AcaciaTexture = () => (
  <div
    className="absolute inset-0 opacity-[0.04] bg-repeat pointer-events-none"
    style={{
      backgroundImage:
        "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"20\" cy=\"30\" r=\"3\" fill=\"%234F7942\"/%3E%3Ccircle cx=\"70\" cy=\"80\" r=\"4\" fill=\"%234F7942\"/%3E%3Cellipse cx=\"50\" cy=\"15\" rx=\"5\" ry=\"2\" fill=\"%234F7942\"/%3E%3C/svg%3E')",
    }}
  />
);

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'All',
    'Agriculture',
    'Education',
    'Health',
    'Technology',
    'Community',
    'Innovation',
  ];

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 12,
      };
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await newsAPI.getAll(params);
      setNews(response?.data || []);
      setTotalPages(response?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, [currentPage, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Separate the first article as featured
  const featuredArticle = news.length > 0 ? news[0] : null;
  const remainingArticles = news.length > 1 ? news.slice(1) : [];

  return (
    <>
      <Helmet>
        <title>News & Updates – Matakiri Tumaini Centre</title>
        <meta
          name="description"
          content="Stay updated with the latest news, stories, and developments from Matakiri Tumaini Centre."
        />
      </Helmet>

      {/* Hero – soil-950 full-bleed with signal accent and acacia texture */}
      <section className="relative bg-soil-950 text-parchment-50 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-signal" />
        <AcaciaTexture />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400 font-sans">
              Stories & Updates
            </span>
            <h1 className="font-display text-display-xl md:text-display-hero font-medium mt-3 mb-6">
              News & Updates
            </h1>
            <p className="text-parchment-100/70 max-w-xl mx-auto text-sm">
              Stay informed about our latest projects, community impact, and innovative solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-parchment-50 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="w-full md:w-72">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border bg-white text-sm text-ink-800 placeholder:text-ink-400 outline-none focus:border-laterite-500 transition-colors focus-visible:ring-2 focus-visible:ring-laterite-500/30"
                />
              </div>
            </form>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 text-xs font-mono border transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500 focus-visible:outline-offset-2 ${
                    selectedCategory === category
                      ? 'border-laterite-500 text-laterite-600 bg-laterite-50'
                      : 'border-border text-ink-500 hover:border-laterite-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-xs font-mono text-ink-500">
            Showing <span className="font-semibold text-ink-800">{news.length}</span> articles
            {selectedCategory !== 'All' && (
              <>
                {' '}
                in <span className="font-semibold text-ink-800">{selectedCategory}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Articles display – asymmetric featured card + 2-column grid */}
      <section className="py-16 md:py-24 bg-parchment-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-16 text-ink-500 font-mono text-sm">Loading articles…</div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-status-danger font-mono text-sm">{error}</p>
              <button
                onClick={() => fetchNews()}
                className="mt-4 text-laterite-500 underline text-xs"
              >
                Try again
              </button>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16">
              {/* Empty state with icon and acacia scatter pattern behind it */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"15\" cy=\"20\" r=\"2\" fill=\"%234F7942\"/%3E%3Cellipse cx=\"45\" cy=\"45\" rx=\"4\" ry=\"2\" fill=\"%234F7942\"/%3E%3C/svg%3E')" }} />
                <NewspaperIcon className="h-12 w-12 text-ink-300 relative z-10" />
              </div>
              <p className="text-ink-500 font-mono text-sm">No articles found.</p>
            </div>
          ) : (
            <>
              {/* Featured article – full width card */}
              {featuredArticle && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-10"
                >
                  <div className="bg-white border border-border hover:border-laterite-500/40 transition-colors overflow-hidden group">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {/* Image or texture placeholder */}
                      <div className="aspect-video md:aspect-auto bg-soil-900/5 relative">
                        {featuredArticle.image ? (
                          <img
                            src={featuredArticle.image}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl font-mono text-ink-300/30">
                            📰
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col justify-center space-y-3">
                        <div className="flex items-center gap-2 text-xs text-ink-500 font-mono">
                          <CalendarDaysIcon className="h-3.5 w-3.5" />
                          {new Date(featuredArticle.createdAt || featuredArticle.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                          {featuredArticle.category && (
                            <span className="bg-laterite-50 text-laterite-700 text-[10px] font-semibold uppercase px-2 py-0.5 border border-laterite-200 ml-2">
                              {featuredArticle.category}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-2xl md:text-3xl font-medium text-ink-800 group-hover:text-laterite-600 transition-colors">
                          {featuredArticle.title}
                        </h3>
                        <p className="text-ink-500 text-sm line-clamp-3">
                          {featuredArticle.excerpt || featuredArticle.description || ''}
                        </p>
                        <a
                          href={`/news/${featuredArticle._id}`}
                          className="inline-flex items-center gap-1 text-xs font-mono text-laterite-500 mt-2"
                        >
                          Read more <ArrowRightIcon className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Remaining articles in a 2-column grid */}
              {remainingArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {remainingArticles.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <NewsCard news={item} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-border text-xs font-mono text-ink-800 hover:border-laterite-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 border text-xs font-mono transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500 ${
                        currentPage === page
                          ? 'bg-soil-900 text-parchment-50 border-soil-900'
                          : 'border-border text-ink-800 hover:border-laterite-500'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-border text-xs font-mono text-ink-800 hover:border-laterite-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA – full-bleed dark with signal line */}
      <section className="relative bg-soil-950 text-parchment-50 py-16 md:py-20 text-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-signal" />
        <div className="container mx-auto px-4 relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400 font-sans">
            Stay Connected
          </span>
          <h2 className="font-display text-display-md md:text-display-lg font-medium mt-2 mb-4">
            Never miss an update
          </h2>
          <p className="text-parchment-100/70 max-w-lg mx-auto text-sm mb-8">
            Follow our journey as we continue to transform communities through innovation and collaboration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-laterite-500 hover:bg-laterite-600 text-white px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laterite-400"
            >
              Get in Touch <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 border border-parchment-100/30 hover:border-laterite-500 text-parchment-50 px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parchment-50"
            >
              View Gallery
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default News;