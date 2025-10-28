// frontend/src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';


const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <svg className="mx-auto h-24 w-24 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-display font-bold text-gradient mb-4">404</h1>
          <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-6">Page Not Found</h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary hover-glow">
              Go to Home
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              className="btn-outline"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
      
      
    </div>
  );
};

export default NotFound;
