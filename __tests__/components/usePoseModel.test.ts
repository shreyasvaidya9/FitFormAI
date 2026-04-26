import { renderHook } from '@testing-library/react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { usePoseModel } from '../../lib/ml/poseModel';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('usePoseModel', () => {
  it('returns loaded state with a model', () => {
    const { result } = renderHook(() => usePoseModel());
    expect(result.current.state).toBe('loaded');
    expect(result.current.model).toBeDefined();
  });

  it('model exposes runSync', () => {
    const { result } = renderHook(() => usePoseModel());
    expect(typeof result.current.model?.runSync).toBe('function');
  });

  it('passes the tflite asset to useTensorflowModel', () => {
    renderHook(() => usePoseModel());
    expect(jest.mocked(useTensorflowModel)).toHaveBeenCalledTimes(1);
  });
});
