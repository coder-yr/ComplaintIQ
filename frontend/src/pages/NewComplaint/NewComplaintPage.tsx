import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { analyzeDocument, resetAIState } from '../../features/ai/aiProcessingSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Upload, FileText, CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '../../components/ui/progress';

export const NewComplaintPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const { isProcessing, error, summary } = useAppSelector((state) => state.aiProcessing);
  
  const [progressStep, setProgressStep] = useState(0);

  const steps = [
    'Uploading Complaint',
    'Cleaning Text',
    'Extracting Fields',
    'Validating Data',
    'Assessing Risk',
    'Generating Summary',
    'Preparing Copilot',
    'Done'
  ];

  useEffect(() => {
    dispatch(resetAIState());
  }, [dispatch]);

  // Simulate progress steps if processing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isProcessing) {
      setProgressStep(0);
      interval = setInterval(() => {
        setProgressStep((prev) => {
          if (prev < steps.length - 2) return prev + 1;
          return prev;
        });
      }, 800); // Fake step duration
    } else if (summary && !error) {
      setProgressStep(steps.length - 1);
      setTimeout(() => {
        navigate('/complaints/review');
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isProcessing, summary, error, navigate]);

  const handleAnalyze = () => {
    if (text.trim().length === 0) return;
    dispatch(analyzeDocument(text));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ingest New Complaint</h1>

      <Card>
        <CardHeader>
          <CardTitle>Source Document</CardTitle>
          <CardDescription>Upload a complaint PDF or paste the raw text.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text"><FileText className="mr-2 h-4 w-4" /> Paste Text</TabsTrigger>
              <TabsTrigger value="pdf" disabled><Upload className="mr-2 h-4 w-4" /> Upload PDF (Coming Soon)</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-4 pt-4">
              <Textarea 
                placeholder="Paste the customer complaint email or text here..." 
                className="min-h-[200px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isProcessing}
              />
              <Button onClick={handleAnalyze} disabled={isProcessing || !text.trim()} className="w-full bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>AI Pipeline Progress</span>
                <span>{Math.round(((progressStep + 1) / steps.length) * 100)}%</span>
              </div>
              <Progress value={((progressStep + 1) / steps.length) * 100} className="w-full" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm text-gray-600">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    {idx < progressStep ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : idx === progressStep ? (
                      <Circle className="h-4 w-4 text-blue-500 animate-pulse fill-blue-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300" />
                    )}
                    <span className={idx === progressStep ? 'font-medium text-gray-900' : ''}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            <p className="font-semibold">Analysis Failed</p>
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
