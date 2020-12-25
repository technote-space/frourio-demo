import { useMemo } from 'react';
import { ThemeProvider, StylesProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import Route from '~/components/Route';
import useTheme from '~/hooks/useTheme';
import { useStoreContext } from '~/store';
import LoadingModal from '~/components/LoadingModal';
import SnackbarWrapper from '~/components/SnackbarWrapper';
import Layout from '~/components/Layout';

const Index = () => {
  console.log('page::Index');

  const { themeColor } = useStoreContext();
  const themeObject    = useTheme(themeColor);
  const theme          = responsiveFontSizes(createMuiTheme(themeObject));

  return useMemo(() => <StylesProvider injectFirst>
    <ThemeProvider theme={theme}>
      <LoadingModal/>
      <SnackbarWrapper/>
      <Layout>
        <Route/>
      </Layout>
    </ThemeProvider>
  </StylesProvider>, [theme.palette.type]);
};

export default Index;
