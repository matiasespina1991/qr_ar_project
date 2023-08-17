
import '../styles/style.scss'
import { AuthProvider } from "../src/hook/auth";
import { SnackbarProvider } from 'notistack';
import AuthStateChanged from '../src/layouts/AuthStateChanged';

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider 
      anchorOrigin={{
        vertical: 'top', 
        horizontal: 'right' 
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
  );
}

export default MyApp;


