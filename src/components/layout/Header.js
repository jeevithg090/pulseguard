import React, { useState } from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import BrandMark from '../common/BrandMark';
import { PORTALS, portalForPath } from './navigation';
import { useColorMode } from '../../theme/ColorModeProvider';

function ColorModeToggle() {
  const { mode, toggleColorMode } = useColorMode();
  const label = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <Tooltip title={label}>
      <IconButton onClick={toggleColorMode} aria-label={label} color="inherit">
        {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activePortal = portalForPath(pathname);

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 60, sm: 68 } }}>
          <Box
            component={RouterLink}
            to="/"
            aria-label="PulseGuard home"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              color: 'text.primary',
              textDecoration: 'none',
              mr: 'auto',
              borderRadius: 2,
              px: 0.5,
            }}
          >
            <BrandMark size={30} />
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              PulseGuard
            </Typography>
          </Box>

          <Stack
            component="nav"
            aria-label="Portals"
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            {PORTALS.map((portal) => (
              <Button
                key={portal.id}
                component={NavLink}
                to={portal.base}
                color={activePortal?.id === portal.id ? 'primary' : 'inherit'}
                aria-current={activePortal?.id === portal.id ? 'page' : undefined}
                sx={{
                  fontWeight: 600,
                  bgcolor: activePortal?.id === portal.id ? 'action.selected' : 'transparent',
                }}
              >
                {portal.label}
              </Button>
            ))}
          </Stack>

          <ColorModeToggle />

          <IconButton
            aria-label="Open navigation menu"
            aria-controls="mobile-navigation"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { md: 'none' } }}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        id="mobile-navigation"
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 300, maxWidth: '85vw' } } }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <BrandMark size={26} />
            <Typography variant="h6" component="p">
              PulseGuard
            </Typography>
          </Stack>
          <IconButton aria-label="Close navigation menu" onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Box component="nav" aria-label="Main">
          {PORTALS.map((portal) => (
            <List
              key={portal.id}
              subheader={<ListSubheader disableSticky>{portal.label}</ListSubheader>}
            >
              {portal.items.map((item) => {
                const Icon = item.icon;
                const selected = item.end ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <ListItemButton
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    selected={selected}
                    aria-current={selected ? 'page' : undefined}
                    onClick={() => setDrawerOpen(false)}
                    sx={{ mx: 1, borderRadius: 2, minHeight: 48 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                );
              })}
            </List>
          ))}
        </Box>
      </Drawer>
    </AppBar>
  );
}
