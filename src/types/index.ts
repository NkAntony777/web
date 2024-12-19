export type MediaType = 'image' | 'video' | null;
export type StyleOption = 'Cuphead' | 'Starry Night' | 'Mosaic';

export interface StyleTransferResponse {
  url: string;
  success: boolean;
  error?: string;
}