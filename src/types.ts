export enum InputMode {
  FILE = 'file',
  URL = 'url',
  KEYWORDS = 'keywords',
  TRANSLATE_DEVELOP = 'translate_develop'
}

export enum ScriptLength {
  SHORT = 'short',
  STANDARD = 'standard',
  DETAILED = 'detailed',
  FEATURE = "FEATURE",
  ANALYTICAL = "ANALYTICAL"
}

export enum ScriptTone {
  FORMAL = 'formal',
  CONVERSATIONAL = 'conversational',
  SIMPLIFIED = 'simplified'
}

export enum ScriptType {
  WEB_POST = 'web_post',
  NEWS_SCRIPT = 'news_script',
  SOCIAL_MEDIA = 'social_media'
}

export interface GroundingChunk {
  content?: string;
  web?: {
    url?: string;
    title?: string;
  };
}

export interface GeneratedScriptResponse {
  script: string;
  intermediateTranslation?: string;
  sources?: GroundingChunk[];
}
