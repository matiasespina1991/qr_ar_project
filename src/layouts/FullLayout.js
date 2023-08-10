import React from "react";
import { useRouter } from 'next/router'; // Import useRouter
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";

const FullLayout = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  const router = useRouter(); // Use the useRouter hook
  const { pathname } = router;
  const isARView = pathname.startsWith('/ui/ar-view/'); // Check if the path starts with /ui/ar-view/

  return (
    <main>
      <div className="pageWrapper d-md-block d-lg-flex">
        {/******** Sidebar **********/}
        <aside
          className={`sidebarArea shadow bg-white ${
            !open ? "" : "showSidebar"
          }`}
        >
          <Sidebar showMobilemenu={() => showMobilemenu()} />
        </aside>
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}
          <Header showMobmenu={() => showMobilemenu()} />

          {/********Middle Content**********/}
          <Container style={{padding: '0 !important'}} className={isARView ? "wrapper" : "p-4 wrapper"} fluid> {/* Use condition here */}
            <div>{children}</div>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
