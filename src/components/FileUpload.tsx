import React from 'react';
import { Upload } from 'lucide-react';
import { MediaType } from '../types';

interface FileUploadProps {
  preview: string | null;
  mediaType: MediaType;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  preview,
  mediaType,
  onFileSelect,
  fileInputRef,
}) => {
  return (
    <div 
      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={onFileSelect}
      />
      
      {preview ? (
        mediaType === 'image' ? (
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
        ) : (
          <video src={preview} className="max-h-48 mx-auto rounded" controls />
        )
      ) : (
        <div className="space-y-2">
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
          <p>Click or drag to upload an image or video</p>
        </div>
      )}
    </div>
  );
};