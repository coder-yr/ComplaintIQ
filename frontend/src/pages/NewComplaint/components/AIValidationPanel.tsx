import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';

export const AIValidationPanel: React.FC = () => {
  const { missingFields, warnings, errors, globalConfidenceScore } = useSelector((state: RootState) => state.complaintDraft);
  const { isProcessing, timeline } = useSelector((state: RootState) => state.aiExtraction);

  // If we are currently processing, don't show validation errors from the previous run
  if (isProcessing || timeline.every(t => t.status === 'Pending')) {
    return null;
  }

  const hasIssues = missingFields.length > 0 || warnings.length > 0 || errors.length > 0;

  if (!hasIssues) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Validation Passed</AlertTitle>
        <AlertDescription className="text-green-700">
          The AI extracted fields successfully and no validation errors were found. 
          Confidence Score: <span className="font-semibold">{Math.round(globalConfidenceScore * 100)}%</span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Extraction Errors</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {(warnings.length > 0 || missingFields.length > 0) && (
        <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Validation Warnings</AlertTitle>
          <AlertDescription className="text-yellow-700">
            {missingFields.length > 0 && (
              <div className="mt-2">
                <strong>Missing Required Fields:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {missingFields.map((f, i) => <li key={i}>{f.replace('_', ' ')}</li>)}
                </ul>
              </div>
            )}
            {warnings.length > 0 && (
              <div className="mt-2">
                <strong>Warnings:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
