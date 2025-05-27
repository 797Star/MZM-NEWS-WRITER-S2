import React from 'react';
import { InputMode } from '../types';
import { UI_STRINGS_MY } from '../constants';

interface InputSelectorProps {
  selectedMode: InputMode;
  onSelectMode: (mode: InputMode) => void;
}

const InputSelector: React.FC<InputSelectorProps> = ({ selectedMode, onSelectMode }) => {
  const modes = [
    { mode: InputMode.FILE, label: UI_STRINGS_MY.FILE_UPLOAD_TAB },
    { mode: InputMode.URL, label: UI_STRINGS_MY.URL_INPUT_TAB },
    { mode: InputMode.KEYWORDS, label: UI_STRINGS_MY.KEYWORD_SEARCH_TAB },
    { mode: InputMode.TRANSLATE_DEVELOP, label: UI_STRINGS_MY.TRANSLATE_DEVELOP_TAB },
  ];

  return (
    <div className="mb-6 flex flex-wrap justify-center sm:justify-start border-b-2 border-neutral-400 pb-0">
      {modes.map(({ mode, label }) => (
        <button
          key={mode}
          onClick={() => onSelectMode(mode)}
          className={`px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base font-semibold font-serif transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-500 rounded-none -mb-px
            ${
              selectedMode === mode
                ? 'border-t-4 border-x border-neutral-600 text-neutral-800 bg-white relative' // Active tab feels "on top"
                : 'border-x border-b border-transparent text-neutral-600 hover:bg-stone-100 hover:text-neutral-800'
            }
          `}
          style={selectedMode === mode ? {borderTopColor: '#4A5568'} : {} /* Darker neutral for active top border */}
          aria-pressed={selectedMode === mode}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default InputSelector;