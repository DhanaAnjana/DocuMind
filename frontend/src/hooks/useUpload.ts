// hooks/useUpload.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Document } from './useDocuments';

// Mock API function - replace with actual API call
const uploadDocument = async (file: File): Promise<Document> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    id: Date.now().toString(),
    name: file.name,
    status: 'queued',
    uploadedAt: new Date().toISOString().split('T')[0],
    size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    type: file.type || file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
  };
};

export const useUpload = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Document, Error, File>({
    mutationFn: uploadDocument,
    onSuccess: (newDocument) => {
      // Update the documents list with the new document
      queryClient.setQueryData<Document[]>(['documents'], (oldDocuments = []) => [
        newDocument,
        ...oldDocuments,
      ]);
    },
  });
};