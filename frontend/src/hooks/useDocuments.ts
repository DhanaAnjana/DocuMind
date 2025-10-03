// hooks/useDocuments.ts
import { useQuery } from '@tanstack/react-query';

export interface Document {
  id: string;
  name: string;
  status: 'queued' | 'processing' | 'processed' | 'error';
  uploadedAt: string;
  size: string;
  type: string;
}

// Mock API function - replace with actual API call
const fetchDocuments = async (): Promise<Document[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { id: '1', name: 'Contract_2024.pdf', status: 'processed', uploadedAt: '2023-10-12', size: '2.4 MB', type: 'PDF' },
    { id: '2', name: 'Invoice_Jan.pdf', status: 'processing', uploadedAt: '2023-10-10', size: '1.2 MB', type: 'PDF' },
    { id: '3', name: 'Report_01.pdf', status: 'queued', uploadedAt: '2023-10-08', size: '3.7 MB', type: 'PDF' },
    { id: '4', name: 'Financial_Report_Q3.pdf', status: 'processed', uploadedAt: '2023-10-05', size: '4.1 MB', type: 'PDF' },
    { id: '5', name: 'Agreement.docx', status: 'error', uploadedAt: '2023-10-01', size: '0.8 MB', type: 'DOCX' },
  ];
};

export const useDocuments = () => {
  return useQuery<Document[], Error>({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });
};