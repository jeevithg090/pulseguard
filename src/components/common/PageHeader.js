import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

/** Consistent page heading with optional eyebrow, description and actions. */
export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ mb: { xs: 3, md: 4 }, alignItems: { xs: 'stretch', sm: 'flex-end' } }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {eyebrow && (
          <Typography variant="overline" color="primary" component="p">
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h3" component="h1" sx={{ mb: description ? 0.5 : 0 }}>
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
            {description}
          </Typography>
        )}
      </Box>
      {actions && (
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0, flexWrap: 'wrap', gap: 1 }}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
