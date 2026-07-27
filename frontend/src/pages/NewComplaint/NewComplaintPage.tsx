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
import { UploadCloud, FileText, Send, Sparkles, AlertCircle } from 'lucide-react';
import { CopilotSidebar } from '../../features/copilot/CopilotSidebar';

const LogCustomerComplaint: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputText, setInputText] = useState('');
  const [isPasting, setIsPasting] = useState(false);
  
  const { isProcessing } = useSelector((state: RootState) => state.aiExtraction);

  const handleStartExtraction = () => {
    if (!inputText.trim()) return;
    dispatch(startSSEExtraction(inputText));
  };

  const form = useSelector((state: RootState) => state.complaintDraft.form);
  const hasExtractedData = Object.values(form).some(f => f.value !== undefined && f.value !== '');

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header matching target UI */}
        <div className="mb-8 flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Log Customer Complaint</h1>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              API & FDF Quality Assurance Module
            </p>
          </div>
          <div>
             <span className="border border-yellow-400 text-yellow-600 font-bold text-xs px-3 py-1.5 rounded-md bg-yellow-50/50 uppercase tracking-wider">
               Pending Triage
             </span>
          </div>
        </div>

        {/* 70/30 Split Layout */}
        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Left Panel (70%) - Workspace */}
          <div className="w-full xl:w-2/3 space-y-6">
            <ComplaintForm />
          </div>

          {/* Right Panel (30%) - AI Assistant */}
          <div className="w-full xl:w-1/3">
            <div className="sticky top-8 space-y-6">
              
              {/* Extraction Card */}
              <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base border-b pb-3">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Upload or Paste Complaint
                </h3>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <UploadCloud className="h-4 w-4 text-gray-400" />
                    Upload PDF
                  </button>
                  <button 
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-blue-200 rounded-md shadow-sm bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    onClick={() => {
                      setIsPasting(true);
                      const ta = document.getElementById('complaint-textarea');
                      if (ta) ta.focus();
                    }}
                  >
                    <FileText className="h-4 w-4 text-blue-500" />
                    Paste Text
                  </button>
                </div>

                <div className="space-y-2">
                  <Textarea 
                    id="complaint-textarea"
                    placeholder="Paste customer email or complaint description..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[120px] text-sm bg-gray-50 focus:bg-white"
                    disabled={isProcessing}
                  />
                  <Button 
                    onClick={() => {
                      if (inputText.trim()) {
                         dispatch(startSSEExtraction(inputText));
                         setIsPasting(false);
                      }
                    }} 
                    disabled={isProcessing || !inputText.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 font-semibold"
                  >
                    Analyze with AI
                  </Button>
                </div>

                {/* Extraction Progress */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Extraction Progress</h4>
                  {isProcessing ? (
                    <>
                      <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                         <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 w-1/2 animate-pulse"></div>
                         </div>
                      </div>
                      <p className="text-xs text-gray-600">Analyzing document...</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Waiting for document or text input.</p>
                  )}
                </div>
              </div>

              {/* Copilot Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">QA Copilot</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* AI Assistant (Copilot wrapper) */}
              <div className={`bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col transition-opacity duration-300 ${!hasExtractedData ? 'opacity-60 grayscale-[50%]' : ''}`}>
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                   <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    AI Assistant
                   </h3>
                </div>

                <div className="flex flex-col relative h-[350px]">
                  {!hasExtractedData ? (
                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                      <div className="bg-white border rounded-lg p-4 shadow-sm max-w-[250px]">
                        <p className="text-sm font-medium text-gray-700">
                          Analyze a complaint first to enable QA Copilot.
                        </p>
                      </div>
                    </div>
                  ) : null}
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
