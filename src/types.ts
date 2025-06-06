export enum InputMode {
  FILE = 'FILE',
  URL = 'URL',
  KEYWORDS = 'KEYWORDS',
  TRANSLATE_DEVELOP = 'TRANSLATE_DEVELOP'
}

export enum ScriptLength {
  SHORT = 'SHORT',
  STANDARD = 'STANDARD',
  DETAILED = 'DETAILED',
  FEATURE = 'FEATURE',
  ANALYTICAL = 'ANALYTICAL'
}

export enum ScriptTone {
  FORMAL = 'FORMAL',
  CONVERSATIONAL = 'CONVERSATIONAL',
  SIMPLIFIED = 'SIMPLIFIED'
}

export enum ScriptType {
  WEB_POST = 'WEB_POST',
  NEWS_SCRIPT = 'NEWS_SCRIPT',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA'
}

export interface GroundingChunk {
  content?: string;
  url?: string;
  title?: string;
  web?: {
    content: string;
    url?: string;
    title?: string;
  };
}

export interface GeneratedScriptResponse {
  script: string;
  intermediateTranslation?: string;
  sources?: GroundingChunk[];
}

export interface SEOTitleSuggestion {
  id: string; // For React keys, can be generated (e.g., uuid or index-based)
  title: string;
}

export interface TopicSuggestion {
  id: string; // For React keys
  question: string;
}

export type SentimentValue = 'Positive' | 'Negative' | 'Neutral' | 'Unknown';

export interface ContentAnalysisResult {
  wordCount: number;
  sentiment: SentimentValue;
  keywords: string[]; // Array of identified keywords
  seoTitleSuggestions: SEOTitleSuggestion[];
  followupTopicSuggestions: TopicSuggestion[];
  relatedTopicSuggestions: TopicSuggestion[];
}
