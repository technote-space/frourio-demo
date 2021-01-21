import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions } from './tsconfig.json';

const config: { projects: Config.InitialOptions[] } = {
  projects: [
    {
      displayName: 'admin',
      clearMocks: true,
      testRunner: 'jest-circus/runner',
      testMatch: ['<rootDir>/admin/__tests__/**/*.test.ts?(x)'],
      transform: {
        '^.+\\.tsx$': ['babel-jest', { configFile: './admin/babel.config.js' }],
        '^.+\\.ts$': 'ts-jest',
      },
      moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
        ...pathsToModuleNameMapper(compilerOptions.paths, {
          prefix: '<rootDir>/',
        }),
      },
      coveragePathIgnorePatterns: [
        '\\$.+\\.ts',
      ],
      globalSetup: './jest.global.setup.ts',
      setupFilesAfterEnv: ['./jest.setup.ts', 'jest-canvas-mock'],
      globals: { Blob: {} },
    },
    {
      displayName: 'server',
      clearMocks: true,
      testRunner: 'jest-circus/runner',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/__tests__/**/*.test.ts'],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
      }),
      coveragePathIgnorePatterns: [
        '\\$.+\\.ts',
        '<rootDir>/server/prisma/client/',
      ],
      globalSetup: './jest.global.setup.ts',
      setupFilesAfterEnv: ['./jest.setup.ts'],
      globals: { Blob: {} },
    },
  ],
};

export default config;
