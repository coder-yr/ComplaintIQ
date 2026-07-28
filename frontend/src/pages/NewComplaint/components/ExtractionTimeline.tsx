import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExtractionTimeline: React.FC = () => {
  const { timeline, error } = useSelector((state: RootState) => state.aiExtraction);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mt-4">
      <h3 className="font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3 text-sm uppercase tracking-wider">AI Processing Timeline</h3>
      
      <div className="space-y-4">
        <AnimatePresence>
          {timeline.map((stage, idx) => {
            const isPending = stage.status === 'Pending';
            const isRunning = stage.status === 'Running';
            const isCompleted = stage.status === 'Completed';
            const isFailed = stage.status === 'Failed';
            
            const isLast = idx === timeline.length - 1;

            return (
              <motion.div 
                key={stage.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="relative flex items-start group"
              >
                {!isLast && (
                  <div 
                    className={`absolute left-2.5 top-6 w-0.5 h-[calc(100%+0.5rem)] -ml-px transition-colors duration-300 ${
                      isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                    }`} 
                  />
                )}
                
                <div className="relative z-10 flex items-center justify-center w-5 h-5 mt-0.5 mr-3 bg-white">
                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {isRunning && (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25"></div>
                      <Circle className="w-5 h-5 text-blue-600 fill-blue-600/20" />
                    </div>
                  )}
                  {isFailed && <XCircle className="w-5 h-5 text-red-500" />}
                  {isPending && <Circle className="w-5 h-5 text-gray-300" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold transition-colors duration-200 ${
                    isCompleted ? 'text-gray-900' : 
                    isRunning ? 'text-blue-700' : 
                    isFailed ? 'text-red-700' : 'text-gray-400'
                  }`}>
                    {stage.label}
                  </p>
                  {stage.message && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-gray-500 mt-0.5"
                    >
                      {stage.message}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-5 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 font-medium flex items-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </div>
  );
};
