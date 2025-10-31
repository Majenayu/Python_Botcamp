import { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHandDetection } from '@/hooks/useHandDetection';
import { classifyASLLetter } from '@/utils/aslClassifier';
import { Results } from '@mediapipe/hands';

interface VideoFeedProps {
  onLetterDetected?: (letter: string) => void;
  isRecognizing: boolean;
}

export default function VideoFeed({ onLetterDetected, isRecognizing }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [detectedLetter, setDetectedLetter] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const lastDetectionTime = useRef<number>(0);
  const detectionCount = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' }
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
    if (canvasRef.current && videoRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth || 1280;
      canvasRef.current.height = videoRef.current.videoHeight || 720;
    }
  }, [cameraActive]);

  const handleResults = (results: Results) => {
    if (!isRecognizing) {
      setHandDetected(false);
      setDetectedLetter(null);
      return;
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      const landmarks = results.multiHandLandmarks[0];
      const letter = classifyASLLetter(landmarks);
      
      if (letter) {
        setDetectedLetter(letter);
        
        const currentCount = detectionCount.current.get(letter) || 0;
        detectionCount.current.set(letter, currentCount + 1);
        
        const confidenceLevel = Math.min((currentCount + 1) * 10, 100);
        setConfidence(confidenceLevel);
        
        if (currentCount >= 15) {
          const now = Date.now();
          if (now - lastDetectionTime.current > 1500) {
            if (onLetterDetected) {
              onLetterDetected(letter);
            }
            lastDetectionTime.current = now;
            detectionCount.current.clear();
          }
        }
      } else {
        setDetectedLetter(null);
        setConfidence(0);
      }
    } else {
      setHandDetected(false);
      setDetectedLetter(null);
      setConfidence(0);
      detectionCount.current.clear();
    }
  };

  useHandDetection(videoRef, canvasRef, isRecognizing, handleResults);

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
              className="w-full h-full object-cover scale-x-[-1]"
              data-testid="video-feed"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none scale-x-[-1]"
              data-testid="canvas-overlay"
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-muted-foreground animate-pulse" />
              </div>
            )}
            
            {isRecognizing && (
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${handDetected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                    {handDetected ? 'Hand Detected' : 'No Hand'}
                  </span>
                </div>
                
                {detectedLetter && (
                  <Badge className="text-2xl font-bold px-4 py-2 bg-primary" data-testid="badge-detected-letter">
                    {detectedLetter}
                  </Badge>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {cameraActive && isRecognizing && (
        <div className="p-4 border-t border-card-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {detectedLetter ? `Detecting "${detectedLetter}"` : 'Hold hand steady to detect'}
            </span>
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
