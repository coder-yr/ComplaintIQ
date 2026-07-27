import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { toggleCopilot, addUserMessage, askCopilot, addCopilotMessage } from './copilotSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
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
          <div className="bg-[#eff4fe] rounded-lg p-4 flex gap-3 text-sm text-[#3b5998]">
            <div className="mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM9.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
              </svg>
            </div>
            <p className="leading-relaxed">
              Upload a complaint document or paste text above.<br/>I will automatically extract the details and populate the form for you.
            </p>
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
