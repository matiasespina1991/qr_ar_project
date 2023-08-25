import '../styles/style.scss';
import { AuthProvider } from '../src/hook/auth';
import { SnackbarProvider } from 'notistack';
import AuthStateChanged from '../src/layouts/AuthStateChanged';
import { ThemeProvider } from '@mui/material';
import theme from '../src/theme/theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider 
        anchorOrigin={{
          vertical: 'top', 
          horizontal: 'right',
        }}
        maxSnack={2} 
        preventDuplicate
      >
        <AuthProvider>
          <AuthStateChanged>
            <Component {...pageProps} />
          </AuthStateChanged>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default MyApp;
