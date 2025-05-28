import React from 'react';
import { ScriptType } from '../types';
import { UI_STRINGS_MY } from '../constants';

interface ScriptTypeSelectorProps {
  selectedType: ScriptType;
  onTypeChange: (type: ScriptType) => void;
}

const ScriptTypeSelector: React.FC<ScriptTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  const typeOptions = [
    { value: ScriptType.WEB_POST, label: UI_STRINGS_MY.TYPE_WEB_POST },
    { value: ScriptType.NEWS_SCRIPT, label: UI_STRINGS_MY.TYPE_NEWS_SCRIPT },
    { value: ScriptType.SOCIAL_MEDIA, label: UI_STRINGS_MY.TYPE_SOCIAL_MEDIA },
  ];

  return (
    <div className="pt-5 border-t border-neutral-300 mt-5">
      <label className="block text-sm font-semibold text-neutral-700 mb-2 font-serif">
        {UI_STRINGS_MY.SCRIPT_TYPE_LABEL}
      </label>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
        {typeOptions.map((option) => (
          <label key={option.value} className="inline-flex items-center cursor-pointer py-1">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-neutral-600 border-neutral-400 focus:ring-neutral-500"
              name="scriptType"
              value={option.value}
              checked={selectedType === option.value}
              onChange={() => onTypeChange(option.value)}
            />
            <span className="ml-2 text-sm text-neutral-700 font-serif">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ScriptTypeSelector);