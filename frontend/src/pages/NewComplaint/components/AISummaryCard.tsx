import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updateSummary } from '../../../features/complaints/complaintSlice';
import { FileText, Pencil } from 'lucide-react';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';

export const AISummaryCard: React.FC = () => {
  const dispatch = useDispatch();
  const summary = useSelector((state: RootState) => state.complaintDraft.summary);
  const { isProcessing, timeline } = useSelector((state: RootState) => state.aiExtraction);
  
  const [isEditing, setIsEditing] = useState(false);
  const [localSummary, setLocalSummary] = useState('');

  if (isProcessing || timeline.every(t => t.status === 'Pending')) {
    return null;
  }

  if (!summary && !isEditing) {
    return null;
  }

  const handleEdit = () => {
    setLocalSummary(summary);
    setIsEditing(true);
  };

  const handleSave = () => {
    dispatch(updateSummary(localSummary));
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          AI Generated Summary
        </h3>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 gap-1 text-gray-500 hover:text-blue-600">
            <Pencil className="h-3 w-3" /> Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea 
            value={localSummary} 
            onChange={(e) => setLocalSummary(e.target.value)} 
            className="min-h-[120px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save Summary</Button>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
          {summary}
        </div>
      )}
    </div>
  );
};
