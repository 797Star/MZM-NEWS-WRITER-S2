import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';
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
import LoginScreen from './components/LoginScreen';
import UserProfile from './components/UserProfile';
import {
  generateScriptFromFileContent,
  generateScriptFromUrl,
  generateScriptFromKeywords,
  performTranslationAndScriptGeneration,
  proofreadScriptWithAI,
} from './services/geminiService';
import { getApiKey, isApiKeyValid } from './services/envConfig';
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'; // Removed useNavigate
import UpdatePasswordScreen from './components/UpdatePasswordScreen';
import ContentOptimizerScreen from './components/ContentOptimizerScreen';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
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

  const [proofreadScript, setProofreadScript] = useState<string | null>(null);
  const [isProofreading, setIsProofreading] = useState<boolean>(false);
  const [proofreadingError, setProofreadingError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoadingAuth(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingAuth(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

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
    setProofreadScript(null);
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

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner message="Authenticating..." />
      </div>
    );
  }

  const ProtectedLayout = () => (
    <div className="min-h-screen flex flex-col bg-neutral-100"> {/* Changed to flex-col and global bg */}
      <header className="bg-gradient-deep-blue shadow-lg"> {/* Changed to gradient */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-white text-xl sm:text-2xl font-bold hover:opacity-90 transition-opacity">
                AppName
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-neutral-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  GenerateScript
                </Link>
                <Link
                  to="/content-optimizer"
                  className="text-neutral-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  OptimizeContent
                </Link>
                {/* Placeholder for Proofread & Edit - adjust link as needed */}
                <Link
                  to="/" // Assuming it links to a relevant page or main page for now
                  className="text-neutral-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ProofreadEdit
                </Link>
              </div>
            </div>
            {/* Mobile menu button - basic structure, no functionality yet */}
            <div className="-mr-2 flex md:hidden">
              <button type="button" className="bg-primary-dark inline-flex items-center justify-center p-2 rounded-md text-neutral-300 hover:text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-white">
                <span className="sr-only">Open main menu</span>
                {/* Icon for menu (Heroicon - menu) */}
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Content below header */}
      <div className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8"> {/* Original padding for content area */}
        {session && session.user && <UserProfile user={session.user} />}
        <DisclaimerMessage />
        <Outlet />
      </div>

       <footer className="bg-neutral-800 text-neutral-300 p-4 text-center text-xs">
        <p>Copyright &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );

  const MainAppContent = () => (
    // MainAppContent's own background and max-width are still relevant for the content it holds
    <main className="max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl border border-neutral-200">
      {error === UI_STRINGS_MY.ERROR_API_KEY_MISSING && !isLoading && (
         <ErrorMessage message={UI_STRINGS_MY.ERROR_API_KEY_MISSING} />
      )}
      {apiKeyExists && (
        <>
          <InputSelector selectedMode={selectedInputMode} onSelectMode={handleInputModeChange} />
          <div className="my-6 p-5 bg-stone-100 rounded-lg border border-neutral-200 space-y-6"> {/* Updated inner container, bg-stone-100 */}
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
              className="w-full sm:w-auto bg-gradient-deep-blue hover:opacity-90 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-md shadow-md hover:shadow-lg disabled:bg-neutral-400 disabled:opacity-70 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 text-base" /* Updated to gradient */
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
            <div className="mt-8 p-6 bg-stone-100 rounded-lg border border-neutral-200"> {/* Updated container style */}
              <h2 className="text-2xl font-bold text-neutral-800 mb-4 pb-2 border-b border-neutral-300">{UI_STRINGS_MY.INTERMEDIATE_TRANSLATION_HEADING}</h2> {/* Removed font-serif */}
              <div className="text-base text-neutral-700 whitespace-pre-wrap"> {/* Removed font-newspaper-body */}
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
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-md shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-base"
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
              <div className="mt-6 md:mt-8 p-4 md:p-6 bg-stone-100 rounded-lg border border-neutral-200 text-center text-neutral-500" aria-label="Information message"> {/* Adjusted padding & margin */}
                  {UI_STRINGS_MY.NO_SCRIPT_YET}
              </div>
          )}
          {isProofreading && <LoadingSpinner message={UI_STRINGS_MY.MESSAGE_PROOFREADING_LOADING} />}
          {proofreadingError && <ErrorMessage message={proofreadingError} />}
          {proofreadScript && !isProofreading && (
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-purple-50 rounded-lg border border-purple-200"> {/* Adjusted padding & margin */}
              <h2 className="text-xl md:text-2xl font-bold text-purple-800 mb-3 md:mb-4 pb-2 border-b border-purple-300">{UI_STRINGS_MY.SECTION_TITLE_EDITED_SCRIPT}</h2> {/* Adjusted text size & margin */}
              <div className="text-sm md:text-base text-neutral-700 whitespace-pre-wrap edited-script-display"> {/* Adjusted text size */}
                {proofreadScript}
              </div>
              <div className="mt-4 md:mt-6 text-center"> {/* Adjusted margin */}
                <button
                  onClick={handleDownloadEditedScript}
                  disabled={!proofreadScript}
                  className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 sm:px-5 rounded-md shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-xs sm:text-sm" /* Adjusted padding & text size */
                  aria-label={UI_STRINGS_MY.BUTTON_DOWNLOAD_EDITED_SCRIPT}
                >
                  {UI_STRINGS_MY.BUTTON_DOWNLOAD_EDITED_SCRIPT}
                </button>
              </div>
            </div>
          )}
          {generatedScript && !proofreadScript && !isProofreading && (
            <div className="mt-6 md:mt-8 text-center"> {/* Adjusted margin */}
              <button
                  onClick={downloadScript}
                  className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-4 sm:px-5 rounded-md shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-xs sm:text-sm" /* Adjusted padding & text size */
                  aria-label={UI_STRINGS_MY.DOWNLOAD_SCRIPT_BUTTON}
              >
                  {UI_STRINGS_MY.DOWNLOAD_SCRIPT_BUTTON}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );

  return (
    <Routes>
      <Route path="/login" element={!session ? <LoginScreen /> : <Navigate to="/" replace />} />
      <Route path="/update-password" element={<UpdatePasswordScreen />} />
      <Route
        path="/"
        element={
          session ? (
            <ProtectedLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<MainAppContent />} />
        <Route path="content-optimizer" element={<ContentOptimizerScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;