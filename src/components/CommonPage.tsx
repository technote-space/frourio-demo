import type { FC } from 'react';
import Layout from '~/components/Layout';
import { addDisplayName } from '~/utils/component';

const CommonPage: (WrappedComponent: FC) => FC = WrappedComponent => addDisplayName(
  'CommonPage',
  props => <div suppressHydrationWarning><Layout>
    <WrappedComponent {...props}/>
  </Layout></div>, WrappedComponent,
);

export default CommonPage;
