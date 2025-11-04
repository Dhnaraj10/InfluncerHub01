//frontend/src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../useAuth';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900 py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient mb-6">
              Connect with the Perfect Influencers
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              The intelligent platform that matches brands with authentic influencers for
              partnerships that drive real engagement and results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-3 hover-glow">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary text-lg px-8 py-3 hover-glow">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn-outline text-lg px-8 py-3">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Why Choose <span className="text-gradient">InfluencerHub</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                We're transforming how brands and influencers collaborate
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card p-6 hover-lift">
                <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">Smart Matching</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI-powered algorithm matches brands with the most relevant influencers based on audience demographics, engagement rates, and content style.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card p-6 hover-lift">
                <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">Streamlined Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage contracts, briefs, content approvals, and payments all in one place. Our platform simplifies the entire collaboration process.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card p-6 hover-lift">
                <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">Performance Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track campaign performance with detailed analytics on engagement, reach, conversion, and ROI to optimize your influencer marketing strategy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="bg-gradient-to-r from-primary to-secondary py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Ready to Transform Your Influencer Marketing?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Join thousands of brands and influencers already growing with InfluencerHub.
              </p>
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-lg font-medium rounded-lg text-white bg-transparent hover:bg-white hover:text-secondary transition-all duration-200 hover-glow">
                Start Free Trial
              </Link>
            </div>
          </section>
        )}
      </main>
      
      
    </div>
  );
};

export default Home;
