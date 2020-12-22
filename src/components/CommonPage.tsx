import type { FC } from 'react';
import Layout from '~/components/Layout';
import { addDisplayName } from '~/utils/component';

const CommonPage: (WrappedComponent: FC) => FC = WrappedComponent => addDisplayName('CommonPage', props => <Layout>
  <WrappedComponent {...props}/>
</Layout>, WrappedComponent);

export default CommonPage;
