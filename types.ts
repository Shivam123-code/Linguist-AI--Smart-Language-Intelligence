
export interface DetectionResult {
  detectedLanguage: string;
  isoCode: string;
  confidence: number;
  dialect: string | null;
  isReliable: boolean;
  alternatives: { language: string; confidence: number }[];
  summary: string;
}

export interface TranslationResult {
  translatedText: string;
  targetLanguage: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  result: DetectionResult;
  timestamp: number;
}

export interface VisionBlock {
  box_2d: number[]; // [ymin, xmin, ymax, xmax] 0-1000
  text: string;
  translatedText: string;
  language: string;
}

export interface VisionDetectionResult {
  detectedLanguage: string;
  overallConfidence: number;
  blocks: VisionBlock[];
  summary: string;
}
