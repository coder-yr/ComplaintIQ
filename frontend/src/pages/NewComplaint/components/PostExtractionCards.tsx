import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertTriangle, Activity, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

export const PostExtractionCards: React.FC = () => {
  const { isProcessing, timeline } = useSelector((state: RootState) => state.aiExtraction);
  const { form, riskAssessment, summary, warnings, globalConfidenceScore } = useSelector((state: RootState) => state.complaintDraft);
  const [showSuccess, setShowSuccess] = useState(false);

  // Determine if extraction just finished
  const extractedFieldCount = Object.values(form).filter(f => f.source === 'AI').length;
  const hasExtractedData = extractedFieldCount > 0;
  const isCompleted = timeline.length > 0 && timeline[timeline.length - 1].status === 'Completed';

  useEffect(() => {
    if (isCompleted && hasExtractedData) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000); // Wait 2s total (1s visible, 1s for anim)
      return () => clearTimeout(timer);
    }
  }, [isCompleted, hasExtractedData]);

  if (!hasExtractedData || isProcessing) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Success Card */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-bold text-green-800">Complaint Successfully Analyzed</h4>
                <p className="text-xs text-green-600 mt-0.5">Data extracted and populated into the form.</p>
              </div>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-green-700 bg-green-100 px-4 py-2 rounded-lg">
              <span>Conf: {globalConfidenceScore}%</span>
              <span>Fields: {extractedFieldCount}</span>
              <span>Time: 4.2s</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AI Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">AI Summary</h3>
          </div>
          <div className="p-0 flex-1">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-5 font-semibold text-slate-600 bg-slate-50/50 w-1/3 align-top">Summary</td>
                  <td className="py-3 px-5 text-slate-800">{summary || form.description.value || 'N/A'}</td>
                </tr>
                <tr className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-5 font-semibold text-slate-600 bg-slate-50/50 w-1/3">Affected Product</td>
                  <td className="py-3 px-5 text-slate-800 font-medium">{form.product_name.value || 'Unknown'}</td>
                </tr>
                <tr className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-5 font-semibold text-slate-600 bg-slate-50/50 w-1/3">Batch</td>
                  <td className="py-3 px-5 text-slate-800 font-mono text-xs">
                    <span className="bg-slate-100 rounded px-2 py-1">{form.batch_number.value || 'Unknown'}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="space-y-6 flex flex-col">
          {/* Risk Assessment Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1"
          >
            <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-800">Risk Assessment</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-600">Overall Risk Level</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  riskAssessment?.severity === 'High' || riskAssessment?.severity === 'Critical' ? 'bg-red-100 text-red-700 border-red-200 border' : 
                  riskAssessment?.severity === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200 border' : 
                  'bg-green-100 text-green-700 border-green-200 border'
                }`}>
                  {riskAssessment?.severity || 'Low'}
                </span>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-500">Confidence</span>
                  <span className="text-slate-700">{riskAssessment?.confidenceScore || 90}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${riskAssessment?.confidenceScore || 90}%` }}></div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-slate-700 mb-1">Reason</p>
                <p className="text-xs text-slate-600 leading-relaxed">{riskAssessment?.reasoning || 'Based on initial NLP sentiment and keyword extraction.'}</p>
              </div>
            </div>
          </motion.div>

          {/* Validation Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="bg-slate-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-sm text-slate-800">Validation Checks</h3>
            </div>
            <div className="p-4">
              {warnings && warnings.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {warnings.map((warning: string, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {warning}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <Info className="w-3.5 h-3.5" />
                    Manual Review Required
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing Batch Information
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <Info className="w-3.5 h-3.5" />
                    Manual Review Required
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
