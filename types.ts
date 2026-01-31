
export enum DiagnosticMode {
  LEAF = 'LEAF',
  CHICKEN = 'CHICKEN'
}

export interface AnalysisResult {
  diseaseName: string;
  confidence: string;
  symptoms: string[];
  treatment: string;
  prevention: string;
  isHealthy: boolean;
  groundingLinks?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  mode: DiagnosticMode;
  image: string;
  result: AnalysisResult;
}
