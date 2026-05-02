import { useSharedValue, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { useFrameOutput } from 'react-native-vision-camera';
import { usePoseModel } from '../lib/ml/poseModel';
import { decodeMoveNetOutput, type Keypoint } from '../lib/poseDecoder';

function logKeypoints(count: number) {
  console.log('[PoseDetection] keypoints per frame:', count);
}

export function usePoseDetection() {
  const { state, model } = usePoseModel();
  const keypoints = useSharedValue<Keypoint[]>([]);
  const lastLogTime = useSharedValue(0);

  const frameOutput = useFrameOutput({
    onFrame(frame) {
      'worklet';
      if (model == null) {
        frame.dispose();
        return;
      }
      const outputs = model.runSync([frame]);
      keypoints.value = decodeMoveNetOutput(outputs[0]);
      frame.dispose();
    },
  });

  useAnimatedReaction(
    () => keypoints.value,
    (kps) => {
      'worklet';
      const now = Date.now();
      if (now - lastLogTime.value > 1000) {
        lastLogTime.value = now;
        runOnJS(logKeypoints)(kps.length);
      }
    },
  );

  return {
    frameOutput,
    keypoints,
    isModelLoading: state !== 'loaded',
  };
}
