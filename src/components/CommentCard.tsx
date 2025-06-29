import React from 'react';
import { Youtube, Instagram, Facebook, Shield, AlertTriangle, Heart, Smile, Frown, Meh, MessageSquare, Lightbulb } from 'lucide-react';
import { Comment } from '../types';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const getPlatformIcon = (platform: Comment['platform']) => {
    const iconProps = { size: 16 };
    switch (platform) {
      case 'youtube': return <Youtube {...iconProps} className="text-red-500" />;
      case 'instagram': return <Instagram {...iconProps} className="text-pink-500" />;
      case 'facebook': return <Facebook {...iconProps} className="text-blue-600" />;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    const iconProps = { size: 16 };
    switch (sentiment) {
      case 'positive': return <Smile {...iconProps} className="text-green-500" />;
      case 'negative': return <Frown {...iconProps} className="text-red-500" />;
      default: return <Meh {...iconProps} className="text-gray-500" />;
    }
  };

  const getAnalysisStatus = () => {
    if (!comment.analysis) return { color: 'gray', label: 'Pending' };
    
    if (comment.analysis.isToxic) {
      return { color: 'red', label: 'Toxic', icon: <Shield size={14} /> };
    }
    
    if (comment.analysis.isSpam) {
      return { color: 'orange', label: 'Spam', icon: <AlertTriangle size={14} /> };
    }
    
    return { color: 'green', label: 'Valid', icon: <Heart size={14} /> };
  };

  const status = getAnalysisStatus();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-800">{comment.author}</span>
          {getPlatformIcon(comment.platform)}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{comment.timestamp}</span>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-700`}>
            {status.icon}
            <span>{status.label}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-3 leading-relaxed">{comment.text}</p>
      
      {comment.analysis && !comment.analysis.isToxic && !comment.analysis.isSpam && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {getSentimentIcon(comment.analysis.sentiment)}
              <span className="text-xs font-medium text-gray-600 capitalize">
                {comment.analysis.sentiment}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {comment.analysis.type === 'suggestion' ? 
                <Lightbulb size={16} className="text-purple-500" /> : 
                <MessageSquare size={16} className="text-blue-500" />
              }
              <span className="text-xs font-medium text-gray-600 capitalize">
                {comment.analysis.type}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {Math.round(comment.analysis.confidence * 100)}% confidence
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentCard;