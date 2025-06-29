import React from 'react';
import { CheckCircle, Circle, AlertTriangle, MessageSquare, Shield, Heart, Lightbulb } from 'lucide-react';
import { AnalysisStep } from '../types';

interface StepIndicatorProps {
  steps: AnalysisStep[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  const getStepIcon = (step: AnalysisStep) => {
    const iconProps = { size: 24 };
    
    switch (step.id) {
      case 1: return <Shield {...iconProps} />;
      case 2: return <AlertTriangle {...iconProps} />;
      case 3: return <Heart {...iconProps} />;
      case 4: return <Lightbulb {...iconProps} />;
      default: return <MessageSquare {...iconProps} />;
    }
  };

  const getStatusIcon = (status: AnalysisStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'processing': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'skipped': return <Circle size={16} className="text-gray-400" />;
      default: return <Circle size={16} className="text-gray-300" />;
    }
  };

  const getStatusColor = (status: AnalysisStep['status']) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50 text-green-700';
      case 'processing': return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'skipped': return 'border-gray-300 bg-gray-50 text-gray-500';
      default: return 'border-gray-200 bg-white text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Pipeline</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
              {step.status === 'processing' ? (
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                getStepIcon(step)
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-800">{step.title}</h4>
                {getStatusIcon(step.status)}
              </div>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200 ml-6" style={{ marginTop: '1rem' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;