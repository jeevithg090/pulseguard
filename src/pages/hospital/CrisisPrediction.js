import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import AirOutlinedIcon from '@mui/icons-material/AirOutlined';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ChecklistIcon from '@mui/icons-material/Checklist';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatCard from '../../components/common/StatCard';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import { useToast } from '../../state/ToastProvider';
import {
  ENVIRONMENT,
  RECOMMENDED_ACTIONS,
  SEED_ALERTS,
  SEED_PREDICTIONS,
} from '../../data/hospital';

const SEVERITY = {
  high: { alert: 'error', label: 'High' },
  medium: { alert: 'warning', label: 'Medium' },
  low: { alert: 'info', label: 'Low' },
};

const probabilityTone = (p) => (p >= 70 ? 'error' : p >= 50 ? 'warning' : 'primary');

export default function CrisisPrediction() {
  usePageTitle('Crisis prediction');
  const { acknowledgedAlerts, setAcknowledgedAlerts } = useAppData();
  const showToast = useToast();
  const active = SEED_ALERTS.filter((a) => !acknowledgedAlerts.includes(a.id));

  const acknowledge = (alert) => {
    setAcknowledgedAlerts((prev) => [...prev, alert.id]);
    showToast(`Acknowledged: ${alert.title}`, {
      severity: 'info',
      actionLabel: 'Undo',
      onAction: () => setAcknowledgedAlerts((prev) => prev.filter((id) => id !== alert.id)),
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Hospital portal"
        title="Crisis prediction"
        description="Early warnings combining environmental conditions and admission trends. Values shown are simulated for the demo."
        actions={
          acknowledgedAlerts.length > 0 && (
            <Button onClick={() => setAcknowledgedAlerts([])}>Restore alerts</Button>
          )
        }
      />

      <SectionCard
        id="alerts"
        title="Active alerts"
        icon={<NotificationsActiveOutlinedIcon />}
        sx={{ mb: 3 }}
        subtitle={`${active.length} need attention`}
      >
        {active.length === 0 ? (
          <EmptyState
            dense
            icon={<TaskAltIcon />}
            title="All alerts acknowledged"
            description="New alerts will appear here."
          />
        ) : (
          <Stack spacing={1.5}>
            {active.map((alert) => (
              <Alert
                key={alert.id}
                severity={SEVERITY[alert.severity].alert}
                variant="outlined"
                action={
                  <Button color="inherit" size="small" onClick={() => acknowledge(alert)}>
                    Acknowledge
                  </Button>
                }
                sx={{ alignItems: 'flex-start', '& .MuiAlert-action': { pt: 0.5 } }}
              >
                <AlertTitle sx={{ fontWeight: 700 }}>
                  {alert.title}{' '}
                  <Chip
                    size="small"
                    label={`${alert.category} · ${SEVERITY[alert.severity].label}`}
                    sx={{ ml: 0.5 }}
                  />
                </AlertTitle>
                <Typography variant="body2">{alert.impact}</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <strong>Suggested action:</strong> {alert.action}
                </Typography>
              </Alert>
            ))}
          </Stack>
        )}
      </SectionCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <SectionCard
            id="forecasts"
            title="Forecasts"
            icon={<TrendingUpIcon />}
            sx={{ height: '100%' }}
          >
            <Stack spacing={2.5}>
              {SEED_PREDICTIONS.map((p) => (
                <Box key={p.id}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}
                  >
                    <Typography sx={{ fontWeight: 700 }} component="h3">
                      {p.metric}
                    </Typography>
                    <Typography
                      sx={{ fontWeight: 700 }}
                      color={`${probabilityTone(p.probability)}.main`}
                    >
                      {p.probability}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={p.probability}
                    color={probabilityTone(p.probability)}
                    aria-label={`${p.metric} probability ${p.probability}%`}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {p.timeframe} · Based on {p.factors.join(', ').toLowerCase()}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard
            id="actions"
            title="Recommended actions"
            icon={<ChecklistIcon />}
            sx={{ height: '100%' }}
          >
            <List disablePadding>
              {RECOMMENDED_ACTIONS.map((a) => (
                <ListItem key={a.id} disableGutters alignItems="flex-start">
                  <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                    <TaskAltIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={a.title}
                    secondary={a.detail}
                    slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                  />
                </ListItem>
              ))}
            </List>
          </SectionCard>
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Environmental conditions
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Temperature"
            value={`${ENVIRONMENT.temperatureC}°C`}
            icon={<ThermostatOutlinedIcon />}
            tone="error"
            helper="Heat advisory threshold 35°C"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Humidity"
            value={`${ENVIRONMENT.humidity}%`}
            icon={<WaterDropOutlinedIcon />}
            tone="info"
            helper="Relative humidity"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Air quality"
            value={ENVIRONMENT.airQuality}
            icon={<AirOutlinedIcon />}
            tone="warning"
            helper={`AQI ${ENVIRONMENT.aqi}`}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Pollen"
            value={ENVIRONMENT.pollen}
            icon={<GrassOutlinedIcon />}
            tone="success"
            helper="Grass and tree pollen"
          />
        </Grid>
      </Grid>
    </>
  );
}
