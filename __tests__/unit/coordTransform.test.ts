import { describe, it, expect } from 'vitest';
import { normalizedToScreen } from '../../lib/ml/coordTransform';

describe('normalizedToScreen', () => {
  describe('square frame on square canvas (no letterbox)', () => {
    const dims = { canvasWidth: 400, canvasHeight: 400, frameWidth: 100, frameHeight: 100 };

    it('maps center (0.5, 0.5) to canvas center', () => {
      const pt = normalizedToScreen(0.5, 0.5, dims, false);
      expect(pt.x).toBeCloseTo(200);
      expect(pt.y).toBeCloseTo(200);
    });

    it('maps top-left (0, 0) to canvas origin', () => {
      const pt = normalizedToScreen(0, 0, dims, false);
      expect(pt.x).toBeCloseTo(0);
      expect(pt.y).toBeCloseTo(0);
    });

    it('maps bottom-right (1, 1) to canvas far corner', () => {
      const pt = normalizedToScreen(1, 1, dims, false);
      expect(pt.x).toBeCloseTo(400);
      expect(pt.y).toBeCloseTo(400);
    });
  });

  describe('letterbox: wide frame (16:9) on square canvas', () => {
    // Frame 1600×900, canvas 400×400
    // scaledWidth=400, scaledHeight=225, offsetY=87.5, offsetX=0
    const dims = { canvasWidth: 400, canvasHeight: 400, frameWidth: 1600, frameHeight: 900 };

    it('maps center (0.5, 0.5) to canvas center', () => {
      const pt = normalizedToScreen(0.5, 0.5, dims, false);
      expect(pt.x).toBeCloseTo(200);
      expect(pt.y).toBeCloseTo(200);
    });

    it('top of frame (y=0) lands at letterbox offset, not y=0', () => {
      const pt = normalizedToScreen(0.5, 0, dims, false);
      expect(pt.y).toBeCloseTo(87.5);
    });

    it('bottom of frame (y=1) lands above canvas bottom', () => {
      const pt = normalizedToScreen(0.5, 1, dims, false);
      expect(pt.y).toBeCloseTo(312.5);
    });
  });

  describe('pillarbox: tall frame (9:16) on square canvas', () => {
    // Frame 900×1600, canvas 400×400
    // scaledHeight=400, scaledWidth=225, offsetX=87.5, offsetY=0
    const dims = { canvasWidth: 400, canvasHeight: 400, frameWidth: 900, frameHeight: 1600 };

    it('maps center (0.5, 0.5) to canvas center', () => {
      const pt = normalizedToScreen(0.5, 0.5, dims, false);
      expect(pt.x).toBeCloseTo(200);
      expect(pt.y).toBeCloseTo(200);
    });

    it('left edge (x=0) lands at pillarbox offset, not x=0', () => {
      const pt = normalizedToScreen(0, 0.5, dims, false);
      expect(pt.x).toBeCloseTo(87.5);
    });

    it('right edge (x=1) lands before canvas right edge', () => {
      const pt = normalizedToScreen(1, 0.5, dims, false);
      expect(pt.x).toBeCloseTo(312.5);
    });
  });

  describe('front camera x-mirror', () => {
    const dims = { canvasWidth: 400, canvasHeight: 400, frameWidth: 100, frameHeight: 100 };

    it('mirrors x=0.3 to x=0.7 on the canvas', () => {
      const pt = normalizedToScreen(0.3, 0.5, dims, true);
      expect(pt.x).toBeCloseTo(280); // (1 - 0.3) * 400 = 280
    });

    it('mirrors x=0.0 to x=1.0 (far right)', () => {
      const pt = normalizedToScreen(0, 0.5, dims, true);
      expect(pt.x).toBeCloseTo(400);
    });

    it('y is unaffected by front camera flag', () => {
      const withMirror = normalizedToScreen(0.5, 0.4, dims, true);
      const withoutMirror = normalizedToScreen(0.5, 0.4, dims, false);
      expect(withMirror.y).toBeCloseTo(withoutMirror.y);
    });
  });
});
