
import '../styles/style.scss'
import { AuthProvider } from "../src/hook/auth";
import { SnackbarProvider } from 'notistack';
import AuthStateChanged from '../src/layouts/AuthStateChanged';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


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


