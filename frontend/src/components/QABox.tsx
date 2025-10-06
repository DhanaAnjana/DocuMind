import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

// The props are simplified. The component now receives the loading state
// from its parent and the onAskQuestion function no longer needs to return a value.
interface QABoxProps {
  onAskQuestion: (question: string) => void;
  isLoading: boolean;
  documentId?: string;
}

const QABox: React.FC<QABoxProps> = ({ onAskQuestion, isLoading, documentId }) => {
  // The only state this component manages is the text in the input field.
  const [question, setQuestion] = useState('');

  // The submit handler is simplified to just call the prop function.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    
    onAskQuestion(question);
    setQuestion(''); // Clear the input after asking
  };

  return (
    // The main container and form structure remain the same.
    <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-text-dark mb-4">
        {documentId ? 'Ask about this document' : 'Ask across all documents'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to know?"
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
      
      {/* The entire section for displaying the answer, citations, and feedback 
        has been removed, as this is now handled by the parent component (SearchQAPage).
      */}
    </div>
  );
};

export default QABox;