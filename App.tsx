
import React, { useState, useCallback } from 'react';
import { FileUploader } from './components/FileUploader';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { Spinner } from './components/Spinner';
import { Notification } from './components/Notification';
import { uploadFile } from './services/storageService';
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPES, MAX_FILE_SIZE } from './constants';
import { FileCode, Image, FileText, X } from 'lucide-react';

type AppState = 'idle' | 'uploading' | 'success' | 'error';
export type FileCategory = 'image' | 'pdf';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [qrValue, setQrValue] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileUpload = useCallback(async (file: File, category: FileCategory) => {
    // 1. Validation
    const acceptedTypes = category === 'image' ? ACCEPTED_IMAGE_TYPES : ACCEPTED_PDF_TYPES;
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload a ${category}.`);
      setAppState('error');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      setAppState('error');
      return;
    }

    // 2. Start upload process
    setAppState('uploading');
    setError('');
    setFileName(file.name);

    try {
      // 3. Call storage service to upload file and record in database
      const fileUrl = await uploadFile(file, category);
      setQrValue(fileUrl);
      setAppState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Upload failed: ${message}`);
      setAppState('error');
    }
  }, []);

  const resetState = () => {
    setAppState('idle');
    setQrValue('');
    setError('');
    setFileName('');
  };

  const renderContent = () => {
    switch (appState) {
      case 'uploading':
        return (
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-lg text-slate-600 font-medium">Uploading {fileName}...</p>
            <p className="text-slate-500">Please wait, generating your QR code.</p>
          </div>
        );
      case 'success':
        return <QRCodeDisplay qrValue={qrValue} fileName={fileName} onReset={resetState} />;
      case 'error':
        return (
          <Notification message={error} type="error" onDismiss={resetState} />
        );
      case 'idle':
      default:
        return (
          <>
            <div className="text-center">
              <FileCode className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">File to QR Code Converter</h1>
              <p className="mt-4 text-lg text-slate-600">Instantly convert your images and PDFs into a shareable QR code.</p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <FileUploader
                onFileSelect={(file) => handleFileUpload(file, 'image')}
                acceptedTypes={ACCEPTED_IMAGE_TYPES}
                label="Upload Image"
                description="Supports JPG, PNG, WEBP. Max 10MB."
                icon={<Image className="h-8 w-8 text-primary" />}
              />
              <FileUploader
                onFileSelect={(file) => handleFileUpload(file, 'pdf')}
                acceptedTypes={ACCEPTED_PDF_TYPES}
                label="Upload PDF"
                description="Supports PDF. Max 10MB."
                icon={<FileText className="h-8 w-8 text-secondary" />}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-300">
          {renderContent()}
        </div>
      </main>
      <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} QR Code File Converter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
