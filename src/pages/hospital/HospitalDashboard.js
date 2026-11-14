import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatCard from '../../components/common/StatCard';
import TriageChip from '../../components/common/TriageChip';
import ResponsiveTable from '../../components/common/ResponsiveTable';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import { SEED_ALERTS, SEED_TRIAGE_QUEUE } from '../../data/hospital';
import { buildTriageQueue, summarizeBeds } from '../../utils/hospital';
import { formatRelative } from '../../utils/format';

export default function HospitalDashboard() {
  usePageTitle('Hospital overview');
  const { beds, staff, symptomReports, hospitalAppointments, appointments, acknowledgedAlerts } =
    useAppData();

  const bedSummary = useMemo(() => summarizeBeds(beds), [beds]);
  const queue = useMemo(
    () => buildTriageQueue(SEED_TRIAGE_QUEUE, symptomReports),
    [symptomReports],
  );
  const onDuty = staff.filter((s) => s.status === 'On duty').length;
  const critical = queue.filter((q) => q.level === 'emergency' || q.level === 'urgent').length;
  const openAlerts = SEED_ALERTS.filter((a) => !acknowledgedAlerts.includes(a.id));
  const todayCount = [...hospitalAppointments, ...appointments].filter(
    (a) => new Date(a.datetime).toDateString() === new Date().toDateString(),
  ).length;

  const shortcuts = [
    {
      to: '/hospital/resources',
      title: 'Resources',
      icon: BedOutlinedIcon,
      summary: `${bedSummary.available} beds free · ${onDuty} staff on duty`,
    },
    {
      to: '/hospital/crisis',
      title: 'Crisis prediction',
      icon: WarningAmberOutlinedIcon,
      summary: openAlerts.length ? `${openAlerts.length} active alerts` : 'No active alerts',
    },
    {
      to: '/hospital/appointments',
      title: 'Appointments',
      icon: CalendarMonthOutlinedIcon,
      summary: `${todayCount} scheduled today`,
    },
  ];

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      primary: true,
      render: (r) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <span>{r.patient}</span>
          {r.fromPortal && <Chip size="small" label="Portal" color="primary" variant="outlined" />}
        </Stack>
      ),
    },
    { key: 'age', label: 'Age' },
    { key: 'symptoms', label: 'Symptoms', render: (r) => r.symptoms.join(', ') },
    { key: 'level', label: 'Triage', render: (r) => <TriageChip level={r.level} /> },
    { key: 'submittedAt', label: 'Received', render: (r) => formatRelative(r.submittedAt) },
    { key: 'status', label: 'Status' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Hospital portal"
        title="Operations overview"
        description="A live view of capacity and incoming patient reports (simulated data)."
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Bed occupancy"
            value={`${bedSummary.occupancy}%`}
            progress={bedSummary.occupancy}
            tone={bedSummary.occupancy >= 85 ? 'error' : 'primary'}
            icon={<BedOutlinedIcon />}
            helper={`${bedSummary.occupied} of ${bedSummary.total} beds`}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Triage queue"
            value={queue.length}
            icon={<AssignmentIndOutlinedIcon />}
            helper="Reports awaiting action"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Staff on duty"
            value={onDuty}
            icon={<GroupsOutlinedIcon />}
            tone="success"
            helper={`of ${staff.length} rostered`}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Urgent cases"
            value={critical}
            icon={<ReportProblemOutlinedIcon />}
            tone="error"
            helper="Urgent or emergency"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }} component="nav" aria-label="Hospital sections">
        {shortcuts.map((s) => {
          const Icon = s.icon;
          return (
            <Grid key={s.to} size={{ xs: 12, sm: 4 }}>
              <Card sx={{ height: '100%', '&:hover': { borderColor: 'primary.main' } }}>
                <CardActionArea component={RouterLink} to={s.to} sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      aria-hidden="true"
                      sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}
                    >
                      <Icon />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700 }} component="h2">
                        {s.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.summary}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon color="action" aria-hidden="true" />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <SectionCard
        id="triage-queue"
        title="Symptom triage queue"
        subtitle="Most urgent first. Reports submitted in the patient portal appear here."
        icon={<AssignmentIndOutlinedIcon />}
        action={
          <Button component={RouterLink} to="/patient/symptoms" size="small">
            Submit a test report
          </Button>
        }
      >
        <ResponsiveTable
          caption="Symptom triage queue"
          columns={columns}
          rows={queue}
          empty={<EmptyState dense title="Queue is empty" />}
        />
      </SectionCard>
    </>
  );
}
