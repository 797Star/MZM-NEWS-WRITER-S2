
export enum InputMode {
  FILE = 'FILE',
  URL = 'URL',
  KEYWORDS = 'KEYWORDS',
  TRANSLATE_DEVELOP = 'TRANSLATE_DEVELOP',
}

export enum ScriptLength {
  STANDARD = 'STANDARD',
  ONE_MINUTE = 'ONE_MINUTE',
  FIVE_MINUTES = 'FIVE_MINUTES',
}

export enum ScriptTone {
  FORMAL = 'FORMAL',
  FRIENDLY = 'FRIENDLY',
  URGENT = 'URGENT',
  INVESTIGATIVE = 'INVESTIGATIVE',
}

export enum ScriptType {
  WEB_POST = 'WEB_POST',
  VIDEO_POST = 'VIDEO_POST',
}

export interface WebSource {
  uri: string;
  title: string;
  content: string;
}

export interface GroundingChunk {
  web?: WebSource;
  // Potentially other types of sources in the future
}

export interface GeneratedScriptResponse {
  script: string;
  sources?: GroundingChunk[];
  intermediateTranslation?: string;
}

// Define a more specific type for candidate structure if needed for groundingMetadata
export interface Candidate {
  groundingMetadata?: {
    groundingChunks?: GroundingChunk[];
  };
  // other candidate properties
}
