import type { Keypoint } from './ml/keypointParser';

export type { Keypoint };

// MoveNet outputs [y, x, score] per keypoint — this function swaps to {x, y}.
export function decodeMoveNetOutput(raw: Float32Array): Keypoint[] {
  if (!raw || raw.length !== 51) return [];

  const keypoints: Keypoint[] = [];
  for (let i = 0; i < 17; i++) {
    const base = i * 3;
    keypoints.push({
      x: raw[base + 1],
      y: raw[base],
      score: raw[base + 2],
    });
  }
  return keypoints;
}
