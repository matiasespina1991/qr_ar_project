import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Divider } from '@mui/material';
import styled from '@emotion/styled';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import LogoWhite from '../../assets/images/logos/amplelogowhite.svg';
import user1 from '../../../public/images/profile/user-profile-pic.jpg';
import logout from '../../functions/logout';

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
`;

const HStack = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MobileButton = styled(Button)`
  display: none;

  @media (max-width: 991px) {
    display: block;
  }
`;

const ProfileImage = styled(Image)`
  border-radius: 50%;
  width: 30px;
  height: 30px;
`;

const Header = ({ showMobmenu }) => {
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
        <FlexCenter>
          <MobileButton href="/" component="a" onClick={showMobmenu}>
            <Image src={LogoWhite} alt="logo" />
          </MobileButton>
          <MobileButton color="inherit" onClick={showMobmenu}>
            <MenuIcon />
          </MobileButton>
        </FlexCenter>
        <HStack>
          <IconButton color="secondary" onClick={handleMenuOpen}>
            <ProfileImage src={user1} alt="profile" />
          </IconButton>
        </HStack>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <div>Info</div>
          <Divider />
          <MenuItem>My Account</MenuItem>
          <MenuItem>Edit Profile</MenuItem>
          <Divider />
          <MenuItem>My Balance</MenuItem>
          <MenuItem>Inbox</MenuItem>
          <MenuItem onClick={() => logout()}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
