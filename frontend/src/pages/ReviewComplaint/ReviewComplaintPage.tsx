import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { saveComplaint } from '../../features/complaints/complaintsSlice';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { BotMessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { CopilotSidebar } from '../../features/copilot/CopilotSidebar';
import { toggleCopilot } from '../../features/copilot/copilotSlice';

export const ReviewComplaintPage: React.FC = () => {
  const { extractedData, riskData, summary, confidenceScore, missingFields, warnings } = useAppSelector(state => state.complaintDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer_name: '',
    product_name: '',
    batch_number: '',
    incident_date: '',
    description: '',
    severity: '',
    priority: '',
    status: 'PENDING'
  });

  useEffect(() => {
    if (!extractedData && !riskData) {
      navigate('/complaints/new');
      return;
    }
    setFormData({
      customer_name: extractedData?.customer_name || '',
      product_name: extractedData?.product_name || '',
      batch_number: extractedData?.batch_number || '',
      incident_date: extractedData?.incident_date || '',
      description: extractedData?.description || '',
      severity: riskData?.severity || 'LOW',
      priority: riskData?.priority || 'LOW',
      status: 'PENDING'
    });
  }, [extractedData, riskData, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await dispatch(saveComplaint(formData)).unwrap();
      toast({
        title: "Complaint Saved",
        description: "The complaint has been successfully saved to the database.",
      });
      navigate('/');
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the complaint.",
      });
    }
  };

  const renderConfidenceBadge = (fieldName: string) => {
    if (missingFields.includes(fieldName)) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50 ml-2">⚠ Missing</Badge>;
    }
    if (confidenceScore >= 0.8) {
      return <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 ml-2"><CheckCircle className="w-3 h-3 mr-1 inline"/> {Math.round(confidenceScore * 100)}% Confident</Badge>;
    }
    return <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 ml-2">⚠ {Math.round(confidenceScore * 100)}% Confident</Badge>;
  };

  return (
    <div className="flex h-[calc(100vh-6rem)]">
      <div className="w-1/2 p-4 overflow-y-auto border-r">
        <h2 className="text-xl font-bold mb-4">AI Summary & Document</h2>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-md">AI Generated Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{summary}</p>
          </CardContent>
        </Card>
        
        {warnings.length > 0 && (
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-md text-orange-800 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> AI Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-orange-700">
                {warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="w-1/2 p-4 overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Review & Edit Data</h2>
          <Button variant="outline" size="sm" onClick={() => dispatch(toggleCopilot())}>
            <BotMessageSquare className="w-4 h-4 mr-2" /> Ask Copilot
          </Button>
        </div>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Extracted Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center">Customer Name {renderConfidenceBadge('customer_name')}</Label>
              <Input name="customer_name" value={formData.customer_name} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label className="flex items-center">Product Name {renderConfidenceBadge('product_name')}</Label>
              <Input name="product_name" value={formData.product_name} onChange={handleChange} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center">Batch Number {renderConfidenceBadge('batch_number')}</Label>
                <Input name="batch_number" value={formData.batch_number} onChange={handleChange} className="mt-1" />
              </div>
              <div>
                <Label className="flex items-center">Incident Date {renderConfidenceBadge('incident_date')}</Label>
                <Input type="date" name="incident_date" value={formData.incident_date} onChange={handleChange} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="flex items-center">Description {renderConfidenceBadge('description')}</Label>
              <Textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 h-24" />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-blue-100">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-blue-900">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex space-x-4">
               <div>
                  <Label>Severity</Label>
                  <div className="mt-1 font-semibold">{formData.severity}</div>
               </div>
               <div>
                  <Label>Priority</Label>
                  <div className="mt-1 font-semibold">{formData.priority}</div>
               </div>
            </div>
            <div>
              <Label>AI Rationale</Label>
              <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded border">{riskData?.rationale}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2 pb-8">
          <Button variant="ghost" onClick={() => navigate('/complaints/new')}>Cancel</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Complaint</Button>
        </div>
      </div>
      
      <CopilotSidebar />
    </div>
  );
};
