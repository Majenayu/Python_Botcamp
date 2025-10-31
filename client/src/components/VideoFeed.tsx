import { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface VideoFeedProps {
  onHandDetected?: (landmarks: any) => void;
  isRecognizing: boolean;
}

export default function VideoFeed({ onHandDetected, isRecognizing }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          setPermissionDenied(false);
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        setPermissionDenied(true);
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isRecognizing && cameraActive) {
      const interval = setInterval(() => {
        setConfidence(Math.random() * 100);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isRecognizing, cameraActive]);

  return (
    <Card className="overflow-hidden">
      <div className="relative bg-black aspect-video">
        {permissionDenied ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
            <CameraOff className="w-16 h-16 text-muted-foreground" />
            <div className="text-center px-4">
              <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
              <p className="text-sm text-muted-foreground">
                Please grant camera permission to use sign language recognition
              </p>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => window.location.reload()}
              data-testid="button-reload-camera"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              data-testid="video-feed"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              data-testid="canvas-overlay"
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-muted-foreground animate-pulse" />
              </div>
            )}
          </>
        )}
      </div>
      
      {cameraActive && isRecognizing && (
        <div className="p-4 border-t border-card-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Detection Confidence</span>
            <span className="text-sm font-mono font-medium" data-testid="text-confidence">
              {confidence.toFixed(0)}%
            </span>
          </div>
          <Progress value={confidence} className="h-2" data-testid="progress-confidence" />
        </div>
      )}
    </Card>
  );
}
