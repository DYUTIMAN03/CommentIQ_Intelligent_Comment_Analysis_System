import { useState, useCallback } from 'react';
import { Comment, AnalysisStep, AnalyticsData } from '../types';
import { processComment } from '../utils/commentAnalyzer';

export const useCommentAnalyzer = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const initialSteps: AnalysisStep[] = [
    {
      id: 1,
      title: 'Toxic Comment Detection',
      description: 'Filtering harmful and abusive content',
      icon: 'shield',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Spam Detection',
      description: 'Removing promotional and irrelevant comments',
      icon: 'alert-triangle',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Sentiment Analysis',
      description: 'Analyzing positive, negative, and neutral sentiment',
      icon: 'heart',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Type Classification',
      description: 'Categorizing feedback vs suggestions',
      icon: 'lightbulb',
      status: 'pending'
    }
  ];

  const [steps, setSteps] = useState<AnalysisStep[]>(initialSteps);

  const updateStepStatus = useCallback((stepId: number, status: AnalysisStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }, []);

  const analyzeComments = useCallback(async (inputComments: Omit<Comment, 'isProcessed' | 'analysis'>[]) => {
    setIsProcessing(true);
    setCurrentStep(1);
    
    // Reset steps
    setSteps(initialSteps);
    
    const processedComments: Comment[] = [];
    
    for (let i = 0; i < inputComments.length; i++) {
      const comment = inputComments[i];
      
      // Update current processing step
      setCurrentStep(1);
      updateStepStatus(1, 'processing');
      
      const processed = await processComment(comment);
      processedComments.push(processed);
      
      // Update step statuses based on analysis results
      updateStepStatus(1, 'completed');
      
      if (!processed.analysis?.isToxic) {
        updateStepStatus(2, processed.analysis?.isSpam ? 'completed' : 'processing');
        if (!processed.analysis?.isSpam) {
          updateStepStatus(2, 'completed');
          updateStepStatus(3, 'processing');
          updateStepStatus(3, 'completed');
          updateStepStatus(4, 'processing');
          updateStepStatus(4, 'completed');
        } else {
          updateStepStatus(3, 'skipped');
          updateStepStatus(4, 'skipped');
        }
      } else {
        updateStepStatus(2, 'skipped');
        updateStepStatus(3, 'skipped');
        updateStepStatus(4, 'skipped');
      }
      
      // Update comments in real-time
      setComments([...processedComments]);
    }
    
    setIsProcessing(false);
    setCurrentStep(0);
  }, [updateStepStatus]);

  const getAnalytics = useCallback((): AnalyticsData => {
    const totalComments = comments.length;
    const toxicComments = comments.filter(c => c.analysis?.isToxic).length;
    const spamComments = comments.filter(c => c.analysis?.isSpam).length;
    const validComments = comments.filter(c => !c.analysis?.isToxic && !c.analysis?.isSpam).length;
    
    const validCommentsWithAnalysis = comments.filter(c => !c.analysis?.isToxic && !c.analysis?.isSpam && c.analysis);
    
    const sentimentBreakdown = {
      positive: validCommentsWithAnalysis.filter(c => c.analysis?.sentiment === 'positive').length,
      negative: validCommentsWithAnalysis.filter(c => c.analysis?.sentiment === 'negative').length,
      neutral: validCommentsWithAnalysis.filter(c => c.analysis?.sentiment === 'neutral').length,
    };
    
    const typeBreakdown = {
      feedback: validCommentsWithAnalysis.filter(c => c.analysis?.type === 'feedback').length,
      suggestions: validCommentsWithAnalysis.filter(c => c.analysis?.type === 'suggestion').length,
    };
    
    return {
      totalComments,
      toxicComments,
      spamComments,
      validComments,
      sentimentBreakdown,
      typeBreakdown
    };
  }, [comments]);

  const resetAnalysis = useCallback(() => {
    setComments([]);
    setSteps(initialSteps);
    setIsProcessing(false);
    setCurrentStep(0);
  }, []);

  return {
    comments,
    steps,
    isProcessing,
    currentStep,
    analyzeComments,
    getAnalytics,
    resetAnalysis
  };
};