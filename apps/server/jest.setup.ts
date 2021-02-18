jest.mock('bunyan', () => ({
  createLogger: () => ({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  }),
}));
jest.mock('@slack/webhook');
export {};