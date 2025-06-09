import React, { useState } from 'react';
import { ContentAnalysisResult, SEOTitleSuggestion, TopicSuggestion } from '../types'; // Assuming types.ts is in ../types
import { analyzeAndSuggestContent } from '../services/geminiService'; // Assuming geminiService.ts is in ../services
import LoadingSpinner from './LoadingSpinner'; // Assuming a LoadingSpinner component exists
import ErrorMessage from './ErrorMessage';   // Assuming an ErrorMessage component exists

const ContentOptimizerScreen: React.FC = () => {
  const [newsContent, setNewsContent] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ContentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeContent = async () => {
    if (!newsContent.trim()) {
      setError("BM_ERROR_NoContentToAnalyze"); // Changed to placeholder
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results
    try {
      const result = await analyzeAndSuggestContent(newsContent);
      setAnalysisResult(result);
    } catch (e: any) {
      console.error("Error during content analysis:", e);
      setError(e.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestionsList = (
    suggestions: SEOTitleSuggestion[] | TopicSuggestion[],
    type: 'title' | 'question'
  ) => {
    if (!suggestions || suggestions.length === 0) {
      return <p className="text-neutral-500">BM_MESSAGE_NoSuggestions</p>; // Changed to placeholder
    }
    return (
      <ul className="list-disc pl-5 space-y-1 text-neutral-700">
        {suggestions.map((item) => (
          <li key={item.id}>
            {type === 'title' ? (item as SEOTitleSuggestion).title : (item as TopicSuggestion).question}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark text-center mb-6 sm:mb-8">
        Analyze Content
      </h1>

      {/* Input Card */}
      <div className="bg-white p-6 sm:p-8 shadow-xl rounded-xl border border-neutral-200">
        <label htmlFor="newsContent" className="block text-sm font-medium text-neutral-700 mb-2">
          Copy/Paste your generated content
        </label>
        <textarea
          id="newsContent"
          value={newsContent}
          onChange={(e) => setNewsContent(e.target.value)}
          placeholder="Paste Content"
          rows={10}
          className="w-full p-3 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 resize-y"
          disabled={isLoading}
        />
        <button
          onClick={handleAnalyzeContent}
          disabled={isLoading || !newsContent.trim()}
          className="mt-6 w-full py-3 px-5 bg-gradient-deep-blue hover:opacity-90 text-white font-semibold rounded-md shadow-md hover:shadow-lg disabled:bg-neutral-400 disabled:opacity-70 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 text-sm sm:text-base" /* Changed to gradient, adjusted hover */
        >
          {isLoading ? 'Analyzing' : 'Analyze Content'}
        </button>
      </div>

      {isLoading && <LoadingSpinner message="Loading Analysis" />}
      {error && <ErrorMessage message={error} />} {/* ErrorMessage component should use text-red-500 for consistency */}

      {analysisResult && !isLoading && (
        <div className="space-y-6 sm:space-y-8">
          {/* Content Metrics Card */}
          <div className="bg-white p-6 sm:p-8 shadow-xl rounded-xl border border-neutral-200">
            <h3 className="text-lg sm:text-xl font-semibold text-primary-dark mb-4">Content Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-sm sm:text-base text-neutral-700">
                <strong>WordCount:</strong> {analysisResult.wordCount}
              </p>
              <p className="text-sm sm:text-base text-neutral-700">
                <strong>Sentiment:</strong> <span className={`font-medium ${
                  analysisResult.sentiment === 'Positive' ? 'text-success' :
                  analysisResult.sentiment === 'Negative' ? 'text-red-500' : // Consistent with other error texts
                  analysisResult.sentiment === 'Neutral' ? 'text-accent-dark' : // Using accent for neutral for variety
                  'text-neutral-600'
                }`}>
                  {analysisResult.sentiment}
                </span>
              </p>
            </div>
             {analysisResult.keywords && analysisResult.keywords.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm sm:text-md font-semibold text-neutral-700 mb-2">Identified Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysisResult.keywords.map((keyword, index) => (
                            <span key={index} className="bg-accent-light text-accent-dark px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {/* SEO Title Suggestions Card */}
          <div className="bg-white p-6 sm:p-8 shadow-xl rounded-xl border border-neutral-200">
            <h3 className="text-lg sm:text-xl font-semibold text-primary-dark mb-4"> SEO Suggestions</h3>
            {renderSuggestionsList(analysisResult.seoTitleSuggestions, 'title')}
          </div>

          {/* Follow-up Topic Suggestions Card */}
          <div className="bg-white p-6 sm:p-8 shadow-xl rounded-xl border border-neutral-200">
            <h3 className="text-lg sm:text-xl font-semibold text-primary-dark mb-4">Follow Up Topics</h3>
            {renderSuggestionsList(analysisResult.followupTopicSuggestions, 'question')}
          </div>

          {/* Related Topic Suggestions Card */}
          <div className="bg-white p-6 sm:p-8 shadow-xl rounded-xl border border-neutral-200">
            <h3 className="text-lg sm:text-xl font-semibold text-primary-dark mb-4">Related Topics</h3>
            {renderSuggestionsList(analysisResult.relatedTopicSuggestions, 'question')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentOptimizerScreen;
