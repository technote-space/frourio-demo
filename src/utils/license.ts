import type { License } from '~/types';
import licenses from '../../license.json';

export const getLicenseList = (): Array<License> => {
  return Object.values(licenses).map(license => ({
    name: license.name,
    version: license.version,
    licenses: typeof license.licenses === 'string' ? license.licenses : license.licenses.join(', '),
    repository: license.repository,
    licenseText: license.licenseText,
  }));
};
