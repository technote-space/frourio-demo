import { useMemo } from 'react';
import Route from '^/components/Route';
import Auth from '^/components/Auth';
import Layout from '^/components/Layout';
import ToastWrapper from '^/components/ToastWrapper';

const Index = () => useMemo(() => <Layout>
  <ToastWrapper/>
  <Route/>
  <Auth/>
</Layout>, []);

export default Index;
