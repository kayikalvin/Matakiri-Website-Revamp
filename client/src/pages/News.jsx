import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  MagnifyingGlassIcon,
  NewspaperIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { newsAPI } from '../services/api';
import NewsCard from '../components/shared/NewsCard'; // make sure this is redesigned too (see note)

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

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, [currentPage, selectedCategory]);

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
      // The API likely returns { data: [...], pagination: {...} }
      setNews(response?.data || []);
      setTotalPages(response?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch news.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>News & Updates - Matakiri Tumaini Centre</title>
        <meta
          name="description"
          content="Stay updated with the latest news, stories, and developments from Matakiri Tumaini Centre."
        />
      </Helmet>

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
              Stories & Updates
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-medium mt-3 mb-6">
              News & Updates
            </h1>
            <p className="text-parchment-100/70 max-w-xl mx-auto text-sm mb-10">
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
                  className="w-full pl-10 pr-4 py-2.5 border border-border bg-white text-sm text-ink-800 placeholder:text-ink-400 outline-none focus:border-laterite-500 transition-colors"
                />
              </div>
            </form>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 text-xs font-mono border transition-colors ${
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

      {/* News Grid */}
      <section className="py-16 md:py-20 bg-parchment-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-16 text-ink-500 font-mono text-sm">
              Loading articles…
            </div>
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
              <NewspaperIcon className="h-12 w-12 text-ink-300 mx-auto mb-4" />
              <p className="text-ink-500 font-mono text-sm">No articles found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {news.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <NewsCard news={item} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-border text-xs font-mono text-ink-800 hover:border-laterite-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 border text-xs font-mono transition-colors ${
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
                    className="px-3 py-1.5 border border-border text-xs font-mono text-ink-800 hover:border-laterite-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-soil-900 text-parchment-50 text-center">
        <div className="container mx-auto px-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400">
            Stay Connected
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-2 mb-4">
            Never miss an update
          </h2>
          <p className="text-parchment-100/70 max-w-lg mx-auto text-sm mb-8">
            Follow our journey as we continue to transform communities through innovation and collaboration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-laterite-500 hover:bg-laterite-600 text-white px-6 py-3 text-sm font-medium transition-colors"
            >
              Get in Touch <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 border border-parchment-100/30 hover:border-laterite-500 text-parchment-50 px-6 py-3 text-sm font-medium transition-colors"
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