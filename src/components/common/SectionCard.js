import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

/** Card with a heading row (title, optional subtitle and action) used to group page content. */
export default function SectionCard({
  title,
  subtitle,
  action,
  icon,
  children,
  contentSx,
  ...props
}) {
  const headingId = props.id ? `${props.id}-title` : undefined;
  return (
    <Card component="section" aria-labelledby={headingId} {...props}>
      <CardContent
        sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } }, ...contentSx }}
      >
        {(title || action) && (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              mb: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
              {icon && (
                <Box
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </Box>
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" component="h2" id={headingId}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Stack>
            {action}
          </Stack>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
