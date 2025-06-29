import { Comment } from '../types';

// Mock ML analysis functions - in production, these would call actual ML APIs
export const analyzeToxicity = (text: string): { isToxic: boolean; confidence: number } => {
  const toxicKeywords = ['dumb', 'stupid', 'garbage', 'hate', 'terrible', 'awful', 'worst'];
  const lowerText = text.toLowerCase();
  
  const toxicScore = toxicKeywords.reduce((score, keyword) => {
    return lowerText.includes(keyword) ? score + 0.3 : score;
  }, 0);
  
  return {
    isToxic: toxicScore > 0.2,
    confidence: Math.min(0.95, 0.6 + toxicScore)
  };
};

export const analyzeSpam = (text: string): { isSpam: boolean; confidence: number } => {
  const spamKeywords = ['follow me', 'check out my', 'link in bio', 'giveaway', 'free', 'subscribe', 'plz', 'first!'];
  const lowerText = text.toLowerCase();
  
  let spamScore = spamKeywords.reduce((score, keyword) => {
    return lowerText.includes(keyword) ? score + 0.25 : score;
  }, 0);
  
  // Check for excessive emojis or caps
  const emojiCount = (text.match(/[\u{1f300}-\u{1f6ff}]|[\u{2600}-\u{27bf}]/gu) || []).length;
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  
  if (emojiCount > 3) spamScore += 0.2;
  if (capsRatio > 0.5) spamScore += 0.15;
  
  return {
    isSpam: spamScore > 0.3,
    confidence: Math.min(0.95, 0.5 + spamScore)
  };
};

export const analyzeSentiment = (text: string): { sentiment: 'positive' | 'negative' | 'neutral'; confidence: number } => {
  const positiveKeywords = ['love', 'great', 'amazing', 'awesome', 'good', 'nice', 'helped', 'thank', 'appreciate', 'excellent'];
  const negativeKeywords = ['bad', 'poor', 'terrible', 'awful', 'hate', 'worst', 'boring', 'disappointing'];
  
  const lowerText = text.toLowerCase();
  
  const positiveScore = positiveKeywords.reduce((score, keyword) => {
    return lowerText.includes(keyword) ? score + 1 : score;
  }, 0);
  
  const negativeScore = negativeKeywords.reduce((score, keyword) => {
    return lowerText.includes(keyword) ? score + 1 : score;
  }, 0);
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 0.6;
  
  if (positiveScore > negativeScore) {
    sentiment = 'positive';
    confidence = Math.min(0.95, 0.6 + (positiveScore * 0.1));
  } else if (negativeScore > positiveScore) {
    sentiment = 'negative';
    confidence = Math.min(0.95, 0.6 + (negativeScore * 0.1));
  }
  
  return { sentiment, confidence };
};

export const analyzeType = (text: string): { type: 'feedback' | 'suggestion'; confidence: number } => {
  const suggestionKeywords = ['try', 'should', 'could', 'maybe', 'consider', 'suggest', 'recommend', 'next time', 'would be better'];
  const feedbackKeywords = ['great', 'good', 'nice', 'love', 'like', 'keep up', 'amazing', 'awesome'];
  
  const lowerText = text.toLowerCase();
  
  const suggestionScore = suggestionKeywords.reduce((score, keyword) => {
    return lowerText.includes(keyword) ? score + 1 : score;
  }, 0);
  
  const feedbackScore = feedbackKeywords.reduce((score, keyword) => {
    return lowerText.includes(keyword) ? score + 1 : score;
  }, 0);
  
  const type = suggestionScore > feedbackScore ? 'suggestion' : 'feedback';
  const confidence = Math.min(0.95, 0.6 + (Math.max(suggestionScore, feedbackScore) * 0.1));
  
  return { type, confidence };
};

export const processComment = async (comment: Omit<Comment, 'isProcessed' | 'analysis'>): Promise<Comment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const toxicAnalysis = analyzeToxicity(comment.text);
  
  // If toxic, skip other analyses
  if (toxicAnalysis.isToxic) {
    return {
      ...comment,
      isProcessed: true,
      analysis: {
        isToxic: true,
        isSpam: false,
        sentiment: 'neutral',
        type: 'feedback',
        confidence: toxicAnalysis.confidence
      }
    };
  }
  
  const spamAnalysis = analyzeSpam(comment.text);
  
  // If spam, skip sentiment and type analysis
  if (spamAnalysis.isSpam) {
    return {
      ...comment,
      isProcessed: true,
      analysis: {
        isToxic: false,
        isSpam: true,
        sentiment: 'neutral',
        type: 'feedback',
        confidence: spamAnalysis.confidence
      }
    };
  }
  
  // If neither toxic nor spam, analyze sentiment and type
  const sentimentAnalysis = analyzeSentiment(comment.text);
  const typeAnalysis = analyzeType(comment.text);
  
  return {
    ...comment,
    isProcessed: true,
    analysis: {
      isToxic: false,
      isSpam: false,
      sentiment: sentimentAnalysis.sentiment,
      type: typeAnalysis.type,
      confidence: Math.min(sentimentAnalysis.confidence, typeAnalysis.confidence)
    }
  };
};