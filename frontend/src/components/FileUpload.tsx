// components/FileUpload.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ProgressBar from './ProgressBar';
import { useUpload } from '../hooks/useUpload';

const FileUpload: React.FC = () => {
  const { mutate: uploadFile, isLoading, progress } = useUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-accent bg-accent/5 scale-[1.02]' 
            : 'border-border hover:border-accent hover:bg-accent/5'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isLoading} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-text-dark text-lg">
              {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-text-light mt-1">or click to browse</p>
            <p className="text-sm text-text-light/70 mt-3">
              Supports PDF, DOC, DOCX • Max 10MB
            </p>
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="mt-6">
          <ProgressBar progress={progress || 0} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;