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
      setError("Please enter some content to analyze.");
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
      return <p className="text-neutral-500">No suggestions available.</p>;
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 text-center mb-8">
        News Content Optimizer & Suggester
      </h2>

      <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-neutral-200"> {/* Adjusted padding */}
        <textarea
          value={newsContent}
          onChange={(e) => setNewsContent(e.target.value)}
          placeholder="Paste your news article content here..."
          rows={10}
          className="w-full p-3 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          disabled={isLoading}
        />
        <button
          onClick={handleAnalyzeContent}
          disabled={isLoading || !newsContent.trim()}
          className="mt-4 w-full py-2 px-4 sm:py-3 sm:px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-400 text-white font-semibold rounded-md shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base" /* Adjusted padding & text size */
        >
          {isLoading ? 'Analyzing...' : 'Analyze Content'}
        </button>
      </div>

      {isLoading && <LoadingSpinner message="Analyzing content, please wait..." />}
      {error && <ErrorMessage message={error} />}

      {analysisResult && !isLoading && (
        <div className="space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
          {/* Word Count & Sentiment */}
          <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-neutral-200"> {/* Adjusted padding */}
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-700 mb-3 sm:mb-4">Content Metrics</h3> {/* Adjusted text size & margin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"> {/* Adjusted gap */}
              <p className="text-sm sm:text-base text-neutral-600"> {/* Adjusted text size */}
                <strong>Word Count:</strong> {analysisResult.wordCount}
              </p>
              <p className="text-sm sm:text-base text-neutral-600"> {/* Adjusted text size */}
                <strong>Sentiment:</strong> <span className={`font-medium ${
                  analysisResult.sentiment === 'Positive' ? 'text-green-500' : // Adjusted shade
                  analysisResult.sentiment === 'Negative' ? 'text-red-500' :   // Adjusted shade
                  analysisResult.sentiment === 'Neutral' ? 'text-sky-500' :
                  'text-neutral-500'
                }`}>
                  {analysisResult.sentiment}
                </span>
              </p>
            </div>
             {analysisResult.keywords && analysisResult.keywords.length > 0 && (
                <div className="mt-3 sm:mt-4"> {/* Adjusted margin */}
                    <h4 className="text-sm sm:text-md font-semibold text-neutral-600 mb-1.5 sm:mb-2">Identified Keywords:</h4> {/* Adjusted text size & margin */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2"> {/* Adjusted gap */}
                        {analysisResult.keywords.map((keyword, index) => (
                            <span key={index} className="bg-sky-100 text-sky-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm shadow-sm"> {/* Corrected padding & text size */}
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {/* SEO Title Suggestions */}
          <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-neutral-200"> {/* Adjusted padding */}
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-700 mb-3 sm:mb-4">SEO Title Suggestions</h3> {/* Adjusted text size & margin */}
            {renderSuggestionsList(analysisResult.seoTitleSuggestions, 'title')} {/* Assuming renderSuggestionsList uses responsive text internally or defaults are fine */}
          </div>

          {/* Follow-up Topic Suggestions */}
          <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-neutral-200"> {/* Adjusted padding */}
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-700 mb-3 sm:mb-4">Follow-up Topic Questions</h3> {/* Adjusted text size & margin */}
            {renderSuggestionsList(analysisResult.followupTopicSuggestions, 'question')}
          </div>

          {/* Related Topic Suggestions */}
          <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-neutral-200"> {/* Adjusted padding */}
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-700 mb-3 sm:mb-4">Related Topic Questions</h3> {/* Adjusted text size & margin */}
            {renderSuggestionsList(analysisResult.relatedTopicSuggestions, 'question')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentOptimizerScreen;
