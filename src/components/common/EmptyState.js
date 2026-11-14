import React from 'react';
import { Box, Typography } from '@mui/material';

/** Friendly placeholder for lists with no content. */
export default function EmptyState({ icon, title, description, action, dense = false }) {
  return (
    <Box
      role="status"
      sx={{
        textAlign: 'center',
        py: dense ? 3 : 6,
        px: 2,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      {icon && (
        <Box aria-hidden="true" sx={{ color: 'text.secondary', mb: 1, '& svg': { fontSize: 40 } }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" component="p" gutterBottom={Boolean(description)}>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: action ? 2 : 0 }}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}
