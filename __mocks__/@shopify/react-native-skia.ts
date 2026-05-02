import React from 'react';
import { View } from 'react-native';

export const Canvas = jest.fn(({ children }: { children?: React.ReactNode }) =>
  React.createElement(View, { testID: 'skia-canvas' }, children)
);

export const Circle = jest.fn(() => null);

export const Path = jest.fn(() => null);

export const Skia = {
  Path: {
    Make: jest.fn(() => ({
      addOval: jest.fn(),
      toSVGString: jest.fn(() => ''),
    })),
  },
  Color: jest.fn((c: string) => c),
};
