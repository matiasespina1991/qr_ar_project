import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Divider, Box } from '@mui/material';
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

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: block;
  }
`;

const MenuItemTitle = styled.div`
  color: #828282;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 16px;
  padding-right: 16px;
`;

const ProfileImage = styled(Image)`
  border-radius: 50%;
  width: 30px;
  height: 30px;
`;

const headerMenuItems = [
  // {
  //   name: 'My Account',
  //   path: '/',
  // },
  // {
  //   name: 'Edit Profile',
  //   path: '/',
  // },
  // {
  //   name: 'My Balance',
  //   path: '/',
  // },
  // {
  //   name: 'Inbox',
  //   path: '/',
  // },
];

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
        <Box sx={{ flexGrow: 1}}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {headerMenuItems.length != 0 && headerMenuItems.map((item) => (

              <Button
                key={item.name}
                sx={{
                  color: pathname === item.path ? '#ffffff82' : 'white',
                  '&:hover': {
                    color: '#ffffff82',
                  },
                }}
                >
                {item.name}
                </Button>
            ))}

          </Box>
        </Box>
        <HStack>
          <IconButton color="secondary" onClick={handleMenuOpen}>
            <ProfileImage src={user1} alt="profile" />
          </IconButton>
        </HStack>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <Box sx={{width: '10rem'}}></Box>
          <MenuItemTitle>Info</MenuItemTitle>
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
