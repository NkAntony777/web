import React, { useState, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { MediaType, StyleOption } from './types';
import { uploadAndStyleTransfer } from './services/api';
import { FileUpload } from './components/FileUpload';
import { StyleSelector } from './components/StyleSelector';
import { ProcessButton } from './components/ProcessButton';
import { ResultDisplay } from './components/ResultDisplay';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>('Cuphead');
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Determine media type
    setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
  };

  const handleStyleTransfer = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      const response = await uploadAndStyleTransfer(selectedFile, selectedStyle);
      
      if (response.success) {
        setResult(response.url);
        toast.success('Style transfer completed successfully!');
      } else {
        throw new Error(response.error || 'Failed to process style transfer');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Neural Style Transfer</h1>
          <p className="text-gray-400">Transform your images and videos with AI-powered style transfer</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Input</h2>
              
              <div className="space-y-4">
                <FileUpload
                  preview={preview}
                  mediaType={mediaType}
                  onFileSelect={handleFileSelect}
                  fileInputRef={fileInputRef}
                />
                
                <StyleSelector
                  value={selectedStyle}
                  onChange={(value) => setSelectedStyle(value)}
                />

                <ProcessButton
                  onClick={handleStyleTransfer}
                  disabled={!selectedFile}
                  isProcessing={isProcessing}
                />
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Output</h2>
              <ResultDisplay
                result={result}
                mediaType={mediaType}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;