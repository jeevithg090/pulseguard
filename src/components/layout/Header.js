import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <LocalHospitalIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            PulseGuard
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isMobile && (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/patient"
                >
                  Patient Portal
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/hospital"
                >
                  Hospital Portal
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 