import React, { useEffect, useState } from 'react';
import { UI_STRINGS_MY, DEBOUNCE_DELAY } from '../constants';

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  isError?: boolean;
}

const KeywordInput: React.FC<KeywordInputProps> = React.memo(({ value, onChange, isError }) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [internalValue, onChange, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="keywords-input" className="block text-sm font-medium text-neutral-700 font-serif">
        {UI_STRINGS_MY.ENTER_KEYWORDS_PROMPT}
      </label>
      <input
        type="text"
        id="keywords-input"
        value={internalValue}
        onChange={handleChange}
        placeholder={UI_STRINGS_MY.KEYWORDS_PLACEHOLDER}
        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-sm shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm font-serif ${
          isError ? 'border-red-500 ring-red-500' : 'border-neutral-400'
        }`}
        aria-invalid={isError ? 'true' : 'false'}
      />
    </div>
  );
});

export default KeywordInput;