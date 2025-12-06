import React from 'react';
import { Link } from 'react-router-dom';

const LatestNews = () => {
  const news = [
    {
      id: 1,
      title: 'New AI Partnership Announced',
      excerpt: 'We are excited to announce our partnership with leading AI research institutions.',
      date: '2024-01-15',
      image: '/images/news1.jpg'
    },
    {
      id: 2,
      title: 'Community Impact Report Released',
      excerpt: 'Our latest report shows significant improvements in community health outcomes.',
      date: '2024-01-10',
      image: '/images/news2.jpg'
    },
    {
      id: 3,
      title: 'Educational Program Expansion',
      excerpt: 'Expanding our AI education programs to reach more students across the region.',
      date: '2024-01-05',
      image: '/images/news3.jpg'
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {news.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">News Image</span>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {item.excerpt}
                </p>
                <Link
                  to={`/news/${item.id}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

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
