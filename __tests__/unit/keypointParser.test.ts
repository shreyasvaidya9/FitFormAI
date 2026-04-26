import { describe, it, expect } from 'vitest';
import { parseMoveNetOutput } from '../../lib/ml/keypointParser';

function makeOutput(values: number[]): Float32Array {
  return new Float32Array(values);
}

describe('parseMoveNetOutput', () => {
  describe('invalid input', () => {
    it('returns null for empty array', () => {
      expect(parseMoveNetOutput(makeOutput([]))).toBeNull();
    });

    it('returns null for array shorter than 51', () => {
      expect(parseMoveNetOutput(makeOutput(new Array(50).fill(0)))).toBeNull();
    });

    it('returns null for array longer than 51', () => {
      expect(parseMoveNetOutput(makeOutput(new Array(52).fill(0)))).toBeNull();
    });
  });

  describe('valid input', () => {
    it('returns a Pose with all 17 keypoints', () => {
      const input = makeOutput(new Array(51).fill(0));
      const pose = parseMoveNetOutput(input);
      expect(pose).not.toBeNull();
      expect(Object.keys(pose!)).toHaveLength(17);
    });

    it('swaps MoveNet y,x order to {x, y}', () => {
      // MoveNet: [y=0.3, x=0.7, score=0.9] for nose (index 0)
      const input = new Float32Array(51).fill(0);
      input[0] = 0.3; // y
      input[1] = 0.7; // x
      input[2] = 0.9; // score

      const pose = parseMoveNetOutput(input);
      expect(pose!.nose.x).toBeCloseTo(0.7);
      expect(pose!.nose.y).toBeCloseTo(0.3);
      expect(pose!.nose.score).toBeCloseTo(0.9);
    });

    it('correctly parses the last keypoint (right_ankle, index 16)', () => {
      const input = new Float32Array(51).fill(0);
      input[48] = 0.8; // y
      input[49] = 0.2; // x
      input[50] = 0.6; // score

      const pose = parseMoveNetOutput(input);
      expect(pose!.right_ankle.x).toBeCloseTo(0.2);
      expect(pose!.right_ankle.y).toBeCloseTo(0.8);
      expect(pose!.right_ankle.score).toBeCloseTo(0.6);
    });

    it('correctly parses a mid-range keypoint (left_hip, index 11)', () => {
      const input = new Float32Array(51).fill(0);
      input[33] = 0.55; // y
      input[34] = 0.45; // x
      input[35] = 0.75; // score

      const pose = parseMoveNetOutput(input);
      expect(pose!.left_hip.x).toBeCloseTo(0.45);
      expect(pose!.left_hip.y).toBeCloseTo(0.55);
      expect(pose!.left_hip.score).toBeCloseTo(0.75);
    });

    it('preserves normalized coordinate range (0–1)', () => {
      const input = new Float32Array(51).fill(0);
      input[0] = 1.0;
      input[1] = 0.0;
      input[2] = 1.0;

      const pose = parseMoveNetOutput(input);
      expect(pose!.nose.x).toBeCloseTo(0.0);
      expect(pose!.nose.y).toBeCloseTo(1.0);
    });
  });
});
