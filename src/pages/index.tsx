import { useMemo, useEffect } from 'react';
import { ThemeProvider, StylesProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { useCookies } from 'react-cookie';
import { addDays } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ja } from 'date-fns/locale';
import Route from '~/components/Route';
import useTheme from '~/hooks/useTheme';
import SnackbarWrapper from '~/components/SnackbarWrapper';
import Layout from '~/components/Layout';

const Index = () => {
  console.log('page::Index');

  const [{ themeColor }, setCookie] = useCookies(['themeColor']);
  const themeObject = useTheme(themeColor);
  const theme = responsiveFontSizes(createMuiTheme(themeObject));

  useEffect(() => {
    if (themeColor) {
      // expireの延長
      setCookie('themeColor', themeColor, {
        expires: addDays(new Date(), 365),
      });
    }
  }, []);

  return useMemo(() => <StylesProvider injectFirst>
    <ThemeProvider theme={theme}>
      <SnackbarWrapper/>
      <Layout>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ja}>
          <Route/>
        </MuiPickersUtilsProvider>
      </Layout>
    </ThemeProvider>
  </StylesProvider>, [theme.palette.type]);
};

export default Index;
