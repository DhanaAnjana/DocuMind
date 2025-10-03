// pages/SearchQAPage.tsx
import React, { useState } from 'react';
import QABox from '../components/QABox';

const SearchQAPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Simulate search results
    setSearchResults([
      `Document 1: Found content related to "${searchQuery}"`,
      `Document 2: Additional information about "${searchQuery}"`,
      `Document 3: Reference to "${searchQuery}" in section 4.2`,
    ]);
  };

  const handleAskQuestion = async (question: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `Across all documents, the answer to "${question}" appears to be that multiple sources confirm this information.`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textDark">Search & Q&A</h1>
        <p className="text-textDark/70">Search across all documents or ask questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-textDark mb-4">Search Documents</h2>
          
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search terms..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          {searchResults.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-textDark mb-2">Search Results:</h3>
              <ul className="space-y-2">
                {searchResults.map((result, index) => (
                  <li key={index} className="text-textDark/80 text-sm">
                    • {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-surface rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-textDark mb-4">Cross-Document Q&A</h2>
          <QABox onAskQuestion={handleAskQuestion} />
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-textDark mb-4">Recent Queries</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-textDark">What are the payment terms?</span>
            <span className="text-xs text-textDark/50">2 days ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-textDark">Contract expiration dates</span>
            <span className="text-xs text-textDark/50">5 days ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="text-textDark">Parties involved in agreement</span>
            <span className="text-xs text-textDark/50">1 week ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchQAPage;