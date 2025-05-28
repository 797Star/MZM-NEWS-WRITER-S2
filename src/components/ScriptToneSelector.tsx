import React from 'react';
import { ScriptTone } from '../types';
import { UI_STRINGS_MY } from '../constants';

interface ScriptToneSelectorProps {
  selectedTone: ScriptTone;
  onToneChange: (tone: ScriptTone) => void;
}

const ScriptToneSelector: React.FC<ScriptToneSelectorProps> = ({ selectedTone, onToneChange }) => {
  const toneOptions = [
    { value: ScriptTone.FORMAL, label: UI_STRINGS_MY.TONE_FORMAL },
    { value: ScriptTone.CONVERSATIONAL, label: UI_STRINGS_MY.TONE_CONVERSATIONAL },
    { value: ScriptTone.SIMPLIFIED, label: UI_STRINGS_MY.TONE_SIMPLIFIED },
  ];

  return (
    <div className="pt-6 border-t border-neutral-300 mt-8 bg-white rounded shadow-sm newspaper-block">
      <label
        className="block text-base font-bold text-neutral-800 mb-3 newspaper-label"
        style={{ fontFamily: "Lora, Georgia, 'Times New Roman', Times, serif" }}
      >
        {UI_STRINGS_MY.SCRIPT_TONE_LABEL}
      </label>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:space-x-8 space-y-2 sm:space-y-0 newspaper-radio-group">
        {toneOptions.map((option) => (
          <label
            key={option.value}
            className="inline-flex items-center cursor-pointer py-2 px-3 rounded newspaper-radio-label hover:bg-neutral-100 transition"
            style={{ fontFamily: "Lora, Georgia, 'Times New Roman', Times, serif", border: '1px solid #e5e7eb', background: '#faf9f6' }}
          >
            <input
              type="radio"
              className="form-radio h-5 w-5 text-neutral-700 border-neutral-400 focus:ring-neutral-600 newspaper-radio"
              name="scriptTone"
              value={option.value}
              checked={selectedTone === option.value}
              onChange={() => onToneChange(option.value)}
              style={{ accentColor: '#222', marginRight: '0.5em' }}
            />
            <span className="ml-2 text-base text-neutral-800 font-serif" style={{ fontFamily: "Lora, Georgia, 'Times New Roman', Times, serif" }}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ScriptToneSelector);