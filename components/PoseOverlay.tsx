import { useState, useCallback } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { Keypoint } from '../lib/poseDecoder';

const SCORE_THRESHOLD = 0.3;
const DOT_RADIUS = 6;

interface Props {
  keypoints: SharedValue<Keypoint[]>;
}

export function PoseOverlay({ keypoints }: Props) {
  const { width, height } = useWindowDimensions();
  const [displayKps, setDisplayKps] = useState<Keypoint[]>([]);

  const syncKps = useCallback((kps: Keypoint[]) => {
    setDisplayKps(kps.filter((kp) => kp.score >= SCORE_THRESHOLD));
  }, []);

  useAnimatedReaction(
    () => keypoints.value,
    (kps) => {
      'worklet';
      runOnJS(syncKps)(kps);
    },
  );

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {displayKps.map((kp, i) => (
        <Circle
          key={i}
          cx={kp.x * width}
          cy={kp.y * height}
          r={DOT_RADIUS}
          color="lime"
        />
      ))}
    </Canvas>
  );
}
