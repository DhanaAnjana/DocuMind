// components/QABox.tsx
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Citation {
  text: string;
  page: number;
  confidence: number;
}

interface QABoxProps {
  onAskQuestion: (question: string) => Promise<{ answer: string; citations: Citation[] }>;
  documentId?: string;
}

const QABox: React.FC<QABoxProps> = ({ onAskQuestion, documentId }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsLoading(true);
    setHasAsked(true);
    try {
      const response = await onAskQuestion(question);
      setAnswer(response.answer);
      setCitations(response.citations);
    } catch (error) {
      setAnswer('Sorry, there was an error processing your question. Please try again.');
      setCitations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (isUseful: boolean) => {
    // Implement feedback tracking
    console.log(`Feedback: ${isUseful ? 'useful' : 'not useful'} for question: ${question}`);
  };

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-text-dark mb-4">
        {documentId ? 'Ask about this document' : 'Ask across all documents'}
      </h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to know about your documents?"
            className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[120px]"
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Thinking...
              </>
            ) : (
              'Ask'
            )}
          </button>
        </div>
      </form>
      
      {hasAsked && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg p-4 border border-border">
                <h4 className="font-semibold text-text-dark mb-3 flex items-center">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                  Answer
                </h4>
                <p className="text-text-dark/80 leading-relaxed">{answer}</p>
                
                <div className="flex justify-end mt-4 space-x-3">
                  <button 
                    onClick={() => handleFeedback(true)}
                    className="text-sm text-success hover:text-green-700 flex items-center space-x-1 transition-colors"
                  >
                    <span>👍</span>
                    <span>Useful</span>
                  </button>
                  <button 
                    onClick={() => handleFeedback(false)}
                    className="text-sm text-error hover:text-red-700 flex items-center space-x-1 transition-colors"
                  >
                    <span>👎</span>
                    <span>Not Useful</span>
                  </button>
                </div>
              </div>
              
              {citations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-text-dark mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Sources
                  </h4>
                  <div className="space-y-2">
                    {citations.map((citation, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mt-0.5">
                          Page {citation.page}
                        </span>
                        <p className="text-text-dark/70 flex-1">{citation.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QABox;