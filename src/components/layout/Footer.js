import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import config from '../../config';
import { useAppData } from '../../state/AppDataProvider';

export default function Footer() {
  const { resetDemoData } = useAppData();
  return (
    <Box
      component="footer"
      sx={{ mt: 'auto', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', py: 3 }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680 }}>
            PulseGuard is a demo. All data is simulated and stored only in this browser — it is not
            medical advice. In an emergency, call{' '}
            <Link href={`tel:${config.emergencyNumber}`} sx={{ fontWeight: 600 }}>
              {config.emergencyNumber}
            </Link>
            .
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
            <Link component={RouterLink} to="/" variant="body2">
              Home
            </Link>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => {
                if (window.confirm('Reset all demo data stored in this browser?')) resetDemoData();
              }}
            >
              Reset demo data
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
