import { singular, plural } from 'pluralize';

export const getWord = (word: string, number: number): string => number <= 1 ? singular(word) : plural(word);
