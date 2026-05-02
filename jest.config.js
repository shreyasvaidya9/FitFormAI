module.exports = {
  preset: 'jest-expo',
  testMatch: [
    '**/__tests__/components/**/*.test.tsx',
    '**/__tests__/components/**/*.test.ts',
  ],
  moduleNameMapper: {
    '^@shopify/react-native-skia$': '<rootDir>/__mocks__/@shopify/react-native-skia',
    '^react-native-reanimated$': 'react-native-reanimated/mock',
    '\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(tflite)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
};
