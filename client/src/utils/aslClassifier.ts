import { NormalizedLandmarkList } from '@mediapipe/hands';

export function classifyASLLetter(landmarks: NormalizedLandmarkList): string | null {
  if (!landmarks || landmarks.length !== 21) return null;

  const fingerStates = {
    thumb: isFingerExtended(landmarks, 1, 4),
    index: isFingerExtended(landmarks, 5, 8),
    middle: isFingerExtended(landmarks, 9, 12),
    ring: isFingerExtended(landmarks, 13, 16),
    pinky: isFingerExtended(landmarks, 17, 20)
  };

  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];
  const wrist = landmarks[0];
  const indexBase = landmarks[5];
  const middleBase = landmarks[9];

  if (allFingersClosed(fingerStates) && !fingerStates.thumb) {
    return 'A';
  }

  if (fingerStates.index && fingerStates.middle && fingerStates.ring && fingerStates.pinky && !fingerStates.thumb) {
    return 'B';
  }

  const handCurved = landmarks[8].y > landmarks[5].y &&
                     landmarks[12].y > landmarks[9].y &&
                     landmarks[16].y > landmarks[13].y;
  if (handCurved && !fingerStates.thumb) {
    return 'C';
  }

  if (fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    if (fingerStates.thumb) {
      return 'D';
    }
  }

  if (allFingersClosed(fingerStates) && fingerStates.thumb) {
    return 'E';
  }

  if (!fingerStates.index && fingerStates.middle && fingerStates.ring && fingerStates.pinky) {
    return 'F';
  }

  if (fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const pointingLeft = indexTip.x < wrist.x - 0.1;
    if (pointingLeft) {
      return 'G';
    }
  }

  if (fingerStates.index && fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const fingersHorizontal = Math.abs(indexTip.y - middleTip.y) < 0.05;
    if (fingersHorizontal) {
      return 'H';
    }
  }

  if (!fingerStates.index && !fingerStates.middle && !fingerStates.ring && fingerStates.pinky) {
    return 'I';
  }

  if (!fingerStates.index && !fingerStates.middle && !fingerStates.ring && fingerStates.pinky) {
    const pinkyHooked = pinkyTip.y < landmarks[19].y;
    if (pinkyHooked) {
      return 'J';
    }
  }

  if (fingerStates.index && fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const fingersSplit = Math.abs(indexTip.x - middleTip.x) > 0.1;
    if (fingersSplit) {
      return 'K';
    }
  }

  if (fingerStates.index && fingerStates.thumb && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const lShape = indexTip.y < indexBase.y && thumbTip.x > wrist.x;
    if (lShape) {
      return 'L';
    }
  }

  if (!fingerStates.index && !fingerStates.middle && !fingerStates.ring && fingerStates.thumb) {
    return 'M';
  }

  if (!fingerStates.index && !fingerStates.middle && fingerStates.thumb) {
    return 'N';
  }

  const oShape = distance2D(thumbTip, indexTip) < 0.05;
  if (oShape) {
    return 'O';
  }

  if (fingerStates.index && fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const pointingDown = indexTip.y > wrist.y && middleTip.y > wrist.y;
    if (pointingDown) {
      return 'P';
    }
  }

  if (fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const pointingDown = indexTip.y > wrist.y;
    if (pointingDown) {
      return 'Q';
    }
  }

  if (fingerStates.index && fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const fingersCrossed = Math.abs(indexTip.x - middleTip.x) < 0.03;
    if (fingersCrossed) {
      return 'R';
    }
  }

  if (allFingersClosed(fingerStates) && fingerStates.thumb) {
    return 'S';
  }

  if (fingerStates.thumb && !fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const thumbUp = thumbTip.y < wrist.y;
    if (thumbUp) {
      return 'T';
    }
  }

  if (fingerStates.index && fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const uShape = Math.abs(indexTip.x - middleTip.x) < 0.05;
    if (uShape) {
      return 'U';
    }
  }

  if (fingerStates.index && fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const vShape = Math.abs(indexTip.x - middleTip.x) > 0.08;
    if (vShape) {
      return 'V';
    }
  }

  if (fingerStates.index && fingerStates.middle && fingerStates.ring && !fingerStates.pinky) {
    return 'W';
  }

  if (allFingersClosed(fingerStates) && fingerStates.index) {
    const hookShape = indexTip.y > landmarks[6].y;
    if (hookShape) {
      return 'X';
    }
  }

  if (!fingerStates.index && !fingerStates.middle && !fingerStates.ring && fingerStates.pinky && fingerStates.thumb) {
    return 'Y';
  }

  if (fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky) {
    const zMotion = true;
    if (zMotion) {
      return 'Z';
    }
  }

  return null;
}

function isFingerExtended(landmarks: NormalizedLandmarkList, baseIdx: number, tipIdx: number): boolean {
  const base = landmarks[baseIdx];
  const tip = landmarks[tipIdx];
  const distance = Math.abs(tip.y - base.y);
  return distance > 0.1;
}

function allFingersClosed(fingerStates: { [key: string]: boolean }): boolean {
  return !fingerStates.index && !fingerStates.middle && !fingerStates.ring && !fingerStates.pinky;
}

function distance2D(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}
