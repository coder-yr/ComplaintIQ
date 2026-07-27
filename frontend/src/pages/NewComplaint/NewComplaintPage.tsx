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
  
  const { isProcessing } = useSelector((state: RootState) => state.aiExtraction);

  const handleStartExtraction = () => {
    if (!inputText.trim()) return;
    dispatch(startSSEExtraction(inputText));
  };

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
            <div className="sticky top-8 space-y-6 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center bg-white">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  AI Complaint Intake Assistant
                 </h3>
                 <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">BETA</span>
              </div>

              <div className="p-5 flex-1 flex flex-col space-y-5">
                {/* Upload Area */}
                <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50/50">
                   <UploadCloud className="h-6 w-6 text-gray-400 mb-2" />
                   <p className="text-sm font-medium text-gray-700">Drag & drop complaint document here</p>
                   <p className="text-sm text-blue-600 font-medium mt-1 hover:underline">or click to browse</p>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-3 text-xs text-gray-400 font-medium uppercase">OR</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Paste Area */}
                <div className="space-y-2">
                  <button 
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={() => {
                      const text = window.prompt("Paste Complaint Text / Email below:");
                      if (text) {
                         dispatch(startSSEExtraction(text));
                      }
                    }}
                  >
                    <FileText className="h-4 w-4 text-gray-400" />
                    Paste Complaint Text / Email
                  </button>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 flex gap-2 items-start text-xs text-green-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Supported formats: PDF, DOCX, TXT, EML</p>
                      <p>Max file size: 10MB</p>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Extraction Progress */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Extraction Progress</h4>
                  {isProcessing ? (
                    <>
                      <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                         <div className="h-2.5 w-16 bg-blue-600 rounded-full animate-pulse"></div>
                         <span>Processing...</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Analyzing document content and extracting key details...<br/>Please wait, this may take a few moments.
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Waiting for document or text input.</p>
                  )}
                </div>

                <hr className="border-gray-100" />

                {/* AI Assistant (Copilot wrapper) */}
                <div className="flex-1 flex flex-col">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">AI Assistant</h4>
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col relative h-[300px]">
                     {/* We use forceInline to strip internal headers inside CopilotSidebar */}
                     <CopilotSidebar forceInline={true} />
                  </div>
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
