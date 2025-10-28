//frontend/src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-md"></div>
    </div>
  );
};

export default LoadingSpinner;
