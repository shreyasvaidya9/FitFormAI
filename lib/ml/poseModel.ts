import { useTensorflowModel } from 'react-native-fast-tflite';

export function usePoseModel() {
  return useTensorflowModel(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../../assets/models/movenet_thunder.tflite'),
  );
}
