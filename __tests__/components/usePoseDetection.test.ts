import { renderHook } from '@testing-library/react-native';
import { useFrameProcessor } from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { usePoseDetection } from '../../hooks/usePoseDetection';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('usePoseDetection', () => {
  it('returns a frameProcessor function', () => {
    const { result } = renderHook(() => usePoseDetection());
    expect(typeof result.current.frameProcessor).toBe('function');
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

  it('registers a frame processor with the model as dependency', () => {
    const { result } = renderHook(() => usePoseDetection());
    expect(jest.mocked(useFrameProcessor)).toHaveBeenCalledTimes(1);
    // Model is passed as a dependency so the processor re-registers when it loads
    const deps = jest.mocked(useFrameProcessor).mock.calls[0][1];
    expect(deps).toHaveLength(1);
  });
});
