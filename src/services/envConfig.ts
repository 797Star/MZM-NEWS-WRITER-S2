/**
 * Environment configuration service
 * Safely retrieves environment variables with fallbacks
 */

// Get API key from environment variables
export const getApiKey = (): string => {
  // Check for Vite environment variables
  const viteApiKey = import.meta.env.VITE_API_KEY;
  
  // Check for window-injected variables (fallback for environments without proper env var support)
  const windowApiKey = (window as any).API_KEY;
  
  // Return the first available API key
  return viteApiKey || windowApiKey || '';
};

// Check if API key exists and is valid
export const isApiKeyValid = (apiKey: string): boolean => {
  return !!apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 10;
};