import { useState, useCallback } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { Canvas, Circle, Line, vec } from '@shopify/react-native-skia';
import { useAnimatedReaction, useSharedValue, runOnJS } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { Keypoint } from '../lib/poseDecoder';
import { EDGES } from '../lib/movenet/edges';

const SCORE_THRESHOLD = 0.3;
const DOT_RADIUS = 6;
const LINE_WIDTH = 2;

interface Props {
  keypoints: SharedValue<Keypoint[]>;
}

export function PoseOverlay({ keypoints }: Props) {
  const { width, height } = useWindowDimensions();
  const [displayKps, setDisplayKps] = useState<Keypoint[]>([]);
  const [fps, setFps] = useState(0);

  const frameCount = useSharedValue(0);
  const windowStart = useSharedValue(Date.now());

  const syncKps = useCallback((kps: Keypoint[]) => {
    setDisplayKps(kps.filter((kp) => kp.score >= SCORE_THRESHOLD));
  }, []);

  const syncFps = useCallback((v: number) => setFps(v), []);

  useAnimatedReaction(
    () => keypoints.value,
    (kps) => {
      'worklet';
      frameCount.value += 1;
      const now = Date.now();
      const elapsed = now - windowStart.value;
      if (elapsed >= 1000) {
        runOnJS(syncFps)(Math.round((frameCount.value * 1000) / elapsed));
        frameCount.value = 0;
        windowStart.value = now;
      }
      runOnJS(syncKps)(kps);
    },
  );

  // Front camera: mirror x so skeleton matches live preview
  const sx = (nx: number) => (1 - nx) * width;
  const sy = (ny: number) => ny * height;

  return (
    <>
      <Canvas style={StyleSheet.absoluteFill}>
        {EDGES.map(([a, b]) => {
          const kpA = displayKps[a];
          const kpB = displayKps[b];
          if (!kpA || !kpB) return null;
          return (
            <Line
              key={`${a}-${b}`}
              p1={vec(sx(kpA.x), sy(kpA.y))}
              p2={vec(sx(kpB.x), sy(kpB.y))}
              strokeWidth={LINE_WIDTH}
              color="lime"
            />
          );
        })}
        {displayKps.map((kp, i) => (
          <Circle key={i} cx={sx(kp.x)} cy={sy(kp.y)} r={DOT_RADIUS} color="lime" />
        ))}
      </Canvas>
      {__DEV__ && fps > 0 && (
        <Text className="absolute top-4 right-4 text-green-400 font-mono text-sm">
          {fps} fps
        </Text>
      )}
    </>
  );
}
