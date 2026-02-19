import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { X, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { QrReader } from 'react-qr-reader';

interface QRScannerProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

export default function QRScanner({ onClose, onScan }: QRScannerProps) {
  const [, setLocation] = useLocation();
  const [hasCamera, setHasCamera] = useState(true);
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async (result: any) => {
    if (result?.text) {
      const qrData = result.text;
      console.log('[QR Scanner] Scanned data:', qrData);
      
      setIsScanning(false);
      setIsLoading(true);

      try {
        // Call onScan callback if provided
        if (onScan) {
          onScan(qrData);
        }

        // Parse QR code data and navigate
        if (qrData.includes('/user/')) {
          // User profile QR code
          const username = qrData.split('/user/')[1];
          toast.success(`Navigating to profile: ${username}`);
          setTimeout(() => {
            setLocation(`/profile/${username}`);
            onClose();
          }, 500);
        } else if (qrData.includes('/artwork/')) {
          // Artwork QR code
          const artworkId = qrData.split('/artwork/')[1];
          toast.success(`Navigating to artwork: ${artworkId}`);
          setTimeout(() => {
            setLocation(`/artwork/${artworkId}`);
            onClose();
          }, 500);
        } else if (qrData.includes('http')) {
          // External URL
          toast.success('Opening URL...');
          window.open(qrData, '_blank');
          setTimeout(() => {
            onClose();
          }, 500);
        } else {
          // Generic data
          toast.info(`QR Code: ${qrData}`);
          console.log('[QR Scanner] QR data:', qrData);
        }
      } catch (error) {
        console.error('[QR Scanner] Error processing QR code:', error);
        toast.error('Failed to process QR code');
        setIsScanning(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('[QR Scanner] Camera error:', error);
    setHasCamera(false);
    toast.error('Camera access denied. Please enable camera permissions.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Camera size={20} />
            Scan QR Code
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Camera View */}
        <div className="p-4">
          {hasCamera ? (
            <div className="relative bg-black rounded-lg overflow-hidden">
              {isScanning && (
                <QrReader
                  onResult={handleScan}
                  constraints={{ facingMode: 'environment' }}
                  containerStyle={{ width: '100%', height: '256px' }}
                  videoContainerStyle={{ paddingBottom: 0 }}
                />
              )}

              {isLoading && (
                <div className="w-full h-64 flex items-center justify-center bg-black">
                  <div className="text-center">
                    <Loader2 size={48} className="text-white animate-spin mx-auto mb-4" />
                    <p className="text-white text-sm">Processing QR code...</p>
                  </div>
                </div>
              )}

              {/* QR Frame Overlay */}
              {isScanning && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-4 border-green-500 rounded-lg opacity-75"></div>
                </div>
              )}

              {/* Scanning Indicator */}
              {isScanning && !isLoading && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                    Scanning...
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Camera size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Camera access is required to scan QR codes.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Please enable camera permissions in your browser settings.
              </p>
              <Button
                onClick={onClose}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 border-t border-gray-200 rounded-b-lg">
          <p className="text-sm text-gray-700">
            📱 Point your camera at a QR code to scan it. The code will automatically navigate to the profile or artwork.
          </p>
        </div>
      </div>
    </div>
  );
}
