// import React from "react";
// import logout from "../../functions/logout";
// import Image from "next/image";
// import {
//   Navbar,
//   Collapse,
//   Nav,
//   NavItem,
//   NavbarBrand,
//   UncontrolledDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Dropdown,
//   Button,
// } from "reactstrap";
// import LogoWhite from "../../assets/images/logos/amplelogowhite.svg";
// import user1 from "../../../public/images/profile/user-profile-pic.jpg";
// import { useRouter } from 'next/router';


// const Header = ({ showMobmenu }) => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [dropdownOpen, setDropdownOpen] = React.useState(false);

//   const router = useRouter();

//   const { pathname } = router;


//   const toggle = () => setDropdownOpen((prevState) => !prevState);
//   const Handletoggle = () => {
//     setIsOpen(!isOpen);
//   };

//   if ('no-header' in router.query) {
//     return <></>;
//   }

//   return (
//     <Navbar 
//       color="secondary" 
//       dark 
//       expand="md" 
      
//     >
//       <div className="d-flex align-items-center">
//         <NavbarBrand href="/" className="d-lg-none">
//           <Image src={LogoWhite} alt="logo" />
//         </NavbarBrand>
//         <Button color="secondary" className="d-lg-none" onClick={showMobmenu}>
//           <i className="bi bi-list"></i>
//         </Button>
//       </div>
//       <div className="hstack gap-2">
//         <Button
//           color="secondary"
//           size="sm"
//           className="d-sm-block d-md-none"
//           onClick={Handletoggle}
//         >
//           {isOpen ? (
//             <i className="bi bi-x"></i>
//           ) : (
//             <i className="bi bi-three-dots-vertical"></i>
//           )}
//         </Button>
//       </div>

//       <Collapse navbar isOpen={isOpen}>
//         <Nav className="me-auto" navbar>
//           {/* <NavItem>
//             <Link href="/">
//               <a className="nav-link">Starter</a>
//             </Link>
//           </NavItem>
//           <NavItem>
//             <Link href="/about">
//               <a className="nav-link">About</a>
//             </Link>
//           </NavItem>
//           <UncontrolledDropdown inNavbar nav>
//             <DropdownToggle caret nav>
//               DD Menu
//             </DropdownToggle>
//             <DropdownMenu end>
//               <DropdownItem>Option 1</DropdownItem>
//               <DropdownItem>Option 2</DropdownItem>
//               <DropdownItem divider />
//               <DropdownItem>Reset</DropdownItem>
//             </DropdownMenu>
//           </UncontrolledDropdown> */}
//         </Nav>
//         <Dropdown isOpen={dropdownOpen} toggle={toggle}>
//           <DropdownToggle color="secondary">
//             <div style={{ lineHeight: "0px" }}>
//               <Image
//                 src={user1}
//                 alt="profile"
//                 className="rounded-circle"
//                 width="30"
//                 height="30"
//               />
//             </div>
//           </DropdownToggle>
//           <DropdownMenu>
//             <DropdownItem header>Info</DropdownItem>
//             <DropdownItem>My Account</DropdownItem>
//             <DropdownItem>Edit Profile</DropdownItem>
//             <DropdownItem divider />
//             <DropdownItem>My Balance</DropdownItem>
//             <DropdownItem>Inbox</DropdownItem>
//             <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
//           </DropdownMenu>
//         </Dropdown>
//       </Collapse>
//     </Navbar>
//   );
// };

// export default Header;









import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Avatar } from '@mui/material';
import styled from '@emotion/styled';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import LogoWhite from '../../assets/images/logos/amplelogowhite.svg';
import user1 from '../../../public/images/profile/user-profile-pic.jpg';
import logout from '../../functions/logout';

const MobileButton = styled(Button)`
  @media (min-width: 992px) {
    display: none;
  }
`;

const Header = ({ showMobmenu }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const router = useRouter();
  const { pathname } = router;

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  if ('no-header' in router.query) {
    return <></>;
  }

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <div className="d-flex align-items-center">
          <MobileButton href="/" component="a">
            <Image src={LogoWhite} alt="logo" />
          </MobileButton>
          <IconButton color="inherit" onClick={showMobmenu}>
            <MenuIcon />
          </IconButton>
        </div>
        <div className="hstack gap-2">
          <Button
            color="secondary"
            size="small"
            className="d-sm-block d-md-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <MoreVertIcon /> : <MoreVertIcon />}
          </Button>
        </div>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem header>Info</MenuItem>
          <MenuItem>My Account</MenuItem>
          <MenuItem>Edit Profile</MenuItem>
          <MenuItem divider />
          <MenuItem>My Balance</MenuItem>
          <MenuItem>Inbox</MenuItem>
          <MenuItem onClick={() => logout()}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
