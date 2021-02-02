import { memo } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Auth from '^/components/Auth';
import Layout from '^/components/Layout';
import ToastWrapper from '^/components/ToastWrapper';
import pages from '^/_pages';

const Index = memo(() => <>
  <ToastWrapper/>
  <Auth/>
  <Layout>
    <Switch>
      {Object.keys(pages).map(page =>
        <Route
          key={page}
          exact={pages[page].exact}
          path={`${process.env.BASE_PATH}${pages[page].path ?? `/${page}`}`}
          component={pages[page].page}
        />,
      )}
      <Redirect to={`${process.env.BASE_PATH}/`}/>
    </Switch>
  </Layout>
</>);

Index.displayName = 'Index';
export default Index;
