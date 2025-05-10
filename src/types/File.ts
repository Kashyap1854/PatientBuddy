export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  date: string;
  category: string;
  tags: string[];
  content?: string;
  aiAnalysis?: {
    summary: string;
    keyPoints: string[];
    recommendations: string[];
  };
} 