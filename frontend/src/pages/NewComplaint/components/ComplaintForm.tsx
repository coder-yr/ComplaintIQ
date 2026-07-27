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
        <Label className="text-sm font-medium flex items-center justify-between">
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
          <div className="h-10 w-full animate-pulse bg-gray-100 rounded-md border border-gray-200 flex items-center px-3">
            <span className="text-xs text-gray-400">Awaiting AI extraction...</span>
          </div>
        ) : type === 'textarea' ? (
          <Textarea 
            value={fieldData.value || ''}
            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
            className={`min-h-[100px] ${isAiExtracted ? 'border-blue-200 bg-blue-50/30' : ''}`}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : (
          <Input 
            type={type}
            value={fieldData.value || ''}
            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
            className={isAiExtracted ? 'border-blue-200 bg-blue-50/30' : ''}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Origin & Customer Details */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-2">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
          Origin & Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {renderField('Complaint Source', 'complaint_source')}
          {renderField('Customer Name', 'customer_name')}
        </div>
      </section>

      {/* 2. Product & Batch Identification */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-2">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
          Product & Batch Identification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {renderField('Product Name', 'product_name')}
          {renderField('Product Strength', 'product_strength')}
          {renderField('Batch / Lot Number', 'batch_number')}
          {renderField('Manufacturing Date', 'manufacturing_date', 'date')}
          {renderField('Expiry Date', 'expiry_date', 'date')}
          {renderField('Quantity Affected', 'quantity_affected')}
        </div>
      </section>

      {/* 3. Complaint Details */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-2">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
          Complaint Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {renderField('Complaint Type', 'complaint_type')}
          {renderField('Complaint Date', 'complaint_date', 'date')}
          {renderField('Incident Date', 'incident_date', 'date')}
        </div>
        <div className="mt-4">
          {renderField('Description', 'description', 'textarea')}
        </div>
      </section>

      {/* 4. Initial Assessment */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b pb-2">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
          Initial Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {renderField('Severity', 'severity')}
          {renderField('Priority', 'priority')}
        </div>
      </section>

    </div>
  );
};

export default ComplaintForm;
