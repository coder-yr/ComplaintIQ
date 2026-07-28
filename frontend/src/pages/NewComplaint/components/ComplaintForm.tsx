import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updateField, saveComplaint, resetComplaint } from '../../../features/complaints/complaintSlice';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { CheckCircle2, RefreshCw, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ComplaintForm: React.FC = () => {
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.complaintDraft.form);
  const saveStatus = useSelector((state: RootState) => state.complaintDraft.saveStatus);
  const isProcessing = useSelector((state: RootState) => state.aiExtraction.isProcessing);
  const hasData = Object.values(form).some(f => f.value !== undefined && f.value !== '');

  const handleInputChange = (field: keyof typeof form, value: string) => {
    dispatch(updateField({ field, value }));
  };

  const renderField = (
    label: string, 
    fieldKey: keyof typeof form, 
    type: 'text' | 'date' | 'textarea' = 'text'
  ) => {
    const fieldData = form[fieldKey];
    const isAiExtracted = fieldData.source === 'AI' && !fieldData.userEdited;
    const hasValue = Boolean(fieldData.value);
    
    return (
      <div className="space-y-2 mb-2 relative">
        <Label className="text-[13px] font-semibold text-slate-700 flex items-center justify-between">
          {label}
          {isAiExtracted && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
              fieldData.confidence > 80 ? 'bg-green-100 text-green-700' :
              fieldData.confidence > 50 ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              AI Conf: {fieldData.confidence}%
            </motion.span>
          )}
        </Label>
        
        <div className="relative">
          {(!hasValue && (isProcessing || !hasData)) ? (
            <div className={`w-full rounded-lg bg-gray-100 border border-gray-100 flex items-center px-3 ${type === 'textarea' ? 'h-[100px] items-start py-3' : 'h-11'}`}>
              <div className="flex space-x-2 items-center w-full">
                 <div className="h-2 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                 <span className="text-xs text-gray-400 italic absolute right-3">Awaiting AI extraction...</span>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${fieldKey}-${hasValue ? 'filled' : 'empty'}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {type === 'textarea' ? (
                  <Textarea 
                    value={fieldData.value || ''}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    className={`min-h-[100px] text-sm text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all ${isAiExtracted ? 'border-blue-200 bg-blue-50/20' : 'bg-white'}`}
                  />
                ) : (
                  <Input 
                    type={type}
                    value={fieldData.value || ''}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    className={`h-11 text-sm text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all ${isAiExtracted ? 'border-blue-200 bg-blue-50/20' : 'bg-white'}`}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-white">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Customer Complaint</h2>
        <p className="text-sm text-gray-500 mt-1">Review and verify the extracted complaint details before saving.</p>
      </div>

      <div className="p-8 space-y-10">
        
        {/* 1. Origin & Customer Details */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">1</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Complaint Origin</h3>
            <div className="flex-1 border-t border-gray-100 ml-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {renderField('Complaint Source', 'complaint_source')}
            {renderField('Customer Name', 'customer_name')}
          </div>
        </section>

        {/* 2. Product & Batch Identification */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">2</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Product Information</h3>
            <div className="flex-1 border-t border-gray-100 ml-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {renderField('Product Name', 'product_name')}
            {renderField('Strength / Grade', 'product_strength')}
            {renderField('Batch / Lot Number', 'batch_number')}
            {renderField('Quantity Affected', 'quantity_affected')}
            {renderField('Manufacturing Date', 'manufacturing_date', 'date')}
            {renderField('Expiry Date', 'expiry_date', 'date')}
          </div>
        </section>

        {/* 3. Complaint Details */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">3</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Complaint Details</h3>
            <div className="flex-1 border-t border-gray-100 ml-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-4">
            {renderField('Complaint Type', 'complaint_type')}
            {renderField('Date Received', 'complaint_date', 'date')}
          </div>
          {renderField('Detailed Description', 'description', 'textarea')}
        </section>

        {/* 4. Initial Assessment */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">4</span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Initial Assessment</h3>
            <div className="flex-1 border-t border-gray-100 ml-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {renderField('Severity Level', 'severity')}
            {renderField('Priority', 'priority')}
          </div>
        </section>

      </div>

      <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to reset this form? All unsaved data will be lost.")) {
              dispatch(resetComplaint());
            }
          }}
          className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 font-medium text-sm flex items-center gap-2 transition-colors duration-150"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
        <button 
          onClick={() => dispatch(saveComplaint() as any)}
          disabled={saveStatus === 'loading'}
          className="px-8 py-2.5 bg-blue-600 rounded-xl text-white font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150"
        >
          {saveStatus === 'loading' ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : saveStatus === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saveStatus === 'loading' ? 'Saving...' : saveStatus === 'success' ? 'Saved' : 'Save Complaint'}
        </button>
      </div>
    </div>
  );
};

export default ComplaintForm;
