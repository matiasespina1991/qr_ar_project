import React from "react";
import { useRouter } from 'next/router';
import { Container, Drawer, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  contentArea: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  const router = useRouter();
  const { pathname } = router;
  const isARView = pathname.startsWith('/ui/ar-view/');

  return (
    <main style={{ overflow: isARView ? 'hidden' : 'auto' }}>
      <div className={classes.root}>
        <CssBaseline />
        {/******** Sidebar **********/}
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Sidebar showMobilemenu={() => showMobilemenu()} />
        </Drawer>
        {/********Content Area**********/}
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
