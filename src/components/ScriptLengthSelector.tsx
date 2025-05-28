import React from 'react';
import { ScriptLength } from '../types';
import { UI_STRINGS_MY } from '../constants';

interface ScriptLengthSelectorProps {
  selectedLength: ScriptLength;
  onLengthChange: (length: ScriptLength) => void;
}

const ScriptLengthSelector: React.FC<ScriptLengthSelectorProps> = ({ selectedLength, onLengthChange }) => {
  const lengthOptions = [
    { value: ScriptLength.SHORT, label: UI_STRINGS_MY.LENGTH_SHORT },
    { value: ScriptLength.STANDARD, label: UI_STRINGS_MY.LENGTH_STANDARD },
    { value: ScriptLength.DETAILED, label: UI_STRINGS_MY.LENGTH_DETAILED },
  ];

  return (
    <div className="pt-5 border-t border-neutral-300 mt-5">
      <label className="block text-sm font-semibold text-neutral-700 mb-2 font-serif">
        {UI_STRINGS_MY.SCRIPT_LENGTH_LABEL}
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
        {lengthOptions.map((option) => (
          <label key={option.value} className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-neutral-600 border-neutral-400 focus:ring-neutral-500"
              name="scriptLength"
              value={option.value}
              checked={selectedLength === option.value}
              onChange={() => onLengthChange(option.value)}
            />
            <span className="ml-2 text-sm text-neutral-700 font-serif">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ScriptLengthSelector;