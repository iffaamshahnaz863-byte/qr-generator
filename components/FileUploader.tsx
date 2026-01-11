
import React, { useCallback, useRef, useState } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string[];
  label: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  acceptedTypes,
  label,
  description,
  icon,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(dragging);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file && acceptedTypes.includes(file.type)) {
      onFileSelect(file);
    }
    // You might want to add an error message for invalid file types on drop
  }, [handleDragEvents, disabled, acceptedTypes, onFileSelect]);

  const baseClasses = "relative flex flex-col items-center justify-center w-full h-48 p-5 text-center transition-all duration-300 ease-in-out border-2 border-dashed rounded-lg";
  const stateClasses = disabled
    ? "bg-slate-100 border-slate-300 cursor-not-allowed text-slate-400"
    : isDragging
    ? "border-primary bg-indigo-50"
    : "border-slate-300 bg-white hover:border-primary hover:bg-indigo-50 cursor-pointer";

  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      onClick={handleClick}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div className="space-y-2">
          {icon}
          <p className="text-lg font-semibold text-slate-800">{label}</p>
          <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
};
