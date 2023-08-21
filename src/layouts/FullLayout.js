import React from 'react';
import { Container, Drawer, CssBaseline, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery'; 
import Header from './header/Header';
import Sidebar from './sidebars/vertical/Sidebar';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  contentArea: {
    flexGrow: 1,
    // padding: theme.spacing(3),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  containerStyle: {
    padding: 0,
  },
}));

const FullLayout = ({ children }) => {
  const classes = useStyles();
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
    <main>
      <div className={classes.root}>
        <CssBaseline />
        {/******** Sidebar **********/}
        <Drawer
          open={isMobile ? open : true} // Si es móvil, se controla con el estado; si no, siempre está abierto.
          variant={isMobile ? 'temporary' : 'permanent'} // Variante temporal en móvil, permanente en otros tamaños.
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClose={handleDrawerClose}
        >
          <Sidebar showMobilemenu={() => showMobilemenu()} />
        </Drawer>

        <div className={classes.contentArea}>
          {/********header**********/}
          <Header showMobmenu={() => showMobilemenu()} />

          {/********Middle Content**********/}
          <Container className={classes.containerStyle} maxWidth="xl">
            <div>{children}</div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
