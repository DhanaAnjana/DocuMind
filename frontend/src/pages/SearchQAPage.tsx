import React, { useState } from 'react';
import QABox from '../components/QABox';
import LoadingSpinner from '../components/LoadingSpinner';

interface Source {
  content: string;
  document_id: number;
  chunk_id: number | null;
  score: number;
}

interface QueryResult {
  answer: string;
  sources: Source[];
}

const API_BASE_URL = 'http://localhost:8000';

const QAPage: React.FC = () => {
  const [messages, setMessages] = useState<
    { type: 'user' | 'bot'; text: string; sources?: Source[] }[]
  >([]);
  const [isQaLoading, setIsQaLoading] = useState(false);
  const [qaError, setQaError] = useState<string | null>(null);

  const handleAskQuestion = async (question: string) => {
    if (!question.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: 'user', text: question }]);
    setIsQaLoading(true);
    setQaError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/query/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question, limit: 5 }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'An error occurred while fetching the answer.');
      }

      const data: QueryResult[] = await response.json();

      if (data && data.length > 0) {
        const result = data[0]; // take first result
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: result.answer, sources: result.sources },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: 'No answer could be generated from the documents.' },
        ]);
      }
    } catch (error: any) {
      setQaError(error.message);
    } finally {
      setIsQaLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xl p-4 rounded-lg shadow ${
                msg.type === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-800 border'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Show sources directly below bot answer */}
              {msg.type === 'bot' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 border-t pt-3 space-y-3">
                  <p className="font-semibold text-sm text-gray-600">Relevant Chunks:</p>
                  {msg.sources.map((src, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border rounded-lg p-2 text-xs text-gray-700"
                    >
                      <p className="mb-1 font-mono whitespace-pre-wrap">{src.content}</p>
                      <div className="text-[10px] text-gray-500">
                        Doc ID: {src.document_id} | Chunk: {src.chunk_id ?? 'N/A'} | Score:{' '}
                        {src.score.toFixed(3)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isQaLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <LoadingSpinner />
            <span>Generating answer...</span>
          </div>
        )}

        {qaError && (
          <p className="text-error bg-error/10 p-3 rounded-lg">{qaError}</p>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t bg-white">
        <QABox onAskQuestion={handleAskQuestion} isLoading={isQaLoading} />
      </div>
    </div>
  );
};

export default QAPage;
