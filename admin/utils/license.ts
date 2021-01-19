import type { License, RawLicenseType } from '~/types';
import licenses from '../license.json';

export const ensureString = (value: string | Array<string>): string => typeof value === 'string' ? value : value.join(', ');

export const getLicenseList = (): Array<License> => {
  return Object.values(licenses).map((license: RawLicenseType) => ({
    name: license.name,
    version: license.version,
    licenses: ensureString(license.licenses),
    repository: license.repository,
    licenseText: license.licenseText,
  }));
};
