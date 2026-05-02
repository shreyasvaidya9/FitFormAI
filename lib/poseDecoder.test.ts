import { describe, it, expect } from 'vitest';
import { decodeMoveNetOutput } from './poseDecoder';

describe('decodeMoveNetOutput', () => {
  it('returns 17 keypoints from a valid Float32Array of length 51', () => {
    const raw = new Float32Array(51).fill(0);
    expect(decodeMoveNetOutput(raw)).toHaveLength(17);
  });

  it('swaps y/x correctly — MoveNet outputs [y, x, score] per keypoint', () => {
    const raw = new Float32Array(51).fill(0);
    raw[0] = 0.3; // y
    raw[1] = 0.7; // x
    raw[2] = 0.9; // score
    const kp = decodeMoveNetOutput(raw)[0];
    expect(kp.x).toBeCloseTo(0.7);
    expect(kp.y).toBeCloseTo(0.3);
    expect(kp.score).toBeCloseTo(0.9);
  });

  it('correctly decodes the 17th keypoint (right ankle, index 16)', () => {
    const raw = new Float32Array(51).fill(0);
    raw[48] = 0.6; // y
    raw[49] = 0.4; // x
    raw[50] = 0.8; // score
    const kp = decodeMoveNetOutput(raw)[16];
    expect(kp.x).toBeCloseTo(0.4);
    expect(kp.y).toBeCloseTo(0.6);
    expect(kp.score).toBeCloseTo(0.8);
  });

  it('preserves score values exactly — no filtering applied', () => {
    const raw = new Float32Array(51).fill(0);
    raw[2] = 0.05;  // very low score — must still be returned
    raw[5] = 0.95;
    const result = decodeMoveNetOutput(raw);
    expect(result[0].score).toBeCloseTo(0.05);
    expect(result[1].score).toBeCloseTo(0.95);
  });

  it('returns empty array for input length < 51', () => {
    expect(decodeMoveNetOutput(new Float32Array(50))).toEqual([]);
    expect(decodeMoveNetOutput(new Float32Array(0))).toEqual([]);
  });

  it('returns empty array for input length > 51', () => {
    expect(decodeMoveNetOutput(new Float32Array(52))).toEqual([]);
  });

  it('keeps coordinates in normalized 0–1 range when input is valid', () => {
    const raw = new Float32Array(51);
    for (let i = 0; i < 17; i++) {
      raw[i * 3] = 0.5;
      raw[i * 3 + 1] = 0.5;
      raw[i * 3 + 2] = 0.8;
    }
    decodeMoveNetOutput(raw).forEach(kp => {
      expect(kp.x).toBeGreaterThanOrEqual(0);
      expect(kp.x).toBeLessThanOrEqual(1);
      expect(kp.y).toBeGreaterThanOrEqual(0);
      expect(kp.y).toBeLessThanOrEqual(1);
    });
  });
});
