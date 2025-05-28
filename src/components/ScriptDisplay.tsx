import React from 'react';
import { GroundingChunk } from '../types';
import { UI_STRINGS_MY } from '../constants';

interface ScriptDisplayProps {
  script: string | null;
  sources?: GroundingChunk[] | null;
}

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script, sources }) => {
  if (!script) {
    return (
      <div className="mt-8 p-6 bg-stone-50 rounded-none border border-neutral-200 text-center text-neutral-500 font-serif">
        {UI_STRINGS_MY.NO_SCRIPT_YET}
      </div>
    );
  }

  // Split script by the custom separator for media name and keywords
  const scriptParts = script.split(/\n\n---\n/);
  const mainScriptContent = scriptParts[0];
  const additionalInfo = scriptParts.length > 1 ? scriptParts[1] : null;

  return (
    <div className="mt-10 pt-6 border-t-2 border-neutral-400">
      <h2 className="font-serif text-3xl font-bold text-neutral-800 mb-3 pb-2 border-b border-neutral-300">
        {UI_STRINGS_MY.GENERATED_SCRIPT_HEADING}
      </h2>
      <div className="font-newspaper-body text-base text-neutral-700 whitespace-pre-wrap p-4 bg-stone-50 border border-neutral-200 rounded-sm">
        {mainScriptContent}
      </div>

      {additionalInfo && (
        <div className="mt-4 p-3 bg-stone-100 border border-neutral-200 rounded-sm text-sm text-neutral-600 font-serif whitespace-pre-wrap">
          {additionalInfo.split('\n').map((line, index) => (
            <p key={index} className="mb-0.5">{line}</p>
          ))}
        </div>
      )}

      {sources && sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <h3 className="font-serif text-xl font-semibold text-neutral-700 mb-2">{UI_STRINGS_MY.SOURCES_HEADING}</h3>
          <ul className="list-disc list-inside space-y-1 font-serif text-sm">
            {sources.map((source, index) =>
              source.web && source.web.url ? (
                <li key={index} className="text-neutral-600">
                  <a
                    href={source.web.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 hover:text-sky-800 hover:underline"
                    title={source.web.title || source.web.url}
                  >
                    {source.web.title || source.web.url}
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScriptDisplay;
