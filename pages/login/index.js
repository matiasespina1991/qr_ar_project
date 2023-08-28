import * as React from 'react';
import { Box, Link, TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useAuth from '../../src/hook/auth';
import { withPublic } from '../../src/hook/route';


const theme = createTheme();

const CircularLoadingOnSuccessfulLogin = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: '#eef5f9',
  zIndex: 2,
};

function Login() {
  const { loginWithEmailAndPassword, error } = useAuth();
  const [loadingSignIn, setLoadingSignIn] = React.useState(false);

  React.useEffect(() => {
    setLoadingSignIn(false);
  }, [error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    return loginWithEmailAndPassword(email, password)
      .then(() => {
        if (email && password) {
          setLoadingSignIn(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" className="login-page" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img style={{ width: '50%', marginBottom: 18 }} src={'/images/logos/web_logo.png'} alt="QR AR Logo" />
          <Typography component="h1" variant="h5">
            QR AR Beta v0.01
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ marginTop: 1 }}>
            <Box sx={{ position: 'relative' }}>
              {loadingSignIn && (
                <Box sx={CircularLoadingOnSuccessfulLogin}>
                  <CircularProgress />
                </Box>
              )}
              <TextField margin="normal" required fullWidth id="email" label="Email" name="email" autoComplete="email" autoFocus />
              <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
            </Box>
            <Button type="submit" color="primary" fullWidth variant="contained" sx={{ marginTop: 2, marginBottom: 2 }}>
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}

function Copyright(props) {
  return (
    <>
      <Typography sx={{ marginTop: 1.5 }} variant="body2" align="center" {...props}>
        {'Copyright © Cymatix Ideas '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </>
  );
}

export default withPublic(Login);
