import React from 'react';
import { BarChart3, TrendingUp, MessageCircle, Shield, AlertTriangle, Heart, Lightbulb } from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  const getEngagementRate = () => {
    if (analytics.totalComments === 0) return 0;
    return Math.round((analytics.validComments / analytics.totalComments) * 100);
  };

  const getPositivityRate = () => {
    const validComments = analytics.sentimentBreakdown.positive + analytics.sentimentBreakdown.negative + analytics.sentimentBreakdown.neutral;
    if (validComments === 0) return 0;
    return Math.round((analytics.sentimentBreakdown.positive / validComments) * 100);
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 size={24} className="text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Comments"
          value={analytics.totalComments}
          subtitle="Comments processed"
          icon={<MessageCircle size={24} className="text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Engagement Rate"
          value={`${getEngagementRate()}%`}
          subtitle="Valid vs total comments"
          icon={<TrendingUp size={24} className="text-green-600" />}
          color="green"
        />
        <StatCard
          title="Toxic Comments"
          value={analytics.toxicComments}
          subtitle="Harmful content filtered"
          icon={<Shield size={24} className="text-red-600" />}
          color="red"
        />
        <StatCard
          title="Spam Filtered"
          value={analytics.spamComments}
          subtitle="Irrelevant content removed"
          icon={<AlertTriangle size={24} className="text-orange-600" />}
          color="orange"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Heart size={20} className="text-pink-600" />
            <span>Sentiment Analysis</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Positive</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{analytics.sentimentBreakdown.positive}</span>
                <span className="text-xs text-gray-500">({getPositivityRate()}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Negative</span>
              </div>
              <span className="text-sm text-gray-600">{analytics.sentimentBreakdown.negative}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Neutral</span>
              </div>
              <span className="text-sm text-gray-600">{analytics.sentimentBreakdown.neutral}</span>
            </div>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Lightbulb size={20} className="text-purple-600" />
            <span>Comment Types</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Feedback</span>
              </div>
              <span className="text-sm text-gray-600">{analytics.typeBreakdown.feedback}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb size={16} className="text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Suggestions</span>
              </div>
              <span className="text-sm text-gray-600">{analytics.typeBreakdown.suggestions}</span>
            </div>
          </div>
          
          {analytics.typeBreakdown.suggestions > 0 && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-700 font-medium">
                💡 You have {analytics.typeBreakdown.suggestions} actionable suggestions from your audience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;