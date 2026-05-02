import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Circle, Line } from '@shopify/react-native-skia';
import { PoseOverlay } from '../../components/PoseOverlay';
import type { Keypoint } from '../../lib/poseDecoder';

const makeSharedValue = <T>(val: T) => ({ value: val });

const kpAt = (x: number, y: number, score: number): Keypoint => ({ x, y, score });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PoseOverlay', () => {
  it('renders without crashing', () => {
    const kp = makeSharedValue<Keypoint[]>([]);
    const { toJSON } = render(<PoseOverlay keypoints={kp as any} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders a Canvas element', () => {
    const kp = makeSharedValue<Keypoint[]>([]);
    render(<PoseOverlay keypoints={kp as any} />);
    expect(screen.getByTestId('skia-canvas')).toBeTruthy();
  });

  it('renders no dots on initial mount (reaction fires asynchronously)', () => {
    const kp = makeSharedValue<Keypoint[]>([kpAt(0.5, 0.5, 0.9)]);
    render(<PoseOverlay keypoints={kp as any} />);
    // useAnimatedReaction is a no-op in the Reanimated mock
    expect(jest.mocked(Circle)).not.toHaveBeenCalled();
  });

  it('renders no skeleton lines on initial mount', () => {
    const kp = makeSharedValue<Keypoint[]>([kpAt(0.5, 0.5, 0.9)]);
    render(<PoseOverlay keypoints={kp as any} />);
    expect(jest.mocked(Line)).not.toHaveBeenCalled();
  });

  it('accepts low-confidence keypoints without crashing', () => {
    const kp = makeSharedValue<Keypoint[]>([kpAt(0.1, 0.1, 0.1), kpAt(0.9, 0.9, 0.0)]);
    expect(() => render(<PoseOverlay keypoints={kp as any} />)).not.toThrow();
  });

  it('does not show fps text on initial mount', () => {
    const kp = makeSharedValue<Keypoint[]>([]);
    render(<PoseOverlay keypoints={kp as any} />);
    expect(screen.queryByText(/fps/)).toBeNull();
  });
});
