import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import ComplaintForm from './components/ComplaintForm';
import { AIValidationPanel } from './components/AIValidationPanel';
import { AISummaryCard } from './components/AISummaryCard';
import { ExtractionTimeline } from './components/ExtractionTimeline';
import { startSSEExtraction } from '../../features/ai/aiExtractionSlice';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { UploadCloud, FileText, Send, Sparkles } from 'lucide-react';
import { CopilotSidebar } from '../../features/copilot/CopilotSidebar';

const LogCustomerComplaint: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputText, setInputText] = useState('');
  
  const { isProcessing } = useSelector((state: RootState) => state.aiExtraction);

  const handleStartExtraction = () => {
    if (!inputText.trim()) return;
    dispatch(startSSEExtraction(inputText));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Log Customer Complaint</h1>
          <p className="mt-2 text-sm text-gray-600">
            Intelligent workspace for capturing, validating, and risk-assessing pharmaceutical complaints.
          </p>
        </div>

        {/* 70/30 Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel (70%) - Workspace */}
          <div className="w-full lg:w-7/12 xl:w-8/12 space-y-6">
            <AIValidationPanel />
            <ComplaintForm />
            <AISummaryCard />
          </div>

          {/* Right Panel (30%) - Sticky AI Assistant */}
          <div className="w-full lg:w-5/12 xl:w-4/12">
            <div className="sticky top-8 space-y-6">
              
              {/* Input Area */}
              <div className="bg-white rounded-xl border p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  AI Extraction
                </h3>
                <Textarea 
                  placeholder="Paste complaint text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] mb-3"
                  disabled={isProcessing}
                />
                <Button 
                  onClick={handleStartExtraction} 
                  disabled={isProcessing || !inputText.trim()}
                  className="w-full"
                >
                  {isProcessing ? 'Processing...' : 'Extract Fields'}
                </Button>
                
                <div className="mt-4 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-not-allowed bg-gray-50">
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
                    <span className="mt-2 block text-xs font-medium text-gray-500">
                      File Drop (Coming Soon)
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <ExtractionTimeline />

              {/* Embed Copilot inside the layout instead of a Drawer (if CopilotSidebar supports it, else we render standard UI) */}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden h-[400px] flex flex-col">
                <div className="p-4 border-b bg-gray-50">
                   <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    QA Copilot
                   </h3>
                </div>
                <div className="flex-1 overflow-hidden relative">
                   <CopilotSidebar forceInline={true} />
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LogCustomerComplaint;
