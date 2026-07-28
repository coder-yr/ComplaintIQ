import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { toggleCopilot, addUserMessage, askCopilot, addCopilotMessage } from './copilotSlice';
import { CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { X, Send } from 'lucide-react';

export const CopilotSidebar: React.FC<{ forceInline?: boolean }> = ({ forceInline = false }) => {
  const { isOpen, messages, isTyping } = useAppSelector(state => state.copilot);
  const dispatch = useAppDispatch();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isOpen && !forceInline) return null;

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    
    const isLikelyRawComplaint = input.length > 100 && !input.includes('?');
    
    dispatch(addUserMessage(input));
    
    if (isLikelyRawComplaint) {
      setTimeout(() => {
        dispatch(addCopilotMessage("It looks like you've pasted a raw complaint. Please use the Complaint Extraction section above and click Analyze with AI. After extraction I can answer questions."));
      }, 500);
    } else {
      dispatch(askCopilot(input));
    }
    
    setInput('');
  };

  const containerClasses = forceInline 
    ? "flex flex-col h-full bg-white w-full"
    : "absolute top-4 right-4 w-96 h-[calc(100vh-8rem)] shadow-2xl flex flex-col z-50 rounded-xl border bg-white";

  return (
    <div className={containerClasses}>
      {!forceInline && (
        <div className="flex flex-row items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">AI Copilot</h2>
          <Button variant="ghost" size="sm" onClick={() => dispatch(toggleCopilot())}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col gap-4 pt-2">
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <h4 className="text-sm font-bold text-gray-900 mb-1">Hello! I'm your QA Copilot.</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ask anything about this complaint.
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Suggested Prompts</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Summarize Complaint",
                  "Batch Number",
                  "Risk Level",
                  "Missing Fields",
                  "Escalation Required"
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setInput(prompt);
                      // handleSend could be called here or user could just edit it
                    }}
                    className="text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-100 text-gray-900 text-sm animate-pulse">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-4 bg-white border-t-0">
        <div className="flex space-x-2 border rounded-md p-1 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 bg-white">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask questions about the extracted complaint..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0 px-2"
            disabled={isTyping}
          />
          <Button onClick={handleSend} size="icon" disabled={isTyping} className="bg-blue-600 hover:bg-blue-700 h-8 w-8 rounded">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          AI responses may contain errors. Please verify information.
        </p>
      </div>
    </div>
  );
};
