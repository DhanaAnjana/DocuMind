// pages/DashboardPage.tsx
import React from 'react';
import DocumentCard from '../components/DocumentCard';
import MetricCard from '../components/MetricCard';
import FileUpload from '../components/FileUpload';
import { useDocuments } from '../hooks/useDocuments';

const DashboardPage: React.FC = () => {
  const { data: documents, isLoading, error } = useDocuments();

  const metrics = [
    { title: 'Total Documents', value: 142, trend: 12, icon: '📚' },
    { title: 'Processed', value: 118, trend: 8, icon: '✅' },
    { title: 'In Progress', value: 19, trend: 4, icon: '🔄' },
    { title: 'Errors', value: 5, trend: -3, icon: '❌' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-dark">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-error">
        Error loading documents: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Dashboard</h1>
          <p className="text-text-light mt-2">Welcome to your document intelligence dashboard</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <FileUpload />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Documents Section */}
      <div className="bg-surface rounded-xl shadow-sm border border-border">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-text-dark">Recent Documents</h2>
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-secondary transition-colors">
              Active
            </button>
            <button className="px-4 py-2 text-text-light hover:bg-background rounded-lg transition-colors">
              Archived
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {documents?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-text-dark mb-2">No documents yet</h3>
              <p className="text-text-light">Upload your first document to get started</p>
            </div>
          ) : (
            documents?.map(document => (
              <DocumentCard key={document.id} document={document} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;