import { useFrameProcessor } from 'react-native-vision-camera';
import { usePoseModel } from '../lib/ml/poseModel';

export function usePoseDetection() {
  const { state, model } = usePoseModel();

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      if (model == null) return;
      const outputs = model.runSync([frame]);
      console.log('MoveNet raw output length:', outputs[0]?.length);
    },
    [model],
  );

  return {
    frameProcessor,
    isModelLoading: state !== 'loaded',
  };
}
