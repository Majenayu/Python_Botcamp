import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export function useHandDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isActive: boolean,
  onResults?: (results: Results) => void
) {
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results: Results) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(ctx, landmarks, canvas.width, canvas.height);
          drawLandmarks(ctx, landmarks, canvas.width, canvas.height);
        }
      }

      ctx.restore();

      if (onResults) {
        onResults(results);
      }
    });

    handsRef.current = hands;

    if (videoRef.current.readyState >= 2) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720
      });

      camera.start();
      cameraRef.current = camera;
      setIsInitialized(true);
    } else {
      videoRef.current.addEventListener('loadeddata', () => {
        if (!videoRef.current) return;
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720
        });

        camera.start();
        cameraRef.current = camera;
        setIsInitialized(true);
      });
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [videoRef, canvasRef]);

  return { isInitialized };
}

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17]
];

function drawConnectors(
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  width: number,
  height: number
) {
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;

  for (const connection of HAND_CONNECTIONS) {
    const [startIdx, endIdx] = connection;
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];

    ctx.beginPath();
    ctx.moveTo(start.x * width, start.y * height);
    ctx.lineTo(end.x * width, end.y * height);
    ctx.stroke();
  }
}

function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  width: number,
  height: number
) {
  for (let i = 0; i < landmarks.length; i++) {
    const landmark = landmarks[i];
    
    ctx.fillStyle = i === 0 ? '#FF0000' : '#00FF00';
    ctx.beginPath();
    ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
