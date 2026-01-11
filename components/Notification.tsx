
import React from 'react';
import { XCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'error' | 'success';
  onDismiss: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onDismiss }) => {
  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
  const borderColor = isError ? 'border-red-400' : 'border-green-400';
  const textColor = isError ? 'text-red-800' : 'text-green-800';
  const iconColor = isError ? 'text-red-500' : 'text-green-500';

  return (
    <div className={`border-l-4 ${borderColor} ${bgColor} p-4 rounded-md shadow-md animate-fade-in`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircle className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 ${textColor} focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <button 
        onClick={onDismiss}
        className={`mt-4 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isError ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
      >
        Try Again
      </button>
    </div>
  );
};
