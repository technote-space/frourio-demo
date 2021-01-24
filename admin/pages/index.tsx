import { useMemo } from 'react';
import { ThemeProvider, StylesProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ja } from 'date-fns/locale';
import Route from '~/components/Route';
import Auth from '~/components/Auth';
import useTheme from '~/hooks/useTheme';
import useDarkMode from '~/hooks/useDarkMode';
import SnackbarWrapper from '~/components/SnackbarWrapper';
import LicenseDialog from '~/components/LicenseDialog';
import Layout from '~/components/Layout';

const Index = () => {
  const [themeColor] = useDarkMode();
  const themeObject = useTheme(themeColor);

  return useMemo(() => <StylesProvider injectFirst>
    <ThemeProvider theme={responsiveFontSizes(createMuiTheme(themeObject))}>
      <SnackbarWrapper/>
      <LicenseDialog/>
      <Layout>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ja}>
          <Route/>
          <Auth/>
        </MuiPickersUtilsProvider>
      </Layout>
    </ThemeProvider>
  </StylesProvider>, [themeColor]);
};

export default Index;
