// pages/DocumentPage.tsx
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDocuments } from '../hooks/useDocuments';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileText, Download, Trash2, Eye, Calendar, HardDrive } from 'lucide-react';

const DocumentPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const isDarkMode = currentTheme.id === 'dark';
  const { data: documents, isLoading, error } = useDocuments();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'processed' | 'processing' | 'error'>('all');

  const handleDownload = (docId: string, filename: string) => {
    console.log('Downloading document:', docId, filename);
    // TODO: Implement actual download from backend
    alert(`Downloading ${filename}...`);
  };

  const handleDelete = (docId: string, filename: string) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      console.log('Deleting document:', docId);
      // TODO: Implement actual delete API call
      alert(`Deleting ${filename}...`);
    }
  };

  const handleView = (docId: string) => {
    setSelectedDoc(selectedDoc === docId ? null : docId);
  };

  const filteredDocuments = documents?.filter(doc => {
    if (filter === 'all') return true;
    return doc.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-success/20 text-success border-success/30';
      case 'processing':
      case 'queued':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'error':
        return 'bg-error/20 text-error border-error/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-text-dark'}`}>
            Documents
          </h1>
          <p className="text-text-light mt-2">
            {documents?.length || 0} document{documents?.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Filter Buttons */}
        <div className={`flex space-x-2 p-1 rounded-xl ${
          isDarkMode ? 'bg-surface-muted/30' : 'bg-surface-muted/30'
        }`}>
          {['all', 'processed', 'processing', 'error'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 capitalize ${
                filter === filterType
                  ? 'bg-primary text-white shadow-sm'
                  : isDarkMode
                    ? 'text-text-muted hover:text-white'
                    : 'text-text-secondary hover:text-primary'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments?.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No documents found"
          description={
            filter === 'all'
              ? 'Upload your first document to get started'
              : `No ${filter} documents found`
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredDocuments?.map((doc) => (
            <div
              key={doc.id}
              className={`rounded-xl border transition-all duration-200 ${
                isDarkMode
                  ? 'bg-surface border-surface-muted'
                  : 'bg-white border-border'
              } ${
                selectedDoc === doc.id
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:shadow-md'
              }`}
            >
              {/* Document Header - Clickable */}
              <button
                onClick={() => handleView(doc.id)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>

                  {/* Document Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg truncate ${
                      isDarkMode ? 'text-white' : 'text-text-dark'
                    }`}>
                      {doc.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-text-light">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{doc.uploadedAt}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <HardDrive className="w-4 h-4" />
                        <span>{doc.size}</span>
                      </span>
                      <span className="font-medium">{doc.type}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)} capitalize`}>
                    {doc.status}
                  </span>
                  <Eye className={`w-5 h-5 transition-transform ${
                    selectedDoc === doc.id ? 'rotate-180' : ''
                  } ${isDarkMode ? 'text-text-muted' : 'text-text-light'}`} />
                </div>
              </button>

              {/* Expanded Details */}
              {selectedDoc === doc.id && (
                <div className={`border-t px-6 py-4 ${
                  isDarkMode ? 'border-surface-muted bg-surface-muted/20' : 'border-border bg-gray-50'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Document Preview Info */}
                    <div className="space-y-2">
                      <p className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-light'}`}>
                        Document ready for viewing and download
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-text-muted">
                        <span>ID: {doc.id}</span>
                        <span>•</span>
                        <span>Uploaded: {doc.uploadedAt}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleDownload(doc.id, doc.name)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span className="font-medium">Download</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="flex items-center space-x-2 px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-all duration-200 border border-error/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentPage;