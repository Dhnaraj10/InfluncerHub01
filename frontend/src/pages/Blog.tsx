import React from 'react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Influencer Marketing in 2025",
      excerpt: "Explore the latest trends and predictions for the influencer marketing industry in the coming year.",
      date: "May 15, 2025",
      author: "Sarah Johnson",
      category: "Industry Trends",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "How to Build Authentic Brand-Influencer Partnerships",
      excerpt: "Learn the key strategies for creating genuine collaborations that resonate with audiences.",
      date: "April 28, 2025",
      author: "Michael Chen",
      category: "Partnerships",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Measuring ROI in Influencer Campaigns",
      excerpt: "Discover the metrics that matter and how to track the success of your influencer partnerships.",
      date: "April 12, 2025",
      author: "Emma Rodriguez",
      category: "Analytics",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "The Rise of Micro-Influencers",
      excerpt: "Why smaller creators are making a bigger impact in the marketing landscape.",
      date: "March 30, 2025",
      author: "David Kim",
      category: "Creator Economy",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "Building a Strong Personal Brand as an Influencer",
      excerpt: "Essential tips for influencers looking to establish their unique voice and identity.",
      date: "March 18, 2025",
      author: "Jessica Williams",
      category: "Personal Branding",
      readTime: "6 min read"
    },
    {
      id: 6,
      title: "Ethical Considerations in Influencer Marketing",
      excerpt: "Navigating disclosure requirements and maintaining transparency with your audience.",
      date: "March 5, 2025",
      author: "Robert Thompson",
      category: "Best Practices",
      readTime: "9 min read"
    }
  ];

  const categories = [
    "Industry Trends",
    "Partnerships",
    "Analytics",
    "Creator Economy",
    "Personal Branding",
    "Best Practices"
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">InfluencerHub Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Insights, trends, and strategies for brands and influencers in the digital marketing world.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
                      </div>
                      <Link 
                        to={`/blog/${post.id}`} 
                        className="text-primary hover:text-primary-dark font-medium flex items-center"
                      >
                        Read more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded-md bg-primary text-white">1</button>
                <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">2</button>
                <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">3</button>
                <span className="px-2">...</span>
                <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">10</button>
                <button className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link 
                      to="#" 
                      className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors flex justify-between"
                    >
                      <span>{category}</span>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full">
                        {Math.floor(Math.random() * 10) + 1}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Popular Posts</h3>
              <ul className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <li key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <Link to={`/blog/${post.id}`} className="block hover:text-primary dark:hover:text-primary-light transition-colors">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;