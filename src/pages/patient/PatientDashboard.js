import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import EmptyState from '../../components/common/EmptyState';
import TriageChip from '../../components/common/TriageChip';
import InsuranceCard from '../../components/patient/InsuranceCard';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import { DEMO_PATIENT, SEED_MESSAGES } from '../../data/patient';
import { DOCTORS_BY_ID } from '../../data/doctors';
import { formatDateTime, formatRelative, greeting, initials } from '../../utils/format';
import { reminderStatus, sortReminders } from '../../utils/reminders';
import { TRIAGE_META } from '../../utils/triage';
import config from '../../config';

const quickActions = [
  {
    title: 'Report symptoms',
    description: 'Get triage advice in a few steps',
    to: '/patient/symptoms',
    icon: AssignmentOutlinedIcon,
    tone: 'primary',
  },
  {
    title: 'Book appointment',
    description: 'Pick a doctor and a time slot',
    to: '/patient/book-appointment',
    icon: EventAvailableOutlinedIcon,
    tone: 'secondary',
  },
  {
    title: 'Find care',
    description: 'Hospitals and clinics near you',
    to: '/patient/facilities',
    icon: PlaceOutlinedIcon,
    tone: 'success',
  },
  {
    title: 'Reminders',
    description: 'Medication and follow-ups',
    to: '/patient/reminders',
    icon: NotificationsOutlinedIcon,
    tone: 'warning',
  },
];

export default function PatientDashboard() {
  usePageTitle('Patient overview');
  const { appointments, reminders, readMessages, symptomReports } = useAppData();

  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.status !== 'Cancelled' && new Date(a.datetime) >= new Date())
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
        .slice(0, 3),
    [appointments],
  );
  const pendingReminders = useMemo(
    () => sortReminders(reminders.filter((r) => !r.completed && !r.notified)).slice(0, 3),
    [reminders],
  );
  const recentMessages = SEED_MESSAGES.slice(0, 3);
  const unreadCount = SEED_MESSAGES.filter((m) => !readMessages.includes(m.id)).length;
  const latestReport = symptomReports[0];

  return (
    <>
      <PageHeader
        eyebrow="Patient portal"
        title={`${greeting()}, ${DEMO_PATIENT.firstName}`}
        description="Here’s your health overview for today."
        actions={
          <Button
            component={RouterLink}
            to="/patient/symptoms"
            variant="contained"
            startIcon={<AssignmentOutlinedIcon />}
          >
            Check symptoms
          </Button>
        }
      />

      <Grid container spacing={2} component="nav" aria-label="Quick actions" sx={{ mb: 3 }}>
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Grid key={action.to} size={{ xs: 6, md: 3 }}>
              <Card sx={{ height: '100%', '&:hover': { borderColor: `${action.tone}.main` } }}>
                <CardActionArea component={RouterLink} to={action.to} sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Box
                      aria-hidden="true"
                      sx={{
                        display: 'grid',
                        placeItems: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        mb: 1.5,
                        color: `${action.tone}.main`,
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography
                      variant="subtitle1"
                      component="h2"
                      sx={{ fontWeight: 700, lineHeight: 1.3 }}
                    >
                      {action.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                      {action.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <SectionCard
            id="upcoming-appointments"
            title="Upcoming appointments"
            icon={<EventAvailableOutlinedIcon />}
            sx={{ height: '100%' }}
            action={
              <Button component={RouterLink} to="/patient/book-appointment" size="small">
                Book new
              </Button>
            }
          >
            {upcomingAppointments.length === 0 ? (
              <EmptyState
                dense
                title="No upcoming appointments"
                description="When you book a visit it will show up here."
                action={
                  <Button component={RouterLink} to="/patient/book-appointment" variant="outlined">
                    Book an appointment
                  </Button>
                }
              />
            ) : (
              <List disablePadding>
                {upcomingAppointments.map((appt, index) => {
                  const doctor = DOCTORS_BY_ID[appt.doctorId];
                  return (
                    <React.Fragment key={appt.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem disableGutters sx={{ py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                            {initials(doctor?.name)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={doctor?.name ?? 'Doctor'}
                          secondary={`${doctor?.specialty ?? ''} · ${formatDateTime(appt.datetime)}`}
                          slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={appt.mode === 'video' ? <VideocamOutlinedIcon /> : undefined}
                          label={appt.mode === 'video' ? 'Video' : 'In person'}
                        />
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard
            id="next-reminders"
            title="Next reminders"
            icon={<NotificationsOutlinedIcon />}
            sx={{ height: '100%' }}
            action={
              <Button component={RouterLink} to="/patient/reminders" size="small">
                Manage
              </Button>
            }
          >
            {pendingReminders.length === 0 ? (
              <EmptyState dense title="You’re all caught up" description="No pending reminders." />
            ) : (
              <List disablePadding>
                {pendingReminders.map((reminder) => {
                  const status = reminderStatus(reminder);
                  return (
                    <ListItem key={reminder.id} disableGutters>
                      <ListItemText
                        primary={reminder.title}
                        secondary={formatDateTime(reminder.datetime)}
                        slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                      />
                      {status === 'overdue' && <Chip size="small" color="error" label="Overdue" />}
                      {status === 'today' && <Chip size="small" color="warning" label="Soon" />}
                    </ListItem>
                  );
                })}
              </List>
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <SectionCard
            id="recent-messages"
            title="Recent messages"
            icon={
              <Badge badgeContent={unreadCount} color="error">
                <MailOutlineIcon />
              </Badge>
            }
            subtitle={unreadCount ? `${unreadCount} unread` : 'No unread messages'}
            sx={{ height: '100%' }}
            action={
              <Button component={RouterLink} to="/patient/messages" size="small">
                View all
              </Button>
            }
          >
            <List disablePadding>
              {recentMessages.map((message) => {
                const unread = !readMessages.includes(message.id);
                return (
                  <ListItemButton
                    key={message.id}
                    component={RouterLink}
                    to={`/patient/messages?open=${message.id}`}
                    sx={{ borderRadius: 2, px: 1.5, alignItems: 'flex-start' }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <span>{message.title}</span>
                          {unread && <Chip label="New" size="small" color="primary" />}
                        </Stack>
                      }
                      secondary={`${message.from} · ${formatRelative(message.date)}`}
                      slotProps={{
                        primary: { component: 'div', sx: { fontWeight: unread ? 700 : 500 } },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard
            id="latest-check"
            title="Latest symptom check"
            icon={<MonitorHeartOutlinedIcon />}
            sx={{ height: '100%' }}
          >
            {latestReport ? (
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
                >
                  <TriageChip level={latestReport.level} />
                  <Typography variant="body2" color="text.secondary">
                    {formatRelative(latestReport.submittedAt)}
                  </Typography>
                </Stack>
                <Typography variant="body2">{TRIAGE_META[latestReport.level].headline}.</Typography>
                <Typography variant="body2" color="text.secondary">
                  Reported: {latestReport.symptoms.map((s) => s.label).join(', ')}
                </Typography>
                <Button
                  component={RouterLink}
                  to="/patient/symptoms"
                  variant="outlined"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  New check
                </Button>
              </Stack>
            ) : (
              <EmptyState
                dense
                title="No symptom checks yet"
                description="Feeling unwell? A quick check tells you where to go."
                action={
                  <Button component={RouterLink} to="/patient/symptoms" variant="outlined">
                    Start a check
                  </Button>
                }
              />
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <InsuranceCard />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard
            id="support"
            title="Contact support"
            subtitle="Questions about bookings, bills or the app"
            icon={<SupportAgentOutlinedIcon />}
            sx={{ height: '100%' }}
          >
            <Stack direction={{ xs: 'column', sm: 'row', md: 'column', lg: 'row' }} spacing={1.5}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<CallOutlinedIcon />}
                href={`tel:${config.supportPhone}`}
              >
                Call support
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SmsOutlinedIcon />}
                href={`sms:${config.supportPhone}`}
              >
                Text support
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {config.supportPhone} · For emergencies call {config.emergencyNumber}.
            </Typography>
          </SectionCard>
        </Grid>
      </Grid>
    </>
  );
}
