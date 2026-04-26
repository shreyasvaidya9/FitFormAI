export const Worklets = {
  createRunOnJS: jest.fn((fn: (...args: unknown[]) => unknown) => fn),
  createRunInContextFn: jest.fn((fn: (...args: unknown[]) => unknown) => fn),
};

export const useRunOnJS = jest.fn((fn: (...args: unknown[]) => unknown) => fn);
export const useWorklet = jest.fn((fn: (...args: unknown[]) => unknown) => fn);
