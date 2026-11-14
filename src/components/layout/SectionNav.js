import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { activeItemForPath, portalForPath } from './navigation';

/** Secondary, per-portal navigation shown as tabs on tablet and desktop. */
export default function SectionNav() {
  const { pathname } = useLocation();
  const portal = portalForPath(pathname);
  const active = activeItemForPath(portal, pathname);
  if (!portal) return null;

  return (
    <Box
      component="nav"
      aria-label={`${portal.label} sections`}
      sx={{
        display: { xs: 'none', md: 'block' },
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Tabs
          value={active?.to ?? false}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label={`${portal.label} sections`}
          role="navigation"
        >
          {portal.items.map((item) => {
            const Icon = item.icon;
            return (
              <Tab
                key={item.to}
                value={item.to}
                label={item.label}
                icon={<Icon fontSize="small" />}
                iconPosition="start"
                component={RouterLink}
                to={item.to}
                aria-current={active?.to === item.to ? 'page' : undefined}
                role={undefined}
                sx={{ minHeight: 52 }}
              />
            );
          })}
        </Tabs>
      </Container>
    </Box>
  );
}
