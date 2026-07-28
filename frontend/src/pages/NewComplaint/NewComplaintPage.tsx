import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import ComplaintForm from './components/ComplaintForm';
import { ExtractionTimeline } from './components/ExtractionTimeline';
import { PostExtractionCards } from './components/PostExtractionCards';
import { startSSEExtraction } from '../../features/ai/aiExtractionSlice';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { UploadCloud, Sparkles } from 'lucide-react';
import { CopilotSidebar } from '../../features/copilot/CopilotSidebar';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const LogCustomerComplaint: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputText, setInputText] = useState('');
  const [isPasting, setIsPasting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { isProcessing, timeline } = useSelector((state: RootState) => state.aiExtraction);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        setInputText(fullText);
        dispatch(startSSEExtraction(fullText));
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setInputText(text);
        dispatch(startSSEExtraction(text));
      } else {
        alert("Unsupported file type. Please upload a PDF or TXT file.");
      }
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Failed to read the file.");
    } finally {
      // Reset input value so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
          
          {/* Workspace (Left Panel) - Takes up remaining space */}
          <div className="flex-1 min-w-0 pr-8">
            <div className="max-w-4xl space-y-6">
              <PostExtractionCards />
              <ComplaintForm />
            </div>
          </div>

          {/* Right Panel (30%) - AI Assistant */}
          <div className="w-full xl:w-1/3">
            <div className="sticky top-8 space-y-6">
              
              {/* Extraction Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Complaint Extraction
                  </h3>
                  <p className="text-sm text-gray-500">Upload a PDF or paste raw text to let AI parse the complaint automatically.</p>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".pdf,.txt" 
                  className="hidden" 
                />

                <div className="space-y-4">
                  {!isPasting ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 group relative overflow-hidden"
                    >
                      <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200">
                        <UploadCloud className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Drop PDF here or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">Supports PDF, TXT (Max 10MB)</p>
                      
                      <div className="mt-4 flex items-center gap-2">
                        <div className="h-px w-8 bg-gray-200"></div>
                        <span className="text-xs text-gray-400 uppercase font-bold">OR</span>
                        <div className="h-px w-8 bg-gray-200"></div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsPasting(true); }}
                        className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Paste Complaint Text Instead
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold text-gray-700">Paste Text</Label>
                        <button 
                          onClick={() => setIsPasting(false)}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                      <Textarea 
                        id="complaint-textarea"
                        placeholder="Paste customer email or complaint description here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[140px] text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 bg-gray-50 rounded-xl"
                        disabled={isProcessing}
                      />
                      <Button 
                        onClick={() => {
                          if (inputText.trim()) {
                             dispatch(startSSEExtraction(inputText));
                          }
                        }} 
                        disabled={isProcessing || !inputText.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl h-11 text-base shadow-sm hover:shadow-md transition-all duration-150"
                      >
                        Analyze with AI
                      </Button>
                    </div>
                  )}
                </div>

                {/* Extraction Progress */}
                {(isProcessing || timeline.length > 0) && (
                  <div className="pt-2">
                    <ExtractionTimeline />
                  </div>
                )}
              </div>

              {/* Copilot Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">QA Copilot</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* AI Assistant (Copilot wrapper) */}
              <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-opacity duration-300 ${!hasExtractedData ? 'opacity-60 grayscale-[50%]' : ''}`}>
                <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                   <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    AI Assistant
                   </h3>
                </div>

                <div className="flex flex-col relative h-[450px]">
                  {!hasExtractedData ? (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm max-w-[250px]">
                        <p className="text-sm font-semibold text-gray-700">
                          Analyze a complaint first.
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
