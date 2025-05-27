import React from 'react';
import { ScriptTone } from '../types';
import { UI_STRINGS_MY } from '../constants';

interface ScriptToneSelectorProps {
  selectedTone: ScriptTone;
  onToneChange: (tone: ScriptTone) => void;
}

const ScriptToneSelector: React.FC<ScriptToneSelectorProps> = ({ selectedTone, onToneChange }) => {
  const toneOptions = [
    { value: ScriptTone.FORMAL, label: UI_STRINGS_MY.SCRIPT_TONE_FORMAL },
    { value: ScriptTone.FRIENDLY, label: UI_STRINGS_MY.SCRIPT_TONE_FRIENDLY },
    { value: ScriptTone.URGENT, label: UI_STRINGS_MY.SCRIPT_TONE_URGENT },
    { value: ScriptTone.INVESTIGATIVE, label: UI_STRINGS_MY.SCRIPT_TONE_INVESTIGATIVE },
  ];

  return (
    <div className="pt-5 border-t border-neutral-300 mt-5">
      <label className="block text-sm font-semibold text-neutral-700 mb-2 font-serif">
        {UI_STRINGS_MY.SCRIPT_TONE_LABEL}
      </label>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
        {toneOptions.map((option) => (
          <label key={option.value} className="inline-flex items-center cursor-pointer py-1">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-neutral-600 border-neutral-400 focus:ring-neutral-500"
              name="scriptTone"
              value={option.value}
              checked={selectedTone === option.value}
              onChange={() => onToneChange(option.value)}
            />
            <span className="ml-2 text-sm text-neutral-700 font-serif">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ScriptToneSelector);