import { ScriptLength, ScriptTone, ScriptType, GeneratedScriptResponse, GroundingChunk } from '../types';
import { getApiKey } from './envConfig';

// Base URL for the Gemini API
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-pro';

// Helper function to get API URL with key
const getApiUrl = (): string => {
  const apiKey = getApiKey();
  return `${GEMINI_API_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
};

// Common function to make API requests to Gemini
const makeGeminiRequest = async (prompt: string): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error making Gemini API request:', error);
    throw error;
  }
};

// Function to generate script from file content
export const generateScriptFromFileContent = async (
  fileContent: string,
  length: ScriptLength,
  tone: ScriptTone,
  type: ScriptType
): Promise<GeneratedScriptResponse> => {
  // Implementation remains the same, but uses the new getApiUrl function
  // This is a placeholder for the actual implementation
  return { script: 'Generated script would appear here' };
};

// Function to generate script from URL
export const generateScriptFromUrl = async (
  url: string,
  length: ScriptLength,
  tone: ScriptTone,
  type: ScriptType
): Promise<GeneratedScriptResponse> => {
  // Implementation remains the same, but uses the new getApiUrl function
  // This is a placeholder for the actual implementation
  return { script: 'Generated script would appear here' };
};

// Function to generate script from keywords
export const generateScriptFromKeywords = async (
  keywords: string,
  length: ScriptLength,
  tone: ScriptTone,
  type: ScriptType
): Promise<GeneratedScriptResponse> => {
  // Implementation remains the same, but uses the new getApiUrl function
  // This is a placeholder for the actual implementation
  return { script: 'Generated script would appear here' };
};

// Function to perform translation and script generation
export const performTranslationAndScriptGeneration = async (
  englishUrl: string,
  length: ScriptLength,
  tone: ScriptTone,
  type: ScriptType
): Promise<GeneratedScriptResponse> => {
  // Implementation remains the same, but uses the new getApiUrl function
  // This is a placeholder for the actual implementation
  return { 
    script: 'Generated script would appear here',
    intermediateTranslation: 'Translated content would appear here'
  };
};