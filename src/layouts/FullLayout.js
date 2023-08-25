import * as React from 'react';
import { Container, Drawer, CssBaseline } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from './header/Header';
import Sidebar from './sidebars/vertical/Sidebar';

const drawerWidth = 240;

const Main = styled('main')({
  display: 'flex',
});

const DrawerStyled = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
});

const ContentArea = styled('div')({
  flexGrow: 1,
  padding: 0,
});

const FullLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);

  const showMobilemenu = () => {
    setOpen(!open);
  };

  const handleDrawerClose = (event, reason) => {
    if (reason === 'backdropClick') {
      showMobilemenu();
    }
  };

  return (
    <Main>
        <CssBaseline />
        <DrawerStyled
          open={isMobile ? open : true}
          variant={isMobile ? 'temporary' : 'permanent'}
          onClose={handleDrawerClose}
        >
          <Sidebar showMobilemenu={() => showMobilemenu()} />
        </DrawerStyled>
        <ContentArea>
          <Header showMobmenu={() => showMobilemenu()} />
          <Container maxWidth="xl">
            <div>{children}</div>
          </Container>
        </ContentArea>
    </Main>
  );
};

export default FullLayout;
