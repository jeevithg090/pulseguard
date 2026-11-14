import React from 'react';
import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';

/** Compact metric tile: label, big value, optional helper text and progress bar. */
export default function StatCard({ label, value, helper, icon, progress, tone = 'primary' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
          {icon && (
            <Box
              aria-hidden="true"
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 36,
                height: 36,
                borderRadius: 2,
                color: `${tone}.main`,
                bgcolor: 'action.hover',
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </Stack>
        <Typography variant="h4" component="p" sx={{ mb: helper || progress != null ? 1 : 0 }}>
          {value}
        </Typography>
        {progress != null && (
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, progress))}
            color={tone}
            aria-label={`${label}: ${Math.round(progress)}%`}
            sx={{ height: 8, borderRadius: 4, mb: helper ? 1 : 0 }}
          />
        )}
        {helper && (
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
