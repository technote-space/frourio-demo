import type { Address } from '^/types';
import axios from 'axios';

const isZipCode = (input: string): boolean => /^\d{3}-?\d{4}$/.test(input);
const normalizeZipCode = (input: string): string => input.split('-').join('');
const getZipCodeJsonUrl = (input: string): string => {
  const zipcode = normalizeZipCode(input);
  return `https://kmdsbng.github.io/zipcode_jp/zip_code/${zipcode.slice(0, 3)}/${zipcode}.json`;
};
export const getAddress = async(input?: string): Promise<Address | null> => {
  if (!input || !isZipCode(input)) {
    return null;
  }

  try {
    return (await axios.get(getZipCodeJsonUrl(input))).data[0] as Address;
  } catch {
    return null;
  }
};