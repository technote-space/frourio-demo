import type { FC } from 'react';
import Layout from '~/components/Layout';
import { getDisplayName } from '~/utils/component';

const CommonPage: (WrappedComponent: FC) => FC = WrappedComponent => {
  const Component: FC   = props => <Layout>
    <WrappedComponent {...props}/>
  </Layout>;
  Component.displayName = getDisplayName('CommonPage', WrappedComponent);
  console.log(Component.displayName);
  return Component;
};

export default CommonPage;
