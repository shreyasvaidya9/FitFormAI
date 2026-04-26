export const useTensorflowModel = jest.fn(() => ({
  state: 'loaded' as const,
  model: {
    runSync: jest.fn(() => [new Float32Array(51).fill(0)]),
    run: jest.fn(() => Promise.resolve([new Float32Array(51).fill(0)])),
  },
}));
