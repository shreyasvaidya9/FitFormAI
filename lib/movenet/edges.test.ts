import { describe, it, expect } from 'vitest';
import { EDGES } from './edges';

describe('EDGES', () => {
  it('has exactly 12 pairs', () => {
    expect(EDGES).toHaveLength(12);
  });

  it('all indices are in range [0, 16]', () => {
    for (const [a, b] of EDGES) {
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(16);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(16);
    }
  });

  it('has no self-loops', () => {
    for (const [a, b] of EDGES) {
      expect(a).not.toBe(b);
    }
  });

  it('has no duplicate pairs', () => {
    const keys = EDGES.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`);
    const unique = new Set(keys);
    expect(unique.size).toBe(EDGES.length);
  });

  it('covers all four limbs', () => {
    const flat = EDGES.flat();
    // left arm
    expect(flat).toContain(7); // left_elbow
    expect(flat).toContain(9); // left_wrist
    // right arm
    expect(flat).toContain(8); // right_elbow
    expect(flat).toContain(10); // right_wrist
    // left leg
    expect(flat).toContain(13); // left_knee
    expect(flat).toContain(15); // left_ankle
    // right leg
    expect(flat).toContain(14); // right_knee
    expect(flat).toContain(16); // right_ankle
  });
});
