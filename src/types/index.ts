export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  platform: 'youtube' | 'instagram' | 'facebook';
  isProcessed: boolean;
  analysis: {
    isToxic: boolean;
    isSpam: boolean;
    sentiment: 'positive' | 'negative' | 'neutral';
    type: 'feedback' | 'suggestion';
    confidence: number;
  } | null;
}

export interface AnalysisStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'processing' | 'completed' | 'skipped';
}

export interface AnalyticsData {
  totalComments: number;
  toxicComments: number;
  spamComments: number;
  validComments: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  typeBreakdown: {
    feedback: number;
    suggestions: number;
  };
}