// frontend/src/pages/ForBrands.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const ForBrands: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-white dark:from-gray-900 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            For Brands
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the power of authentic influencer marketing and connect with creators who align with your brand values.
          </p>
        </div>

        {/* Main Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card p-6 hover-lift">
            <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">Access Top Talent</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with a curated network of high-quality influencers across all niches and follower sizes.
            </p>
          </div>

          <div className="card p-6 hover-lift">
            <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">Performance Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track campaign performance with detailed analytics on engagement, reach, conversion, and ROI.
            </p>
          </div>

          <div className="card p-6 hover-lift">
            <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">Streamlined Management</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage contracts, briefs, content approvals, and payments all in one place with our platform.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-display font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-display text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">Create Profile</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set up your brand profile with your requirements and campaign goals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-display text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">Find Influencers</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Search our database or let our AI match you with perfect creators.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-display text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">Launch Campaigns</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send offers and collaborate directly through our platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-display text-2xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">Track Results</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor performance and measure your campaign success.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of brands already growing with InfluencerHub.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-lg font-medium rounded-lg text-white bg-transparent hover:bg-white hover:text-secondary transition-all duration-200 hover-glow"
            >
              Get Started
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-lg font-medium rounded-lg text-secondary bg-white hover:bg-secondary hover:text-white transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForBrands;