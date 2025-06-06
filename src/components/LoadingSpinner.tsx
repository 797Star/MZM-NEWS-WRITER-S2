import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center mt-8 mb-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neutral-800"></div>
      {message && <p className="mt-4 text-neutral-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;