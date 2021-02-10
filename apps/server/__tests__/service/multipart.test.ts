/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import { saveFile } from '$/service/multipart';

jest.mock('fs', () => ({
  ...jest.requireActual('fs') as {},
  promises: {
    ...jest.requireActual('fs').promises as {},
    writeFile: jest.fn(),
  },
}));

describe('saveFile', () => {
  it('should not process not multipart files', async() => {
    const spyOn = jest.spyOn(fs.promises, 'writeFile');

    expect(await saveFile({ test1: 'test1', test2: 2 })).toEqual({ test1: 'test1', test2: 2 });
    expect(spyOn).not.toBeCalled();
  });

  it('should process multipart files', async() => {
    expect(await saveFile({
      test1: { filename: 'test.png', toBuffer: jest.fn() },
      test2: 2,
      test3: { filename: 'test.jpg', toBuffer: jest.fn() },
    })).toEqual({
      test1: expect.stringMatching(/\.png$/),
      test2: 2,
      test3: expect.stringMatching(/\.jpg$/),
    });
  });
});
