import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function PageLoader({ label = 'Loading…', minHeight = '50vh' }) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{ display: 'grid', placeItems: 'center', minHeight, gap: 2, py: 6 }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={32} aria-hidden="true" />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}
