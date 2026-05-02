import { describe, it, expect } from 'vitest';
import { normalizedToScreen } from './coordTransform';

const sq100: Parameters<typeof normalizedToScreen>[2] = {
  canvasWidth: 100,
  canvasHeight: 100,
  frameWidth: 1,
  frameHeight: 1,
};

describe('normalizedToScreen — square frame, square canvas', () => {
  it('maps center to canvas center', () => {
    const pt = normalizedToScreen(0.5, 0.5, sq100, false);
    expect(pt.x).toBeCloseTo(50);
    expect(pt.y).toBeCloseTo(50);
  });

  it('maps top-left corner', () => {
    const pt = normalizedToScreen(0, 0, sq100, false);
    expect(pt.x).toBeCloseTo(0);
    expect(pt.y).toBeCloseTo(0);
  });

  it('maps bottom-right corner', () => {
    const pt = normalizedToScreen(1, 1, sq100, false);
    expect(pt.x).toBeCloseTo(100);
    expect(pt.y).toBeCloseTo(100);
  });
});

describe('normalizedToScreen — front-camera mirroring', () => {
  it('mirrors x: left keypoint appears on right side', () => {
    const back = normalizedToScreen(0.2, 0.5, sq100, false);
    const front = normalizedToScreen(0.2, 0.5, sq100, true);
    expect(front.x).toBeCloseTo(100 - back.x);
  });

  it('does not affect y axis', () => {
    const back = normalizedToScreen(0.5, 0.3, sq100, false);
    const front = normalizedToScreen(0.5, 0.3, sq100, true);
    expect(front.y).toBeCloseTo(back.y);
  });
});

describe('normalizedToScreen — letterbox (wide frame, square canvas)', () => {
  const dims = { canvasWidth: 100, canvasHeight: 100, frameWidth: 2, frameHeight: 1 };

  it('has no horizontal offset', () => {
    const pt = normalizedToScreen(0, 0, dims, false);
    expect(pt.x).toBeCloseTo(0);
  });

  it('has vertical offset (bars top and bottom)', () => {
    const pt = normalizedToScreen(0, 0, dims, false);
    expect(pt.y).toBeGreaterThan(0);
  });

  it('maps center to canvas center', () => {
    const pt = normalizedToScreen(0.5, 0.5, dims, false);
    expect(pt.x).toBeCloseTo(50);
    expect(pt.y).toBeCloseTo(50);
  });
});

describe('normalizedToScreen — pillarbox (tall frame, square canvas)', () => {
  const dims = { canvasWidth: 100, canvasHeight: 100, frameWidth: 1, frameHeight: 2 };

  it('has horizontal offset (bars left and right)', () => {
    const pt = normalizedToScreen(0, 0, dims, false);
    expect(pt.x).toBeGreaterThan(0);
  });

  it('has no vertical offset', () => {
    const pt = normalizedToScreen(0, 0, dims, false);
    expect(pt.y).toBeCloseTo(0);
  });

  it('maps center to canvas center', () => {
    const pt = normalizedToScreen(0.5, 0.5, dims, false);
    expect(pt.x).toBeCloseTo(50);
    expect(pt.y).toBeCloseTo(50);
  });
});
