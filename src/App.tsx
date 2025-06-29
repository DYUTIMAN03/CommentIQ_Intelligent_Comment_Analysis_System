import React, { useState } from 'react';
import { Brain, MessageSquare, Play, RotateCcw, Upload } from 'lucide-react';
import { useCommentAnalyzer } from './hooks/useCommentAnalyzer';
import { sampleComments } from './data/sampleComments';
import StepIndicator from './components/StepIndicator';
import CommentCard from './components/CommentCard';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'analytics'>('analyzer');
  const [inputText, setInputText] = useState('');
  const { 
    comments, 
    steps, 
    isProcessing, 
    analyzeComments, 
    getAnalytics, 
    resetAnalysis 
  } = useCommentAnalyzer();

  const handleAnalyzeSample = async () => {
    await analyzeComments(sampleComments);
  };

  const handleAnalyzeCustom = async () => {
    if (!inputText.trim()) return;
    
    const customComments = inputText.split('\n').filter(line => line.trim()).map((text, index) => ({
      id: `custom-${index}`,
      text: text.trim(),
      author: `User${index + 1}`,
      timestamp: 'Just now',
      platform: 'youtube' as const
    }));
    
    await analyzeComments(customComments);
  };

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CommentIQ</h1>
                <p className="text-xs text-gray-600">Intelligent Comment Analysis System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('analyzer')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'analyzer' 
                      ? 'bg-purple-100 text-purple-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Analyzer
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'analytics' 
                      ? 'bg-purple-100 text-purple-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Analytics
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analyzer' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                AI-Powered Comment Analysis
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Automatically detect toxic content, filter spam, analyze sentiment, and categorize feedback 
                to help content creators engage meaningfully with their audience.
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <MessageSquare size={20} />
                <span>Comment Input</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                    Paste comments (one per line) or try our sample data:
                  </label>
                  <textarea
                    id="comments"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter comments here, one per line..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    disabled={isProcessing}
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleAnalyzeCustom}
                    disabled={isProcessing || !inputText.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload size={16} />
                    <span>Analyze Custom</span>
                  </button>
                  
                  <button
                    onClick={handleAnalyzeSample}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Play size={16} />
                    <span>Try Sample Data</span>
                  </button>
                  
                  <button
                    onClick={resetAnalysis}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Processing Steps */}
            {(isProcessing || comments.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <StepIndicator steps={steps} />
                </div>
                
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Processed Comments ({comments.length})
                      </h3>
                      {isProcessing && (
                        <div className="flex items-center space-x-2 text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-medium">Processing...</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                          <p>No comments processed yet. Upload some comments to get started!</p>
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <CommentCard key={comment.id} comment={comment} />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <AnalyticsDashboard analytics={analytics} />
        )}
      </main>
    </div>
  );
}

export default App;