import type { License, RawLicenseType } from '~/types';
import licenses from '../license.json';

export const getLicenseList = (): Array<License> => {
  return Object.values(licenses).map((license: RawLicenseType) => ({
    name: license.name,
    version: license.version,
    /* istanbul ignore next */
    licenses: typeof license.licenses === 'string' ? license.licenses : license.licenses.join(', '),
    repository: license.repository,
    licenseText: license.licenseText,
  }));
};
