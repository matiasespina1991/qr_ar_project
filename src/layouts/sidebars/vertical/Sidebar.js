import { List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import Logo from '../../logo/Logo';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';

const SidebarWrapper = styled('div')({
  padding: '16px',
});

const LogoContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const SidebarContainer = styled('div')({
  paddingTop: '4',
  marginTop: '2',
});

const navigation = [
  {
    title: 'QR Codes',
    href: '/ui/qrcodes',
    icon: 'bi bi-qr-code-scan',
  },
  {
    title: 'Settings',
    href: '/about',
    icon: 'bi bi-sliders',
  },
];

const Sidebar = ({ showMobilemenu }) => {
  let curl = useRouter();
  const location = curl.pathname;

  return (
    <SidebarWrapper>
      <LogoContainer>
        <Logo />
      </LogoContainer>

      <SidebarContainer>
        <List>
          {navigation.map((navi, index) => (
            <ListItem
              key={index}
              sx={{
                py: 1,
              }}
            >
              <ListItemButton
                href={navi.href}
                sx={{
                  color: location === navi.href ? 'primary.main' : 'text.secondary',
                }}
              >
                <ListItemIcon>
                  <i className={navi.icon}></i>
                </ListItemIcon>
                <ListItemText primary={navi.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </SidebarContainer>
    </SidebarWrapper>
  );
};

export default Sidebar;
