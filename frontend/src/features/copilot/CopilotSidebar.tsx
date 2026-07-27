import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { toggleCopilot, addUserMessage, askCopilot } from './copilotSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { X, Send } from 'lucide-react';

export const CopilotSidebar: React.FC = () => {
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

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    dispatch(addUserMessage(input));
    dispatch(askCopilot(input));
    setInput('');
  };

  return (
    <Card className="absolute top-4 right-4 w-96 h-[calc(100vh-8rem)] shadow-2xl flex flex-col z-50">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg">AI Copilot</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => dispatch(toggleCopilot())}>
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center text-sm mt-10">
            Ask me anything about this complaint, e.g., 'What is the main issue reported?'
          </p>
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

      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button onClick={handleSend} size="icon" disabled={isTyping} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
