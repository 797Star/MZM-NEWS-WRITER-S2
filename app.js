import React, { useState, useEffect, useCallback } from 'react';
// Remove TypeScript imports
// import { InputMode, GeneratedScriptResponse, GroundingChunk, ScriptLength, ScriptTone, ScriptType } from './types';
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
} from './services/geminiService';
import { getApiKey, isApiKeyValid } from './services/envConfig';

const App = () => {
  const [apiKeyExists, setApiKeyExists] = useState(false);
  const [selectedInputMode, setSelectedInputMode] = useState('FILE');
  const [selectedScriptLength, setSelectedScriptLength] = useState('STANDARD');
  const [selectedScriptTone, setSelectedScriptTone] = useState('FORMAL');
  const [selectedScriptType, setSelectedScriptType] = useState('WEB_POST');
  
  const [fileContent, setFileContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [englishUrlInput, setEnglishUrlInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  
  const [generatedScript, setGeneratedScript] = useState(null);
  const [intermediateTranslation, setIntermediateTranslation] = useState(null);
  const [groundingSources, setGroundingSources] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, []);

  const handleInputModeChange = useCallback((mode) => {
    setSelectedInputMode(mode);
    resetOutputs();
    setFileContent(''); 
    setUrlInput('');
    setEnglishUrlInput('');
    setKeywordsInput('');
  }, [resetOutputs]);

  const handleScriptLengthChange = useCallback((length) => {
    setSelectedScriptLength(length);
    if (generatedScript) resetOutputs();
  }, [generatedScript, resetOutputs]);

  const handleScriptToneChange = useCallback((tone) => {
    setSelectedScriptTone(tone);
     if (generatedScript) resetOutputs();
  }, [generatedScript, resetOutputs]);

  const handleScriptTypeChange = useCallback((type) => {
    setSelectedScriptType(type);
     if (generatedScript) resetOutputs();
  }, [generatedScript, resetOutputs]);

  const handleFileProcessed = useCallback((content) => {
    setFileContent(content);
    if (content) setError(null); 
    else if (!content && fileContent) resetOutputs(); 
  }, [fileContent, resetOutputs]); 
  
  const handleUrlChange = useCallback((value) => {
    setUrlInput(value);
    if (value) setError(null);
    else if (!value && urlInput) resetOutputs();
  }, [urlInput, resetOutputs]);

  const handleEnglishUrlChange = useCallback((value) => {
    setEnglishUrlInput(value);
    if (value) setError(null);
    else if (!value && englishUrlInput) resetOutputs();
  }, [englishUrlInput, resetOutputs]);

  const handleKeywordsChange = useCallback((value) => {
    setKeywordsInput(value);
    if (value) setError(null);
    else if (!value && keywordsInput) resetOutputs();
  }, [keywordsInput, resetOutputs]);

  const handleFileError = useCallback((message) => {
    setError(message);
    setFileContent(''); 
    resetOutputs(); 
  }, [resetOutputs]);


  const validateInputs = () => {
    let currentError = null;
    const checkUrl = (inputUrl) => {
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
      case 'FILE':
        if (!fileContent.trim()) currentError = UI_STRINGS_MY.ERROR_NO_INPUT + " (ဖိုင် အကြောင်းအရာ မရှိပါ သို့မဟုတ် ဖတ်မရပါ)";
        break;
      case 'URL':
        if (!urlInput.trim()) currentError = UI_STRINGS_MY.ERROR_NO_INPUT + " (URL)";
        else if (!checkUrl(urlInput)) { /* error set in checkUrl */ }
        break;
      case 'TRANSLATE_DEVELOP':
        if (!englishUrlInput.trim()) currentError = UI_STRINGS_MY.ERROR_NO_INPUT + " (အင်္ဂလိပ် URL)";
        else if (!checkUrl(englishUrlInput)) { /* error set in checkUrl */ }
        break;
      case 'KEYWORDS':
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
      let response = null;
      switch (selectedInputMode) {
        case 'FILE':
          if (fileContent) response = await generateScriptFromFileContent(fileContent, selectedScriptLength, selectedScriptTone, selectedScriptType);
          break;
        case 'URL':
          if (urlInput) response = await generateScriptFromUrl(urlInput, selectedScriptLength, selectedScriptTone, selectedScriptType);
          break;
        case 'KEYWORDS':
          if (keywordsInput) response = await generateScriptFromKeywords(keywordsInput, selectedScriptLength, selectedScriptTone, selectedScriptType);
          break;
        case 'TRANSLATE_DEVELOP':
          if (englishUrlInput) response = await performTranslationAndScriptGeneration(englishUrlInput, selectedScriptLength, selectedScriptTone, selectedScriptType);
          break;
      }

      if (response) {
        if (response.script) setGeneratedScript(response.script);
        else setError(UI_STRINGS_MY.ERROR_GENERATING_SCRIPT + " (API returned an empty script)");
        
        if (response.intermediateTranslation) setIntermediateTranslation(response.intermediateTranslation);
        if (response.sources) setGroundingSources(response.sources);
        if (response.script) setError(null);
      } else if (selectedInputMode !== 'TRANSLATE_DEVELOP') {
         setError(UI_STRINGS_MY.ERROR_GENERATING_SCRIPT + " (No response from generation service)");
      }
    } catch (e) {
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
  
  const isGenerateButtonDisabled = () => {
    if (!apiKeyExists) return true;
    if (isLoading) return true;
    switch (selectedInputMode) {
      case 'FILE':
        return !fileContent.trim();
      case 'URL':
        return !urlInput.trim();
      case 'TRANSLATE_DEVELOP':
        return !englishUrlInput.trim();
      case 'KEYWORDS':
        return !keywordsInput.trim();
      default:
        return true; 
    }
  }
  return (
    <div className="app-container">
      <h1>{UI_STRINGS_MY.APP_TITLE}</h1>
      {!apiKeyExists && <ErrorMessage message={UI_STRINGS_MY.ERROR_API_KEY_MISSING} />}
      {apiKeyExists && (
        <>
          <InputSelector
            selectedMode={selectedInputMode}
            onChange={handleInputModeChange}
          />
          {selectedInputMode === 'FILE' && (
            <FileInput
              onFileProcessed={handleFileProcessed}
              onError={handleFileError}
            />
          )}
          {selectedInputMode === 'URL' && (
            <UrlInput
              value={urlInput}
              onChange={handleUrlChange}
            />
          )}
          {selectedInputMode === 'TRANSLATE_DEVELOP' && (
            <UrlInput
              value={englishUrlInput}
              onChange={handleEnglishUrlChange}
              placeholder="အင်္ဂလိပ် URL"
            />
          )}
          {selectedInputMode === 'KEYWORDS' && (
            <KeywordInput
              value={keywordsInput}
              onChange={handleKeywordsChange}
            />
          )}
          
          <ScriptLengthSelector
            selectedLength={selectedScriptLength}
            onChange={handleScriptLengthChange}
          />
          
          <ScriptToneSelector
            selectedTone={selectedScriptTone}
            onChange={handleScriptToneChange}
          />
          
          <ScriptTypeSelector
            selectedType={selectedScriptType}
            onChange={handleScriptTypeChange}
          />
          
          <button
            className="generate-button"
            onClick={handleGenerateScript}
            disabled={isGenerateButtonDisabled()}
          >
            {isLoading ? 'Generating...' : UI_STRINGS_MY.BUTTON_GENERATE_SCRIPT}
          </button>
          
          {isLoading && <LoadingSpinner />}
          
          {error && <ErrorMessage message={error} />}
          
          {generatedScript && (
            <ScriptDisplay
              script={generatedScript}
              intermediateTranslation={intermediateTranslation}
              sources={groundingSources}
            />
          )}
          
          <DisclaimerMessage />
        </>
      )}
    </div>
  );
}

export default App;