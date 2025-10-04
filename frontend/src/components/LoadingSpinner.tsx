import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-500 mb-4"></div>
      <p className="text-gray-600 text-lg">{message}</p>
      <div className="mt-4 text-sm text-gray-500 text-center max-w-md">
        <p>Our AI is crafting SEO-optimized content with trending hashtags for you...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
