import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

export const ExtractionTimeline: React.FC = () => {
  const { timeline, isProcessing, error } = useSelector((state: RootState) => state.aiExtraction);

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">AI Processing Status</h3>
      
      <div className="space-y-4">
        {timeline.map((stage, idx) => {
          const isPending = stage.status === 'Pending';
          const isRunning = stage.status === 'Running';
          const isCompleted = stage.status === 'Completed';
          const isFailed = stage.status === 'Failed';
          
          const isLast = idx === timeline.length - 1;

          return (
            <div key={stage.id} className="relative flex items-start group">
              {!isLast && (
                <div 
                  className={`absolute left-2.5 top-6 w-0.5 h-full -ml-px ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`} 
                />
              )}
              
              <div className="relative z-10 flex items-center justify-center w-5 h-5 mt-0.5 mr-3 bg-white">
                {isCompleted && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                {isRunning && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                {isFailed && <XCircle className="w-5 h-5 text-red-500" />}
                {isPending && <Circle className="w-5 h-5 text-gray-300" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  isCompleted ? 'text-gray-900' : 
                  isRunning ? 'text-blue-700' : 
                  isFailed ? 'text-red-700' : 'text-gray-400'
                }`}>
                  {stage.label}
                </p>
                {stage.message && (
                  <p className="text-xs text-gray-500 mt-0.5">{stage.message}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};
