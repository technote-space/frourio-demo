import type { FC } from 'react';
import { AuthenticatedPageProps } from '~/components/AuthenticatedPage';

export const getDisplayName = (prefix: string, Component: FC) => `${prefix}(${Component.displayName || Component.name || 'Component'})`;

export const addDisplayName = (prefix: string, Component: FC, WrappedComponent?: FC) => {
  Component.displayName = getDisplayName(prefix, WrappedComponent ?? Component);
  return Component;
};
