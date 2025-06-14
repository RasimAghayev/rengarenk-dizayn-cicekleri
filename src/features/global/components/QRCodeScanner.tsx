import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CameraOff, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeScannerProps {
  onScanResult: (result: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanResult }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setHasPermission(true);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setHasPermission(false);
      toast({
        title: "Kamera xətası",
        description: "Kameraya giriş alına bilmədi",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // Simulate QR code detection for demo
    const mockQRData = `https://example.com/product/${Math.random().toString(36).substr(2, 9)}`;
    onScanResult(mockQRData);
    toast({
      title: "QR kod tapıldı!",
      description: "Məlumat müvəffəqiyyətlə oxundu",
    });
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          QR Kod Skaneri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {isScanning ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/50">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-blue-500 rounded-lg"></div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          {!isScanning ? (
            <Button onClick={startCamera} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Skaner başlat
            </Button>
          ) : (
            <>
              <Button onClick={stopCamera} variant="outline" className="w-full">
                <CameraOff className="w-4 h-4 mr-2" />
                Skaneri dayandır
              </Button>
              <Button
                onClick={simulateQRScan}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Zap className="w-4 h-4 mr-2" />
                Test QR oxu
              </Button>
            </>
          )}
        </div>

        {hasPermission === false && (
          <div className="text-red-500 text-sm text-center">
            Kamera icazəsi tələb olunur
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default QRCodeScanner;
