
import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2, Mail, MessageCircle, RefreshCw } from 'lucide-react';

interface QRCodeDisplayProps {
  qrValue: string;
  fileName: string;
  onReset: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrValue, fileName, onReset }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const pngUrl = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${fileName.split('.')[0]}-qr-code.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
  };
  
  const shareUrl = encodeURIComponent(qrValue);
  const shareText = encodeURIComponent(`Here is the file: ${fileName}`);

  const shareActions = [
    {
        name: 'WhatsApp',
        href: `https://wa.me/?text=${shareText}%20${shareUrl}`,
        icon: <MessageCircle className="h-5 w-5" />,
        color: 'bg-green-500 hover:bg-green-600'
    },
    {
        name: 'Telegram',
        href: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
        icon: <Share2 className="h-5 w-5" />,
        color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
        name: 'Email',
        href: `mailto:?subject=${shareText}&body=You can access the file here: ${shareUrl}`,
        icon: <Mail className="h-5 w-5" />,
        color: 'bg-slate-600 hover:bg-slate-700'
    }
  ];

  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-900">Your QR Code is Ready!</h2>
      <p className="mt-2 text-slate-600 max-w-md">Scan this code with your phone to instantly view <span className="font-semibold">{fileName}</span>.</p>
      
      <div ref={qrRef} className="mt-6 p-4 bg-white rounded-lg shadow-md border border-slate-200">
        <QRCodeCanvas
          value={qrValue}
          size={256}
          level="H" // High error correction
          bgColor="#FFFFFF" // White background
          fgColor="#000000" // Black foreground
        />
      </div>

      <button
        onClick={downloadQRCode}
        className="mt-8 flex items-center justify-center gap-2 w-full max-w-xs px-4 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <Download className="h-5 w-5" />
        Download QR Code
      </button>

      <div className="mt-6 w-full max-w-xs">
          <p className="text-sm font-medium text-slate-500 mb-3">Or share it directly:</p>
          <div className="flex justify-center space-x-3">
              {shareActions.map(action => (
                   <a 
                    key={action.name}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${action.name}`}
                    className={`flex items-center justify-center h-12 w-12 rounded-full text-white ${action.color} transition-transform hover:scale-110`}
                   >
                       {action.icon}
                   </a>
              ))}
          </div>
      </div>
      
      <button 
        onClick={onReset}
        className="mt-8 flex items-center gap-2 text-sm text-slate-600 hover:text-primary font-medium transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Convert another file
      </button>
    </div>
  );
};
