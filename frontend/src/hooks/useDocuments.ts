// hooks/useDocuments.ts
import { useQuery } from '@tanstack/react-query';

interface Chunk {
  content: string;
  chunk_index: number;
  embedding_id: string;
  id: number;
  document_id: number;
  created_at: string;
}

export interface Document {
  filename: string;
  content_type: string;
  id: number;
  file_path: string;
  created_at: string;
  updated_at: string;
  chunks: Chunk[];
}

const API_BASE_URL = 'http://localhost:8000';

const fetchDocuments = async (): Promise<Document[]> => {
  const response = await fetch(`${API_BASE_URL}/documents/`);
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  return response.json();
};

export const useDocuments = () => {
  return useQuery<Document[], Error>({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });
};