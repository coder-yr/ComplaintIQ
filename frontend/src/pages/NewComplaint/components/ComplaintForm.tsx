import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updateField } from '../../../features/complaints/complaintSlice';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ComplaintForm: React.FC = () => {
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.complaintDraft.form);
  const isProcessing = useSelector((state: RootState) => state.aiExtraction.isProcessing);

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
    
    return (
      <div className="space-y-1 mb-4 relative">
        <Label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
          {label}
          {isAiExtracted && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
              fieldData.confidence > 80 ? 'bg-green-100 text-green-700' :
              fieldData.confidence > 50 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              AI {fieldData.confidence}%
            </span>
          )}
        </Label>
        
        {isProcessing && !fieldData.value ? (
          <div className="h-10 w-full animate-pulse bg-gray-50 rounded-md border border-gray-200 flex items-center px-3">
            <span className="text-sm text-gray-400">Awaiting AI extraction...</span>
          </div>
        ) : type === 'textarea' ? (
          <Textarea 
            value={fieldData.value || ''}
            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
            className={`min-h-[100px] text-gray-700 ${isAiExtracted ? 'border-blue-200 bg-blue-50/30' : ''}`}
            placeholder="Awaiting AI extraction..."
          />
        ) : (
          <Input 
            type={type}
            value={fieldData.value || ''}
            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
            className={`text-gray-700 ${isAiExtracted ? 'border-blue-200 bg-blue-50/30' : ''}`}
            placeholder="Awaiting AI extraction..."
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* 1. Origin & Customer Details */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b">
          1. Origin & Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {renderField('Complaint Source', 'complaint_source')}
          {renderField('Customer Name', 'customer_name')}
        </div>
      </section>

      {/* 2. Product & Batch Identification */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b">
          2. Product & Batch Identification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {renderField('Product Name', 'product_name')}
          {renderField('Product Strength/Grade', 'product_strength')}
          {renderField('Batch/Lot Number', 'batch_number')}
          {renderField('Manufacturing Date', 'manufacturing_date', 'date')}
          {renderField('Expiry Date', 'expiry_date', 'date')}
          {renderField('Quantity Affected', 'quantity_affected')}
        </div>
      </section>

      {/* 3. Complaint Details */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b">
          3. Complaint Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {renderField('Complaint Type', 'complaint_type')}
          {renderField('Complaint Date', 'complaint_date', 'date')}
        </div>
        <div className="mt-2">
          {renderField('Detailed Complaint Description', 'description', 'textarea')}
        </div>
      </section>

      {/* 4. Initial Assessment */}
      <section className="bg-white p-6 rounded-xl border shadow-sm mb-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5 pb-2 border-b">
          4. Initial Assessment & Priority
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {renderField('Initial Severity', 'severity')}
          {renderField('Priority', 'priority')}
        </div>
      </section>

      <div className="flex items-center justify-between pt-2">
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Reset Form
        </button>
        <button className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
          Save Complaint
        </button>
      </div>

    </div>
  );
};

export default ComplaintForm;
