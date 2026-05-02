import { renderHook } from '@testing-library/react-native';
import { useFrameOutput } from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { usePoseDetection } from '../../hooks/usePoseDetection';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('usePoseDetection', () => {
  it('returns a frameOutput object', () => {
    const { result } = renderHook(() => usePoseDetection());
    expect(result.current.frameOutput).toBeDefined();
  });

  it('returns a keypoints shared value', () => {
    const { result } = renderHook(() => usePoseDetection());
    expect(result.current.keypoints).toBeDefined();
  });

  it('reports isModelLoading=false when model is loaded', () => {
    jest.mocked(useTensorflowModel).mockReturnValue({
      state: 'loaded',
      model: { runSync: jest.fn(() => [new Float32Array(51).fill(0)]), run: jest.fn() },
    });
    const { result } = renderHook(() => usePoseDetection());
    expect(result.current.isModelLoading).toBe(false);
  });

  it('reports isModelLoading=true when model is still loading', () => {
    jest.mocked(useTensorflowModel).mockReturnValue({
      state: 'loading',
      model: undefined,
    });
    const { result } = renderHook(() => usePoseDetection());
    expect(result.current.isModelLoading).toBe(true);
  });

  it('calls useFrameOutput to register the frame callback', () => {
    renderHook(() => usePoseDetection());
    expect(jest.mocked(useFrameOutput)).toHaveBeenCalledTimes(1);
  });
});
