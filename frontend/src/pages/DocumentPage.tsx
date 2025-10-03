// pages/DocumentPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EntityTag, { Entity } from '../components/EntityTag';
import FileUpload from '../components/FileUpload';
import QABox from '../components/QABox';

// Mock data for demonstration
const mockEntities: Entity[] = [
  { id: '1', text: 'John Smith', type: 'person', confidence: 0.95 },
  { id: '2', text: 'Acme Corporation', type: 'organization', confidence: 0.92 },
  { id: '3', text: 'January 15, 2024', type: 'date', confidence: 0.98 },
  { id: '4', text: '$15,000.00', type: 'amount', confidence: 0.97 },
  { id: '5', text: 'New York', type: 'location', confidence: 0.89 },
  { id: '6', text: 'Confidential', type: 'misc', confidence: 0.82 },
];

const mockDocument = {
  id: '1',
  name: 'Contract_2024.pdf',
  status: 'processed' as const,
  uploadedAt: '2023-10-12',
  size: '2.4 MB',
  type: 'PDF',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
};

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'preview' | 'entities' | 'qa'>('preview');

  // In a real app, you would fetch the document data based on the ID
  const document = mockDocument;

  const handleAskQuestion = async (question: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `Based on the document, the answer to "${question}" is that Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
  };

  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-textDark">{document.name}</h1>
          <p className="text-textDark/70">Uploaded on {document.uploadedAt} • {document.size}</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
            Download
          </button>
          <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
            Delete
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'preview'
              ? 'border-b-2 border-primary text-primary'
              : 'text-textDark/70 hover:text-textDark'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab('entities')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'entities'
              ? 'border-b-2 border-primary text-primary'
              : 'text-textDark/70 hover:text-textDark'
          }`}
        >
          Entities
        </button>
        <button
          onClick={() => setActiveTab('qa')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'qa'
              ? 'border-b-2 border-primary text-primary'
              : 'text-textDark/70 hover:text-textDark'
          }`}
        >
          Q&A
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-textDark mb-4">Document Preview</h2>
            <div className="border border-gray-200 rounded-lg p-4 min-h-[400px]">
              <p className="text-textDark/80">{document.content}</p>
            </div>
          </div>
        )}

        {activeTab === 'entities' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-textDark mb-4">Extracted Entities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-textDark mb-2">People</h3>
                <div className="flex flex-wrap gap-2">
                  {mockEntities.filter(e => e.type === 'person').map(entity => (
                    <EntityTag key={entity.id} entity={entity} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-textDark mb-2">Organizations</h3>
                <div className="flex flex-wrap gap-2">
                  {mockEntities.filter(e => e.type === 'organization').map(entity => (
                    <EntityTag key={entity.id} entity={entity} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-textDark mb-2">Dates</h3>
                <div className="flex flex-wrap gap-2">
                  {mockEntities.filter(e => e.type === 'date').map(entity => (
                    <EntityTag key={entity.id} entity={entity} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-textDark mb-2">Amounts</h3>
                <div className="flex flex-wrap gap-2">
                  {mockEntities.filter(e => e.type === 'amount').map(entity => (
                    <EntityTag key={entity.id} entity={entity} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-textDark mb-4">Document Q&A</h2>
            <QABox onAskQuestion={handleAskQuestion} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPage;