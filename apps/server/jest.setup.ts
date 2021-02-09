jest.mock('bunyan', () => ({
  createLogger: () => ({
    debug: jest.fn(),
    error: jest.fn(),
  }),
}));
export {};