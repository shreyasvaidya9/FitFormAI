import { KEYPOINT_NAMES, type KeypointName } from '../constants/keypoints';

export interface Keypoint {
  x: number;
  y: number;
  score: number;
}

export type Pose = Record<KeypointName, Keypoint>;

export interface PoseFrame {
  pose: Pose | null;
  timestamp: number;
  frameWidth: number;
  frameHeight: number;
}

// MoveNet outputs [y, x, score] per keypoint — swap to {x, y} convention.
export function parseMoveNetOutput(output: Float32Array): Pose | null {
  if (!output || output.length !== 51) {
    return null;
  }

  const pose = {} as Pose;

  for (let i = 0; i < 17; i++) {
    const base = i * 3;
    pose[KEYPOINT_NAMES[i]] = {
      x: output[base + 1],
      y: output[base],
      score: output[base + 2],
    };
  }

  return pose;
}
