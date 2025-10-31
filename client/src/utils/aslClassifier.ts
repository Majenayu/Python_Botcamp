interface Keypoint {
  x: number;
  y: number;
  z?: number;
  name?: string;
}

export function classifyASLLetter(keypoints: Keypoint[]): string | null {
  if (!keypoints || keypoints.length !== 21) return null;

  const fingerStates = {
    thumb: isFingerExtended(keypoints, 1, 4),
    index: isFingerExtended(keypoints, 5, 8),
    middle: isFingerExtended(keypoints, 9, 12),
    ring: isFingerExtended(keypoints, 13, 16),
    pinky: isFingerExtended(keypoints, 17, 20)
  };

  const thumbTip = keypoints[4];
  const indexTip = keypoints[8];
  const middleTip = keypoints[12];
  const ringTip = keypoints[16];
  const pinkyTip = keypoints[20];
  const wrist = keypoints[0];
  const indexBase = keypoints[5];
  const middleBase = keypoints[9];
  const thumbBase = keypoints[2];

  // A - Fist with thumb on the side
  if (!fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const thumbOnSide = thumbTip.x > wrist.x - 50 && thumbTip.y > thumbBase.y;
    if (thumbOnSide) return 'A';
  }

  // B - All fingers up except thumb
  if (fingerStates.index && fingerStates.middle && fingerStates.ring && fingerStates.pinky && !fingerStates.thumb) {
    const fingersClose = distance2D(indexTip, middleTip) < 30 &&
                         distance2D(middleTip, ringTip) < 30;
    if (fingersClose) return 'B';
  }

  // C - Hand curved like letter C
  if (!fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const curved = indexTip.x < indexBase.x && middleTip.x < middleBase.x;
    if (curved) return 'C';
  }

  // D - Index up, thumb and middle touching
  if (fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const thumbMiddleTouch = distance2D(thumbTip, keypoints[12]) < 40;
    if (thumbMiddleTouch) return 'D';
  }

  // E - All fingers bent down
  if (!fingerStates.thumb && !fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const allBent = indexTip.y > indexBase.y && middleTip.y > middleBase.y;
    if (allBent) return 'E';
  }

  // F - Index bent, other fingers up
  if (!fingerStates.index && fingerStates.middle && fingerStates.ring && fingerStates.pinky) {
    return 'F';
  }

  // I - Pinky up, others down
  if (!fingerStates.index && !fingerStates.middle && !fingerStates.ring && fingerStates.pinky) {
    if (!fingerStates.thumb) return 'I';
  }

  // L - Index and thumb up forming L
  if (fingerStates.index && fingerStates.thumb && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const lShape = Math.abs(indexTip.x - thumbTip.x) > 50;
    if (lShape) return 'L';
  }

  // O - Thumb and index touching in circle
  const oShape = distance2D(thumbTip, indexTip) < 30;
  if (oShape && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    return 'O';
  }

  // U - Index and middle up together
  if (fingerStates.index && fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const together = Math.abs(indexTip.x - middleTip.x) < 20;
    if (together) return 'U';
  }

  // V - Index and middle up apart (peace sign)
  if (fingerStates.index && fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const apart = Math.abs(indexTip.x - middleTip.x) > 40;
    if (apart) return 'V';
  }

  // W - Three fingers up
  if (fingerStates.index && fingerStates.middle && fingerStates.ring && !fingerStates.pinky) {
    return 'W';
  }

  // Y - Thumb and pinky extended
  if (fingerStates.thumb && !fingerStates.index && !fingerStates.middle && !fingerStates.ring && fingerStates.pinky) {
    return 'Y';
  }

  // Thumbs up - T
  if (fingerStates.thumb && !fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const thumbUp = thumbTip.y < wrist.y - 20;
    if (thumbUp) return 'T';
  }

  // Default fallback for common gestures
  if (fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    return 'G'; // Pointing
  }

  if (fingerStates.index && fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    return 'H'; // Two fingers together
  }

  return null;
}

function isFingerExtended(keypoints: Keypoint[], baseIdx: number, tipIdx: number): boolean {
  const base = keypoints[baseIdx];
  const tip = keypoints[tipIdx];
  const wrist = keypoints[0];
  
  // Check if tip is significantly above base
  const verticalDistance = Math.abs(tip.y - base.y);
  const isExtended = verticalDistance > 40 && tip.y < base.y + 10;
  
  return isExtended;
}

function distance2D(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}
