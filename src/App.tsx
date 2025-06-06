import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./services/firebaseConfig";
import LoginScreen from "./components/LoginScreen";
import React, { useState, useEffect, useCallback } from 'react';
import { InputMode, GeneratedScriptResponse, GroundingChunk, ScriptLength, ScriptTone, ScriptType } from './types';
import { UI_STRINGS_MY } from './constants';
import InputSelector from './components/InputSelector';
import FileInput from './components/FileInput';
import UrlInput from './components/UrlInput';
import KeywordInput from './components/KeywordInput';
import ScriptDisplay from './components/ScriptDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ScriptLengthSelector from './components/ScriptLengthSelector';
import ScriptToneSelector from './components/ScriptToneSelector';
import ScriptTypeSelector from './components/ScriptTypeSelector';
import DisclaimerMessage from './components/DisclaimerMessage';
import {
  generateScriptFromFileContent,
  generateScriptFromUrl,
  generateScriptFromKeywords,
  performTranslationAndScriptGeneration,
  proofreadScriptWithAI,
} from './services/geminiService';
import { getApiKey, isApiKeyValid } from './services/envConfig';

const App: React.FC = () => {
  const [apiKeyExists, setApiKeyExists] = useState<boolean>(false);
  const [selectedInputMode, setSelectedInputMode] = useState<InputMode>(InputMode.FILE);
  const [selectedScriptLength, setSelectedScriptLength] = useState<ScriptLength>(ScriptLength.STANDARD);
  const [selectedScriptTone, setSelectedScriptTone] = useState<ScriptTone>(ScriptTone.FORMAL);
  const [selectedScriptType, setSelectedScriptType] = useState<ScriptType>(ScriptType.WEB_POST);
  
  const [fileContent, setFileContent] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [englishUrlInput, setEnglishUrlInput] = useState<string>('');
  const [keywordsInput, setKeywordsInput] = useState<string>('');
  
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [intermediateTranslation, setIntermediateTranslation] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingChunk[] | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for proofreading
  const [proofreadScript, setProofreadScript] = useState<string | null>(null);
  const [isProofreading, setIsProofreading] = useState<boolean>(false);
  const [proofreadingError, setProofreadingError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = getApiKey();
      if (isApiKeyValid(apiKey)) {
        setApiKeyExists(true);
        setError(null); 
      } else {
        setApiKeyExists(false);
        setError(UI_STRINGS_MY.ERROR_API_KEY_MISSING);
      }
    };
    checkApiKey();
  }, []);

  const resetOutputs = useCallback(() => {
    setGeneratedScript(null);
    setIntermediateTranslation(null);
    setGroundingSources(null);
    setError(null);
    // Reset proofreading states
    setProofreadScript(null);
    setIsProofreading(false);
    setProofreadingError(null);
  }, []);

  const handleInputModeChange = useCallback((mode: InputMode) => {
    setSelectedInputMode(mode);
    resetOutputs();
    setFileContent(''); 
    setUrlInput('');
    setEnglishUrlInput('');
    setKeywordsInput('');
  }, [resetOutputs]);

  const handleScriptLengthChange = useCallback((length: ScriptLength) => {
    setSelectedScriptLength(length);
    if (generatedScript) resetOutputs();
  }, [generatedScript, resetOutputs]);

  const handleScriptToneChange = useCallback((tone: ScriptTone) => {
    setSelectedScriptTone(tone);
     if (generatedScript) resetOutputs();
  }, [generatedScript, resetOutputs]);

  const handleScriptTypeChange = useCallback((type: ScriptType) => {
    setSelectedScriptType(type);
     if (generatedScript) resetOutputs();
  }, [generatedScript, resetOutputs]);

  const handleFileProcessed = useCallback((content: string) => {
    setFileContent(content);
    if (content) setError(null); 
    else if (!content && fileContent) resetOutputs(); 
  }, [fileContent, resetOutputs]); 
  
  const handleUrlChange = useCallback((value: string) => {
    setUrlInput(value);
    if (value) setError(null);
    else if (!value && urlInput) resetOutputs();
  }, [urlInput, resetOutputs]);

  const handleEnglishUrlChange = useCallback((value: string) => {
    setEnglishUrlInput(value);
    if (value) setError(null);
    else if (!value && englishUrlInput) resetOutputs();
  }, [englishUrlInput, resetOutputs]);

  const handleKeywordsChange = useCallback((value: string) => {
    setKeywordsInput(value);
    if (value) setError(null);
    else if (!value && keywordsInput) resetOutputs();
  }, [keywordsInput, resetOutputs]);

  const handleFileError = useCallback((message: string) => {
    setError(message);
    setFileContent(''); 
    resetOutputs(); 
  }, [resetOutputs]);


  const validateInputs = (): boolean => {
    let currentError: string | null = null;
    const checkUrl = (inputUrl: string) : boolean => {
        if (!inputUrl.trim()){ return false;}
         try {
            new URL(inputUrl); 
            if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
                currentError = "URL သည် 'http://' သို့မဟုတ် 'https://' ဖြင့် စတင်ရပါမည်။";
                return false;
            }
          } catch (_) {
            currentError = "ထည့်သွင်းထားသော URL သည် မှန်ကန်မှုမရှိပါ။";
            return false;
          }
        return true;
    }

    switch (selectedInputMode) {
      case InputMode.FILE:
        if (!fileContent.trim()) currentError = UI_STRINGS_MY.ERROR_NO_INPUT + " (ဖိုင် အကြောင်းအရာ မရှိပါ သို့မဟုတ် ဖတ်မရပါ)";
        break;
      case InputMode.URL:
        if (!urlInput.trim()) currentError = UI_STRINGS_MY.ERROR_NO_INPUT + " (URL)";
        else if (!checkUrl(urlInput)) { /* error set in checkUrl */ }
        break;
      case InputMode.TRANSLATE_DEVELOP:
        if (!englishUrlInput.trim()) currentError = UI_STRINGS_MY.ERROR_NO_INPUT + " (အင်္ဂလိပ် URL)";
        else if (!checkUrl(englishUrlInput)) { /* error set in checkUrl */ }
        break;
      case InputMode.KEYWORDS:
        if (!keywordsInput.trim()) currentError = UI_STRINGS_MY.ERROR_NO_INPUT + " (သော့ချက်စာလုံး)";
        break;
      default:
        currentError = "မမှန်ကန်သော ထည့်သွင်းမှုအမျိုးအစား။"; 
    }
    
    if (currentError) {
        setError(currentError);
        return false;
    }
    setError(null); 
    return true;
  };

  const handleGenerateScript = async () => {
    if (!apiKeyExists) {
      setError(UI_STRINGS_MY.ERROR_API_KEY_MISSING);
      return;
    }
    resetOutputs();
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    
    try {
      let response: GeneratedScriptResponse | null = null;
      switch (selectedInputMode) {
        case InputMode.FILE:
          if (fileContent) response = await generateScriptFromFileContent(fileContent, selectedScriptLength, selectedScriptTone, selectedScriptType);
          break;
        case InputMode.URL:
          if (urlInput) response = await generateScriptFromUrl(urlInput, selectedScriptLength, selectedScriptTone, selectedScriptType);
          break;
        case InputMode.KEYWORDS:
          if (keywordsInput) response = await generateScriptFromKeywords(keywordsInput, selectedScriptLength, selectedScriptTone, selectedScriptType);
          break;
        case InputMode.TRANSLATE_DEVELOP:
          if (englishUrlInput) response = await performTranslationAndScriptGeneration(englishUrlInput, selectedScriptLength, selectedScriptTone, selectedScriptType);
          break;
      }

      if (response) {
        if (response.script) setGeneratedScript(response.script);
        else setError(UI_STRINGS_MY.ERROR_GENERATING_SCRIPT + " (API returned an empty script)");
        
        if (response.intermediateTranslation) setIntermediateTranslation(response.intermediateTranslation);
        if (response.sources) setGroundingSources(response.sources);
        if (response.script) setError(null);
      } else if (selectedInputMode !== InputMode.TRANSLATE_DEVELOP) {
         setError(UI_STRINGS_MY.ERROR_GENERATING_SCRIPT + " (No response from generation service)");
      }
    } catch (e: any) {
      console.error("Generation error:", e);
      setError(e.message || UI_STRINGS_MY.ERROR_GENERATING_SCRIPT);
      setGeneratedScript(null);
      if (e.intermediateTranslation) {
        setIntermediateTranslation(e.intermediateTranslation);
      } else {
        setIntermediateTranslation(null);
      }
      setGroundingSources(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isGenerateDisabled = (): boolean => {
    if (isLoading) return true; 
    switch (selectedInputMode) {
      case InputMode.FILE: return !fileContent.trim();
      case InputMode.URL: return !urlInput.trim();
      case InputMode.KEYWORDS: return !keywordsInput.trim();
      case InputMode.TRANSLATE_DEVELOP: return !englishUrlInput.trim();
      default: return true;
    }
  };

  const downloadScript = () => {
    if (!generatedScript) return;
    const blob = new Blob([generatedScript], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `myanmar_news_script_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleProofreadScript = async () => {
    if (!generatedScript) return;

    setIsProofreading(true);
    setProofreadingError(null);
    setProofreadScript(null); // Clear previous results

    try {
      const result = await proofreadScriptWithAI(generatedScript);
      setProofreadScript(result);
    } catch (e: any) {
      console.error("Proofreading error:", e);
      setProofreadingError(UI_STRINGS_MY.ERROR_PROOFREADING + (e.message ? `: ${e.message}` : ''));
    } finally {
      setIsProofreading(false);
    }
  };

  const handleDownloadEditedScript = () => {
    if (!proofreadScript) return;
    const blob = new Blob([proofreadScript], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `edited_script_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
  const renderInputs = () => {
    switch(selectedInputMode) {
        case InputMode.FILE:
            return <FileInput onFileProcessed={handleFileProcessed} onError={handleFileError} />;
        case InputMode.URL:
            return <UrlInput value={urlInput} onChange={handleUrlChange} />;
        case InputMode.KEYWORDS:
            return <KeywordInput value={keywordsInput} onChange={handleKeywordsChange} />;
        case InputMode.TRANSLATE_DEVELOP:
            return <UrlInput value={englishUrlInput} onChange={handleEnglishUrlChange} placeholder={UI_STRINGS_MY.URL_PLACEHOLDER} label={UI_STRINGS_MY.ENTER_ENGLISH_URL_PROMPT}/>;
        default:
            return null;
    }
  };

  const getButtonText = () => {
    if (isLoading) {
        return selectedInputMode === InputMode.TRANSLATE_DEVELOP 
            ? UI_STRINGS_MY.TRANSLATING_AND_GENERATING_BUTTON 
            : UI_STRINGS_MY.GENERATING_SCRIPT_BUTTON;
    }
    return UI_STRINGS_MY.GENERATE_SCRIPT_BUTTON;
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10 sm:mb-16">
        <h1 className="font-newspaper-title text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-800 border-b-4 border-neutral-700 pb-3 sm:pb-4">
          {UI_STRINGS_MY.APP_TITLE}
        </h1>
      </header>
      
      <DisclaimerMessage />

      <main className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-none shadow-lg border border-neutral-300">
        {error === UI_STRINGS_MY.ERROR_API_KEY_MISSING && !isLoading && (
           <ErrorMessage message={UI_STRINGS_MY.ERROR_API_KEY_MISSING} />
        )}

        {apiKeyExists && (
          <>
            <InputSelector selectedMode={selectedInputMode} onSelectMode={handleInputModeChange} />
            
            <div className="my-6 p-5 bg-stone-50 rounded-none border border-neutral-200 space-y-6">
              {renderInputs()}
              
              <ScriptLengthSelector 
                selectedLength={selectedScriptLength}
                onLengthChange={handleScriptLengthChange}
              />
              <ScriptToneSelector
                selectedTone={selectedScriptTone}
                onToneChange={handleScriptToneChange}
              />
              <ScriptTypeSelector
                selectedType={selectedScriptType}
                onTypeChange={handleScriptTypeChange}
              />
            </div>
            
            {error && error !== UI_STRINGS_MY.ERROR_API_KEY_MISSING && <ErrorMessage message={error} />}

            <div className="mt-8 text-center">
              <button
                onClick={handleGenerateScript}
                disabled={isGenerateDisabled()}
                className="w-full sm:w-auto bg-neutral-700 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-semibold py-3 px-10 rounded-sm shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 text-base"
                aria-live="polite"
                aria-label={getButtonText()}
              >
                {getButtonText()}
              </button>
            </div>
          </>
        )}
        
        {isLoading && <LoadingSpinner />}
        
        {!isLoading && apiKeyExists && (
          <>
            {intermediateTranslation && selectedInputMode === InputMode.TRANSLATE_DEVELOP && (
              <div className="mt-8 p-6 bg-stone-50 rounded-none border border-neutral-200">
                <h2 className="font-serif text-2xl font-bold text-neutral-800 mb-4 pb-2 border-b border-neutral-300">{UI_STRINGS_MY.INTERMEDIATE_TRANSLATION_HEADING}</h2>
                <div className="font-newspaper-body text-base text-neutral-700 whitespace-pre-wrap">
                  {intermediateTranslation}
                </div>
              </div>
            )}
            {generatedScript ? (
              <>
                <ScriptDisplay script={generatedScript} sources={groundingSources || undefined} />
                {!isLoading && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleProofreadScript}
                      disabled={isProofreading || !generatedScript}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 px-8 rounded-sm shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-base"
                      aria-label={UI_STRINGS_MY.BUTTON_PROOFREAD_AI}
                    >
                      {UI_STRINGS_MY.BUTTON_PROOFREAD_AI}
                    </button>
                  </div>
                )}
              </>
            ) : (
                !isLoading && !error && 
                (selectedInputMode !== InputMode.FILE || fileContent) &&
                !(selectedInputMode === InputMode.TRANSLATE_DEVELOP && intermediateTranslation) &&
                <div className="mt-8 p-6 bg-stone-50 rounded-none border border-neutral-200 text-center text-neutral-500 font-serif" aria-label="Information message">
                    {UI_STRINGS_MY.NO_SCRIPT_YET}
                </div>
            )}

            {isProofreading && <LoadingSpinner message={UI_STRINGS_MY.MESSAGE_PROOFREADING_LOADING} />}
            {proofreadingError && <ErrorMessage message={proofreadingError} />}

            {proofreadScript && !isProofreading && (
              <div className="mt-8 p-6 bg-purple-50 rounded-none border border-purple-200">
                <h2 className="font-serif text-2xl font-bold text-purple-800 mb-4 pb-2 border-b border-purple-300">{UI_STRINGS_MY.SECTION_TITLE_EDITED_SCRIPT}</h2>
                {/* Remember to define .edited-script-display in index.css: e.g., background-color: #f3e8ff; border-left: 4px solid #800080; padding: 10px; */}
                <div className="font-newspaper-body text-base text-neutral-700 whitespace-pre-wrap edited-script-display">
                  {proofreadScript}
                </div>
                <div className="mt-6 text-center">
                  <button
                    onClick={handleDownloadEditedScript}
                    disabled={!proofreadScript}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-sm shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm"
                    aria-label={UI_STRINGS_MY.BUTTON_DOWNLOAD_EDITED_SCRIPT}
                  >
                    {UI_STRINGS_MY.BUTTON_DOWNLOAD_EDITED_SCRIPT}
                  </button>
                </div>
              </div>
            )}

            {generatedScript && !proofreadScript && !isProofreading && ( // Show original download button only if not yet proofread or currently proofreading
              <div className="mt-8 text-center">
                <button
                    onClick={downloadScript}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-6 rounded-sm shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-sm"
                    aria-label={UI_STRINGS_MY.DOWNLOAD_SCRIPT_BUTTON}
                >
                    {UI_STRINGS_MY.DOWNLOAD_SCRIPT_BUTTON}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <footer className="text-center mt-12 py-6 border-t border-neutral-300">
        <p className="text-sm text-neutral-500 font-serif">&copy; {new Date().getFullYear()} MZM News Writer. All rights reserved.</p>
      </footer>
      {/* CSS class definition reminder:
        .edited-script-display {
          background-color: #f3e8ff; // A light purple background
          border-left: 4px solid #800080; // Purple left border
          padding: 10px;
          white-space: pre-wrap; // Preserve formatting
          font-family: 'Myanmar3', 'Padauk', sans-serif; // Ensure consistent font
        }
      */}
    </div>
  );
};

export default App;
