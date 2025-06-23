/**
 * Environment configuration service
 * Safely retrieves environment variables with fallbacks
 */

// Get API key from environment variables
export const getApiKey = (): string => {
  // Vite exposes environment variables prefixed with VITE_ on the import.meta.env object.
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  return geminiApiKey || '';
};

// Get News API key from environment variables
export const getNewsApiKey = (): string => {
  const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
  return newsApiKey || '';
};

// Check if API key exists and is valid
export const isApiKeyValid = (apiKey: string): boolean => {
  return !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;
};