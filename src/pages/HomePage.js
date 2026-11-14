import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BrandMark from '../components/common/BrandMark';
import usePageTitle from '../hooks/usePageTitle';

const portals = [
  {
    to: '/patient',
    title: 'Patient portal',
    icon: PersonOutlineIcon,
    tone: 'primary',
    description: 'Check symptoms, find care nearby and keep on top of appointments and medication.',
    features: [
      'Guided symptom checker with triage advice',
      'Book appointments with available doctors',
      'Map of nearby hospitals and clinics',
      'Medication and follow-up reminders',
    ],
  },
  {
    to: '/hospital',
    title: 'Hospital portal',
    icon: LocalHospitalOutlinedIcon,
    tone: 'secondary',
    description: 'Monitor capacity, triage incoming reports and prepare for demand surges.',
    features: [
      'Live triage queue from patient reports',
      'Bed and staff allocation',
      'Crisis alerts and surge forecasts',
      'Appointment schedule management',
    ],
  },
];

export default function HomePage() {
  usePageTitle(null);

  return (
    <Box>
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 760,
          mx: 'auto',
          pt: { xs: 2, md: 6 },
          pb: { xs: 4, md: 7 },
        }}
      >
        <BrandMark size={64} sx={{ mb: 2 }} />
        <Chip label="Demo · simulated data" size="small" variant="outlined" sx={{ mb: 2 }} />
        <Typography variant="h1" sx={{ mb: 2 }}>
          Connected care for patients and hospitals
        </Typography>
        <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400 }}>
          PulseGuard links what patients report at home with what care teams see on the ward — so
          people get to the right care sooner and hospitals can plan ahead.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {portals.map((portal) => {
          const Icon = portal.icon;
          return (
            <Grid key={portal.to} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  '&:hover': { boxShadow: 4, borderColor: `${portal.tone}.main` },
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 3, sm: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 52,
                      height: 52,
                      borderRadius: 3,
                      mb: 2,
                      color: `${portal.tone}.main`,
                      bgcolor: 'action.hover',
                    }}
                  >
                    <Icon fontSize="large" />
                  </Box>
                  <Typography variant="h4" component="h2" gutterBottom>
                    {portal.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {portal.description}
                  </Typography>
                  <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0, mb: 3 }}>
                    {portal.features.map((feature) => (
                      <Stack
                        component="li"
                        key={feature}
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center' }}
                      >
                        <CheckCircleOutlineIcon
                          fontSize="small"
                          color="success"
                          aria-hidden="true"
                        />
                        <Typography variant="body2">{feature}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    component={RouterLink}
                    to={portal.to}
                    variant="contained"
                    color={portal.tone}
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ mt: 'auto', alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                  >
                    Open {portal.title.toLowerCase()}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
