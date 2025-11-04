import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About InfluencerHub</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connecting brands with the perfect influencers for authentic partnerships that drive real results.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            At InfluencerHub, we believe in the power of authentic storytelling. Our mission is to bridge the gap between brands and influencers, creating meaningful partnerships that resonate with audiences and drive measurable results.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We're dedicated to fostering a community where creativity thrives, brands find their perfect voice, and influencers can focus on what they do best - creating engaging content that inspires and informs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">For Brands</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Discover the perfect influencers to represent your brand and connect with your target audience in an authentic way.
            </p>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Access to a curated network of influencers</li>
              <li>Streamlined campaign management</li>
              <li>Performance analytics and insights</li>
              <li>Transparent pricing and contracts</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">For Influencers</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Focus on creating great content while we handle the business side of brand partnerships.
            </p>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Access to premium brand opportunities</li>
              <li>Automated contract and payment processing</li>
              <li>Growth analytics and performance insights</li>
              <li>Support for content creation and strategy</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Join Our Community</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Whether you're a brand looking to expand your reach or an influencer seeking meaningful partnerships, 
            InfluencerHub is your gateway to successful collaborations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started as Brand
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-3 bg-white/10 text-white border border-white/20 font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              Get Started as Influencer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;