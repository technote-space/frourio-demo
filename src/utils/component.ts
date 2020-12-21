import { FC } from 'react';
import { AuthenticatedPageProps } from '~/components/AuthenticatedPage';

export const getDisplayName = (prefix: string, WrappedComponent: FC<AuthenticatedPageProps>) => `${prefix}(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
