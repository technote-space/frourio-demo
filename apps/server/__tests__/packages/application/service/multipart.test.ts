import fs from 'fs';
import { isMultipartFile, saveFile, processMultipartFormDataBody } from '$/packages/application/service/multipart';

jest.mock('fs', () => ({
  ...jest.requireActual('fs') as {},
  promises: {
    ...jest.requireActual('fs').promises as {},
    writeFile: jest.fn(),
  },
}));

describe('isMultipartFile', () => {
  it('should return true', () => {
    expect(isMultipartFile({
      filename: 'test',
      toBuffer: jest.fn(),
    })).toBe(true);
  });

  it('should return false', () => {
    expect(isMultipartFile(null)).toBe(false);
    expect(isMultipartFile(undefined)).toBe(false);
    expect(isMultipartFile(1)).toBe(false);
    expect(isMultipartFile('1')).toBe(false);
    expect(isMultipartFile({})).toBe(false);
  });
});

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

describe('processMultipartFormDataBody', () => {
  it('should parse json', () => {
    expect(processMultipartFormDataBody({})).toEqual({});
    expect(processMultipartFormDataBody({
      test1: 1,
      test2: '2',
      json: JSON.stringify({ test: 'test' }),
    })).toEqual({
      test1: 1,
      test2: '2',
      json: { test: 'test' },
    });
  });

  it('should parse nested json', () => {
    expect(processMultipartFormDataBody({
      test1: {
        test2: JSON.stringify({ test: 'test' }),
      },
    })).toEqual({
      test1: {
        test2: {
          test: 'test',
        },
      },
    });
  });
});
