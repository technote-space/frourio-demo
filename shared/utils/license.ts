import type { License, RawLicenseType } from '@/types';

export const ensureString = (value: string | Array<string>): string => typeof value === 'string' ? value : value.join(', ');
export const processLicenses = (licenses: Record<string, RawLicenseType>): Array<License> => Object.values(licenses).map(license => ({
  name: license.name,
  version: license.version,
  licenses: ensureString(license.licenses),
  repository: license.repository,
  licenseText: license.licenseText,
}));
