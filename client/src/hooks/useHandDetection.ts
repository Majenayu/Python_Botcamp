import { useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';

export interface HandLandmarks {
  keypoints: Array<{ x: number; y: number; z?: number; name?: string }>;
}

export function useHandDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isActive: boolean,
  onResults?: (hands: HandLandmarks[]) => void
) {
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null);
  const animationFrameRef = useRef<number>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initDetector = async () => {
      try {
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
          runtime: 'mediapipe',
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
          maxNumHands: 1,
          modelType: 'lite'
        };

        const detector = await handPoseDetection.createDetector(model, detectorConfig);
        
        if (mounted) {
          detectorRef.current = detector;
          setIsInitialized(true);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to initialize hand detector:', err);
        if (mounted) {
          setError('Failed to load hand detection model');
        }
      }
    };

    initDetector();

    return () => {
      mounted = false;
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive || !isInitialized || !detectorRef.current || !videoRef.current || !canvasRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const detectHands = async () => {
      if (!detectorRef.current || !video || video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(detectHands);
        return;
      }

      try {
        const hands = await detectorRef.current.estimateHands(video);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (hands.length > 0) {
          for (const hand of hands) {
            drawHand(ctx, hand, canvas.width, canvas.height);
          }
          
          if (onResults) {
            onResults(hands as HandLandmarks[]);
          }
        } else {
          if (onResults) {
            onResults([]);
          }
        }
      } catch (err) {
        console.error('Hand detection error:', err);
      }

      animationFrameRef.current = requestAnimationFrame(detectHands);
    };

    detectHands();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isInitialized, videoRef, canvasRef, onResults]);

  return { isInitialized, error };
}

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],      // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],      // Index
  [0, 9], [9, 10], [10, 11], [11, 12], // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17]             // Palm
];

function drawHand(
  ctx: CanvasRenderingContext2D,
  hand: handPoseDetection.Hand,
  width: number,
  height: number
) {
  // Draw connections
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;

  for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
    const start = hand.keypoints[startIdx];
    const end = hand.keypoints[endIdx];

    if (start && end) {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  // Draw keypoints
  for (let i = 0; i < hand.keypoints.length; i++) {
    const keypoint = hand.keypoints[i];
    
    ctx.fillStyle = i === 0 ? '#FF0000' : '#00FF00';
    ctx.beginPath();
    ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
