import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Uploads a document file to the backend API.
 * @param file - The file to be uploaded.
 * @returns A promise that resolves to the newly created Document object.
 */
const uploadDocument = async (file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file); // The key 'file' must match what the backend endpoint expects.

  const response = await fetch(`${API_BASE_URL}/documents/`, {
    method: 'POST',
    body: formData,
    // Note: Do not set the 'Content-Type' header manually when using FormData with fetch.
    // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || `Failed to upload document. Status: ${response.status}`);
  }

  return response.json();
};

/**
 * A React Query hook for uploading a new document.
 * Handles the mutation state (loading, error, success) and updates the
 * documents list in the cache upon successful upload.
 */
export const useUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<Document, Error, File>({
    mutationFn: uploadDocument,
    onSuccess: (newDocument) => {
      // Invalidate and refetch to ensure data is fresh.
      // queryClient.invalidateQueries({ queryKey: ['documents'] });

      // Or, for a more optimistic/immediate UI update:
      // Manually update the query cache with the new document.
      queryClient.setQueryData<Document[]>(['documents'], (oldDocuments = []) => [
        newDocument,
        ...oldDocuments,
      ]);
    },
    onError: (error) => {
      // Optional: Handle upload errors, e.g., show a toast notification.
      console.error("Upload failed:", error.message);
    }
  });
};