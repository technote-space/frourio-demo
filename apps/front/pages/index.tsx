import { useMemo } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import Auth from '^/components/Auth';
import Layout from '^/components/Layout';
import ToastWrapper from '^/components/ToastWrapper';
import history from '^/utils/history';
import pages from '^/_pages';

const Index = () => useMemo(() => <>
  <ToastWrapper/>
  <Auth/>
  <Router history={history}>
    <Layout>
      <Switch>
        {Object.keys(pages).map(page =>
          <Route
            key={page}
            exact={pages[page].exact}
            path={pages[page].path ?? `/${page}`}
            component={pages[page].page}
          />,
        )}
        <Redirect to='/'/>
      </Switch>
    </Layout>
  </Router>
</>, []);

export default Index;
