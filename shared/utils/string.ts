import type { Primitive } from '@frourio-demo/types';
import { toFullWidth } from '@technote-space/imi-moji-converter';

export const startWithUppercase = (value: string): string => value.length ? value.charAt(0).toUpperCase() + value.slice(1) : '';

const replaceAll = (string: string, key: string, value: Primitive) => string.split(key).join(`${value ?? ''}`);
export const replaceVariables = (string: string, variables: Record<string, Primitive>) =>
  Object.keys(variables).reduce((acc, key) => replaceAll(acc, `\${${key}}`, variables[key]), string);

export const katakana = (value: string): string => toFullWidth(value);
