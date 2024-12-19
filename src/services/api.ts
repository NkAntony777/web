import axios from 'axios';
import { API_BASE_URL, STYLE_MODEL_PATHS } from '../config';
import { StyleOption, StyleTransferResponse } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large files
});

export const uploadAndStyleTransfer = async (
  file: File,
  style: StyleOption
): Promise<StyleTransferResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('style_model', STYLE_MODEL_PATHS[style]);

    const response = await api.post<StyleTransferResponse>(
      '/style-transfer',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 100)
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to process style transfer');
    }
    throw error;
  }
};

export const getAvailableStyles = async (): Promise<string[]> => {
  try {
    const response = await api.get<{ styles: string[] }>('/styles');
    return response.data.styles;
  } catch (error) {
    console.error('Failed to fetch available styles:', error);
    return Object.keys(STYLE_MODEL_PATHS);
  }
};