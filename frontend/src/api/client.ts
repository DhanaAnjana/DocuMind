// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Document {
  id: number;
  filename: string;
  content_type: string;
  file_path: string;
  status: 'queued' | 'processing' | 'processed' | 'error';
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  id: number;
  filename: string;
  status: string;
  message?: string;
}

export interface QueryRequest {
  query: string;
  limit?: number;
}

export interface QueryResponse {
  answer: string;
  sources: Array<{
    content: string;
    document_id: number;
    chunk_id: number;
    score: number;
  }>;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Document APIs
  async uploadDocument(file: File, onProgress?: (progress: number) => void): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

      xhr.open('POST', `${this.baseURL}/api/documents/upload`);
      xhr.send(formData);
    });
  }

  async getDocuments(status?: string): Promise<Document[]> {
    const url = status && status !== 'all'
      ? `${this.baseURL}/api/documents?status=${status}`
      : `${this.baseURL}/api/documents`;
    
    const response = await fetch(url);
    return this.handleResponse<Document[]>(response);
  }

  async getDocument(id: number): Promise<Document> {
    const response = await fetch(`${this.baseURL}/api/documents/${id}`);
    return this.handleResponse<Document>(response);
  }

  async downloadDocument(id: number, filename: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/documents/${id}/download`);
    if (!response.ok) {
      throw new Error('Download failed');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  async deleteDocument(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/documents/${id}`, {
      method: 'DELETE',
    });
    return this.handleResponse<void>(response);
  }

  // Query API
  async queryDocuments(query: string, limit: number = 5): Promise<QueryResponse[]> {
    const response = await fetch(`${this.baseURL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, limit }),
    });
    return this.handleResponse<QueryResponse[]>(response);
  }

  // Stats API
  async getStats(): Promise<{
    total: number;
    processed: number;
    processing: number;
    errors: number;
  }> {
    const response = await fetch(`${this.baseURL}/api/stats`);
    return this.handleResponse<any>(response);
  }
}

export const apiClient = new APIClient();