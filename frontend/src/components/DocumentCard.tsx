// components/DocumentCard.tsx
import React from 'react';
import Button from './Button';

interface Document {
  id: string;
  name: string;
  status: 'queued' | 'processing' | 'processed' | 'error';
  uploadedAt: string;
  size: string;
  type: string;
}

interface DocumentCardProps {
  document: Document;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onView, onDownload }) => {
  const statusConfig = {
    queued: { color: 'bg-warning/20 text-warning', icon: '⏳' },
    processing: { color: 'bg-accent/20 text-accent', icon: '🔄' },
    processed: { color: 'bg-success/20 text-success', icon: '✅' },
    error: { color: 'bg-error/20 text-error', icon: '❌' },
  };

  const { color, icon } = statusConfig[document.status];

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-lg">📄</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-dark truncate">{document.name}</h3>
            <div className="flex items-center space-x-3 mt-1 text-sm text-text-light">
              <span>{document.uploadedAt}</span>
              <span>•</span>
              <span>{document.size}</span>
              <span>•</span>
              <span className="font-medium">{document.type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${color} flex items-center space-x-1`}>
              <span>{icon}</span>
              <span className="capitalize">{document.status}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView?.(document.id)}
              className="!p-2"
            >
              👁️
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload?.(document.id)}
              className="!p-2"
            >
              ↓
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;