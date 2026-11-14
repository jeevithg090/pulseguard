import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page not found');
  const { pathname } = useLocation();
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, maxWidth: 560, mx: 'auto' }}>
      <SearchOffIcon aria-hidden="true" sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="overline" color="primary" component="p">
        Error 404
      </Typography>
      <Typography variant="h2" component="h1" gutterBottom>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, wordBreak: 'break-word' }}>
        We couldn’t find <strong>{pathname}</strong>. It may have moved, or the link may be wrong.
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'center' }}
      >
        <Button component={RouterLink} to="/" variant="contained" size="large">
          Go to home
        </Button>
        <Button component={RouterLink} to="/patient" variant="outlined" size="large">
          Patient portal
        </Button>
      </Stack>
    </Box>
  );
}
