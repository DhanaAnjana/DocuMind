// pages/DocumentPage.tsx
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDocuments } from '../hooks/useDocuments';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileText, Download, Trash2, Eye, Calendar, Book } from 'lucide-react';

const DocumentPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const isDarkMode = currentTheme.id === 'dark';
  const { data: documents, isLoading, error } = useDocuments();

  // State for selected document now uses number for ID
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  // Updated function signatures to expect number for docId
  const handleDownload = (docId: number, filename: string) => {
    console.log('Downloading document:', docId, filename);
    // TODO: Implement actual download from backend
    alert(`Downloading ${filename}...`);
  };

  const handleDelete = (docId: number, filename: string) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      console.log('Deleting document:', docId);
      // TODO: Implement actual delete API call
      alert(`Deleting ${filename}...`);
    }
  };

  const handleView = (docId: number) => {
    setSelectedDoc(selectedDoc === docId ? null : docId);
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
        
        {/* Filter buttons were removed as the `status` field is no longer available in the Document interface. */}
      </div>

      {/* Documents List */}
      {documents?.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No documents found"
          description={'Upload your first document to get started'}
        />
      ) : (
        <div className="space-y-3">
          {documents?.map((doc) => (
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
                      {/* Changed from doc.name to doc.filename */}
                      {doc.filename}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-text-light">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        {/* Changed from doc.uploadedAt to formatted doc.created_at */}
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        {/* Replaced 'size' with 'chunk count' using available data */}
                        <Book className="w-4 h-4" />
                        <span>{doc.chunks.length} chunks</span>
                      </span>
                      {/* Changed from doc.type to doc.content_type */}
                      <span className="font-medium">{doc.content_type}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge removed, icon remains */}
                <div className="flex items-center space-x-3">
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
                        {/* Display numeric ID */}
                        <span>ID: {doc.id}</span>
                        <span>•</span>
                        {/* Use `created_at` with more detailed formatting */}
                        <span>Uploaded: {new Date(doc.created_at).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleDownload(doc.id, doc.filename)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span className="font-medium">Download</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.filename)}
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