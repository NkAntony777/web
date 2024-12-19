import React from 'react';
import { Play, Loader2 } from 'lucide-react';

interface ProcessButtonProps {
  onClick: () => void;
  disabled: boolean;
  isProcessing: boolean;
}

export const ProcessButton: React.FC<ProcessButtonProps> = ({
  onClick,
  disabled,
  isProcessing,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isProcessing}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-md py-2 px-4 flex items-center justify-center space-x-2 transition-colors"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Play className="w-5 h-5" />
          <span>Apply Style Transfer</span>
        </>
      )}
    </button>
  );
};