// frontend/src/pages/ForInfluencers.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const ForInfluencers: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-white dark:from-gray-900 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            For Influencers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Grow your audience, monetize your content, and collaborate with amazing brands that align with your values.
          </p>
        </div>

        {/* Main Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card p-6 hover-lift">
            <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">Monetize Your Influence</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Earn money doing what you love by partnering with brands that align with your audience.
            </p>
          </div>

          <div className="card p-6 hover-lift">
            <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">Grow Your Audience</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Collaborate with brands to create content that resonates and expands your reach.
            </p>
          </div>

          <div className="card p-6 hover-lift">
            <div className="w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">Safe & Secure</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our platform protects both you and brands with secure contracts and guaranteed payments.
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
                Set up your influencer profile showcasing your audience and content style.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-display text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">Get Discovered</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Brands will find you through our search or AI-powered matching system.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-display text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">Collaborate</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Review offers, negotiate terms, and create amazing content together.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-display text-2xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">Get Paid</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive payments securely through our platform after content approval.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Monetize Your Influence?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of influencers already growing with InfluencerHub.
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
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForInfluencers;