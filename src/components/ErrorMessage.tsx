import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 my-4 rounded-sm shadow-sm\" role="alert">
      <p className="font-bold font-serif text-red-900">အမှားအယွင်း</p>
      <p className="font-serif text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;