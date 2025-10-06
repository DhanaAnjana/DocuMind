// pages/DashboardPage.tsx
import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import DocumentCard from '../components/DocumentCard';
import MetricCard from '../components/MetricCard';
import FileUpload from '../components/FileUpload';
import { useDocuments } from '../hooks/useDocuments';

const DashboardPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const isDarkMode = currentTheme.id === 'dark';
  const { data: documents, isLoading, error } = useDocuments();

  // Calculate real metrics from actual documents
  const metrics = useMemo(() => {
    if (!documents) {
      return [
        { title: 'Total Documents', value: 0, trend: 0, icon: '📚' },
        { title: 'Total Pages', value: 0, trend: 0, icon: '📄' },
        { title: 'Processed Chunks', value: 0, trend: 0, icon: '🔄' },
        { title: 'PDF Documents', value: 0, trend: 0, icon: '📋' },
      ];
    }

    const total = documents.length;
    const totalChunks = documents.reduce((acc, doc) => acc + doc.chunks.length, 0);

    return [
      { title: 'Total Documents', value: total, trend: 0, icon: '📚' },
      { title: 'Total Chunks', value: totalChunks, trend: 0, icon: '📄' },
    ];
  }, [documents]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={isDarkMode ? 'text-white' : 'text-text-dark'}>Loading documents...</div>
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-text-dark'}`}>
            Dashboard
          </h1>
          <p className="text-text-light mt-2">Welcome to your document intelligence dashboard</p>
        </div>
      </div>

      {/* File Upload Section */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? 'bg-surface border-surface-muted' : 'bg-surface border-border'
      }`}>
        <FileUpload />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Documents Section */}
      <div className={`rounded-xl shadow-sm border ${
        isDarkMode ? 'bg-surface border-surface-muted' : 'bg-surface border-border'
      }`}>
        <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between ${
          isDarkMode ? 'border-surface-muted' : 'border-border'
        }`}>
          <h2 className={`text-xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-text-dark'
          }`}>Recent Documents</h2>
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-secondary transition-colors">
              Active
            </button>
            <button className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-text-muted hover:bg-surface-muted/30'
                : 'text-text-light hover:bg-background'
            }`}>
              Archived
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {documents?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className={`text-lg font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-text-dark'
              }`}>No documents yet</h3>
              <p className="text-text-light">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents?.map(document => (
                <DocumentCard 
                  key={document.id} 
                  document={{
                    id: document.id.toString(),
                    name: document.filename,
                    type: document.content_type,
                    uploadedAt: document.created_at,
                    size: `${document.chunks.length} chunks`,
                    status: document.chunks.length > 0 ? 'processed' : 'processing'
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;