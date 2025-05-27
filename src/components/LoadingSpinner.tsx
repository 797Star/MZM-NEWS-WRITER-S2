import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center mt-8 mb-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neutral-800"></div>
    </div>
  );
};

export default LoadingSpinner;