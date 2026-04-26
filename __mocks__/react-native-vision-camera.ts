import React from 'react';
import { View } from 'react-native';

const mockRequestPermission = jest.fn().mockResolvedValue(true);

export const Camera = jest.fn((props: any) => React.createElement(View, props));

export const useCameraDevice = jest.fn(() => ({
  id: 'mock-device',
  position: 'front' as const,
  name: 'Mock Front Camera',
  hasFlash: false,
  hasTorch: false,
  isMultiCam: false,
  minZoom: 1,
  maxZoom: 1,
  neutralZoom: 1,
  minFocusDistance: 0,
  isFocusLocked: false,
  supportsRawCapture: false,
  supportsDepthCapture: false,
  supportsLowLightBoost: false,
  hardwareLevel: 'full' as const,
  sensorOrientation: 'landscape-left' as const,
  formats: [],
  supportsFocus: false,
}));

export const useCameraPermission = jest.fn(() => ({
  hasPermission: false,
  requestPermission: mockRequestPermission,
}));

export const useFrameProcessor = jest.fn(() => () => {});

export const useSkiaFrameProcessor = jest.fn(() => () => {});
