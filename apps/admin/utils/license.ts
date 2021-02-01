import { processLicenses } from '@frourio-demo/utils/license';
import licenses from '../license.json';

export const getLicenseList = () => processLicenses(licenses);
