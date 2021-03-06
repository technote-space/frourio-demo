import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions } from './tsconfig.json';

const config: { projects: Config.InitialOptions[] } = {
  projects: [
    {
      displayName: 'shared',
      clearMocks: true,
      testRunner: 'jest-circus/runner',
      testEnvironment: 'jsdom',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/shared/**/__tests__/**/*.test.ts?(x)'],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
      }),
      globalSetup: '<rootDir>/config/jest.global.setup.ts',
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts'],
    },
    {
      displayName: 'admin',
      clearMocks: true,
      testRunner: 'jest-circus/runner',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/apps/admin/__tests__/**/*.test.ts?(x)'],
      transform: {
        '^.+\\.tsx$': ['babel-jest', { configFile: './apps/admin/babel.config.js' }],
        '^.+\\.ts$': 'ts-jest',
      },
      moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/apps/admin/__tests__/__mocks__/fileMock.js',
        ...pathsToModuleNameMapper(compilerOptions.paths, {
          prefix: '<rootDir>/',
        }),
      },
      coveragePathIgnorePatterns: [
        '\\$.+\\.ts',
      ],
      globalSetup: '<rootDir>/config/jest.global.setup.ts',
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts', 'jest-canvas-mock'],
    },
    {
      displayName: 'server',
      clearMocks: true,
      testRunner: 'jest-circus/runner',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/apps/server/__tests__/**/*.test.ts'],
      moduleNameMapper: {
        'templates/(.*)\\.html$': '<rootDir>/apps/server/__tests__/__mocks__/$1.ts',
        ...pathsToModuleNameMapper(compilerOptions.paths, {
          prefix: '<rootDir>/',
        }),
      },
      coveragePathIgnorePatterns: [
        '\\$.+\\.ts',
        '<rootDir>/apps/server/packages/infra/database/prisma/',
      ],
      globalSetup: '<rootDir>/config/jest.global.setup.ts',
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts', './apps/server/jest.setup.ts'],
    },
  ],
};

export default config;
