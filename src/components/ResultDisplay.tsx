import React from 'react';
import { Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { MediaType } from '../types';

interface ResultDisplayProps {
  result: string | null;
  mediaType: MediaType;
  isProcessing: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  mediaType,
  isProcessing,
}) => {
  return (
    <div className="border-2 border-gray-600 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
      {result ? (
        mediaType === 'image' ? (
          <img src={result} alt="Stylized result" className="max-h-48 mx-auto rounded" />
        ) : (
          <video src={result} className="max-h-48 mx-auto rounded" controls />
        )
      ) : (
        <div className="text-gray-400">
          {isProcessing ? (
            <div className="space-y-2">
              <Loader2 className="w-12 h-12 mx-auto animate-spin" />
              <p>Processing your {mediaType}...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mediaType === 'image' ? (
                <ImageIcon className="w-12 h-12 mx-auto" />
              ) : mediaType === 'video' ? (
                <Video className="w-12 h-12 mx-auto" />
              ) : (
                <div className="w-12 h-12 mx-auto" />
              )}
              <p>Stylized output will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};