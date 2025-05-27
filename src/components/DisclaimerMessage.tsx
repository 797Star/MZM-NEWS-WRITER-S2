import React from 'react';
import { UI_STRINGS_MY } from '../constants';

const DisclaimerMessage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto my-6 p-4 bg-stone-100 border-l-4 border-stone-500 text-stone-800 rounded-sm shadow" role="region" aria-labelledby="disclaimer-heading">
      <h3 id="disclaimer-heading" className="font-semibold font-serif text-stone-900">{UI_STRINGS_MY.DISCLAIMER_HEADING}</h3>
      <p className="text-sm mt-1 font-serif">{UI_STRINGS_MY.DISCLAIMER_CONTENT}</p>
    </div>
  );
};

export default DisclaimerMessage;