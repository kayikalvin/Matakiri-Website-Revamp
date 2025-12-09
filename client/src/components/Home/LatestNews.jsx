import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await require('../../services/api').newsAPI.getLatest();
        setNews(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch news.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest News
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest developments and community impact stories.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div className="mt-4 text-gray-500">Loading news...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {news.map((item) => (
              <div key={item?._id || item?.id || item?.slug} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-300 flex items-center justify-center overflow-hidden">
                  {item?.images && item.images.length > 0 && item.images[0]?.url ? (
                    <img src={item.images[0].url} alt={item?.title || 'News'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500">News Image</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {item?.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item?.title || ''}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {typeof item?.excerpt === 'string' ? item.excerpt : ''}
                  </p>
                  <Link
                    to={`/news/${item?.slug || item?._id || item?.id || ''}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/news"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
