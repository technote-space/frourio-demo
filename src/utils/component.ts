import type { FC } from 'react';

export const getDisplayName = <T extends FC = FC>(prefix: string, Component: T) => `${prefix}(${Component.displayName || Component.name || 'Component'})`;

export const addDisplayName = <T extends FC = FC, U extends FC = FC>(prefix: string, Component: T, WrappedComponent?: U) => {
  Component.displayName = getDisplayName(prefix, WrappedComponent ?? Component);
  return Component;
};
