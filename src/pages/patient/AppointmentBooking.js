import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { format, isSameDay, subHours } from 'date-fns';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import { useToast } from '../../state/ToastProvider';
import { DOCTORS, DOCTORS_BY_ID, SPECIALTIES, VISIT_REASONS } from '../../data/doctors';
import { FACILITIES } from '../../data/facilities';
import { bookableDays, countAvailable, generateSlots } from '../../utils/slots';
import { formatCurrency, initials } from '../../utils/format';
import { createId } from '../../utils/id';

export default function AppointmentBooking() {
  usePageTitle('Book an appointment');
  const [params] = useSearchParams();
  const { appointments, setAppointments, setReminders } = useAppData();
  const showToast = useToast();

  const facilityParam = FACILITIES.find((f) => f.id === params.get('facility'));
  const [specialty, setSpecialty] = useState('all');
  const [doctorId, setDoctorId] = useState(() => {
    const fromParam = params.get('doctor');
    if (DOCTORS_BY_ID[fromParam]) return fromParam;
    return DOCTORS.find((d) => d.facilityId === facilityParam?.id)?.id ?? '';
  });
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState('in-person');
  const [reason, setReason] = useState('checkup');
  const days = useMemo(() => bookableDays(10), []);
  const [day, setDay] = useState(days[0]);
  const [slot, setSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [addReminder, setAddReminder] = useState(true);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  const doctor = DOCTORS_BY_ID[doctorId];
  const visibleDoctors = DOCTORS.filter((d) => specialty === 'all' || d.specialty === specialty);
  const slots = useMemo(
    () => (doctor ? generateSlots({ doctorId: doctor.id, date: day, booked: appointments }) : []),
    [doctor, day, appointments],
  );

  const chooseDoctor = (id) => {
    setDoctorId(id);
    setSlot(null);
    setError('');
    if (!DOCTORS_BY_ID[id].videoAvailable) setMode('in-person');
  };

  const handleConfirm = () => {
    if (!doctor) return setError('Choose a doctor first.');
    if (!slot) return setError('Choose an available time slot.');
    const appointment = {
      id: createId('appt'),
      doctorId: doctor.id,
      datetime: slot.time.toISOString(),
      mode,
      reason,
      notes: notes.trim(),
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [...prev, appointment]);
    if (addReminder) {
      setReminders((prev) => [
        ...prev,
        {
          id: createId('rem'),
          title: `Appointment with ${doctor.name}`,
          type: 'appointment',
          datetime: subHours(slot.time, 2).toISOString(),
          repeat: 'none',
          notify: true,
          notified: false,
          completed: false,
        },
      ]);
    }
    setConfirmed(appointment);
    showToast('Appointment booked');
  };

  if (confirmed) {
    const d = DOCTORS_BY_ID[confirmed.doctorId];
    return (
      <Paper
        variant="outlined"
        sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center', maxWidth: 640, mx: 'auto' }}
        role="status"
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 1 }} aria-hidden="true" />
        <Typography variant="h4" component="h1" gutterBottom>
          You’re booked in
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {d.name} ({d.specialty}) on{' '}
          <strong>{format(new Date(confirmed.datetime), "EEEE d MMMM 'at' h:mm a")}</strong>,{' '}
          {confirmed.mode === 'video' ? 'by video call' : `at ${d.location}`}.
          {addReminder && ' We added a reminder two hours before.'}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ justifyContent: 'center' }}
        >
          <Button component={RouterLink} to="/patient" variant="contained">
            Back to overview
          </Button>
          <Button
            onClick={() => {
              setConfirmed(null);
              setSlot(null);
              setNotes('');
            }}
          >
            Book another
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Patient portal"
        title="Book an appointment"
        description={
          facilityParam
            ? `Showing doctors you can see at ${facilityParam.name}, or pick anyone below.`
            : 'Choose a doctor, then pick a time that suits you.'
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            id="choose-doctor"
            title="1. Choose a doctor"
            subtitle={`${visibleDoctors.length} available`}
          >
            <Stack
              direction="row"
              sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}
              role="group"
              aria-label="Filter by specialty"
            >
              {['all', ...SPECIALTIES].map((s) => (
                <Chip
                  key={s}
                  label={s === 'all' ? 'All specialties' : s}
                  clickable
                  color={specialty === s ? 'primary' : 'default'}
                  variant={specialty === s ? 'filled' : 'outlined'}
                  aria-pressed={specialty === s}
                  onClick={() => setSpecialty(s)}
                />
              ))}
            </Stack>
            <Stack spacing={1.5} role="radiogroup" aria-label="Doctor">
              {visibleDoctors.map((d) => {
                const isSelected = d.id === doctorId;
                return (
                  <Card
                    key={d.id}
                    sx={{
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      borderWidth: isSelected ? 2 : 1,
                      bgcolor: isSelected ? 'action.selected' : 'background.paper',
                    }}
                  >
                    <Stack direction="row" sx={{ alignItems: 'stretch' }}>
                      <CardActionArea
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => chooseDoctor(d.id)}
                        sx={{ flexGrow: 1 }}
                      >
                        <CardContent
                          sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 1.75 }}
                        >
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: 'secondary.main',
                              color: 'secondary.contrastText',
                            }}
                          >
                            {initials(d.name)}
                          </Avatar>
                          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: 700 }}>{d.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {d.specialty} · {d.experienceYears} yrs · {formatCurrency(d.fee)}
                            </Typography>
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                              <Rating
                                value={d.rating}
                                precision={0.1}
                                size="small"
                                readOnly
                                aria-label={`Rated ${d.rating} out of 5`}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {d.rating} ({d.reviews})
                              </Typography>
                              {d.videoAvailable && (
                                <VideocamOutlinedIcon
                                  fontSize="small"
                                  color="action"
                                  titleAccess="Video visits available"
                                />
                              )}
                            </Stack>
                          </Box>
                          {isSelected && (
                            <RadioButtonCheckedIcon color="primary" aria-hidden="true" />
                          )}
                        </CardContent>
                      </CardActionArea>
                      <Divider orientation="vertical" flexItem />
                      <Button
                        onClick={() => setProfile(d)}
                        sx={{ borderRadius: 0, px: 2 }}
                        aria-label={`View profile of ${d.name}`}
                      >
                        Profile
                      </Button>
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <SectionCard
              id="choose-time"
              title="2. Pick a time"
              subtitle={doctor ? doctor.name : 'Choose a doctor to see availability'}
            >
              {!doctor ? (
                <EmptyState
                  dense
                  icon={<PersonOutlineIcon />}
                  title="No doctor selected"
                  description="Availability appears once you choose a doctor."
                />
              ) : (
                <Stack spacing={2}>
                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    value={mode}
                    onChange={(_e, v) => v && setMode(v)}
                    aria-label="Visit type"
                    size="small"
                  >
                    <ToggleButton value="in-person">
                      <PersonOutlineIcon fontSize="small" sx={{ mr: 1 }} /> In person
                    </ToggleButton>
                    <ToggleButton value="video" disabled={!doctor.videoAvailable}>
                      <VideocamOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Video
                    </ToggleButton>
                  </ToggleButtonGroup>

                  <FormControl fullWidth size="small">
                    <InputLabel id="reason-label">Reason for visit</InputLabel>
                    <Select
                      labelId="reason-label"
                      label="Reason for visit"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    >
                      {VISIT_REASONS.map((r) => (
                        <MenuItem key={r.value} value={r.value}>
                          {r.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }} id="day-label">
                      Date
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      role="radiogroup"
                      aria-labelledby="day-label"
                      sx={{ overflowX: 'auto', pb: 1, mx: -0.5, px: 0.5 }}
                    >
                      {days.map((d) => {
                        const active = isSameDay(d, day);
                        const free = countAvailable(
                          generateSlots({ doctorId: doctor.id, date: d, booked: appointments }),
                        );
                        return (
                          <Button
                            key={d.toISOString()}
                            role="radio"
                            aria-checked={active}
                            aria-label={`${format(d, 'EEEE d MMMM')}, ${free} slots`}
                            variant={active ? 'contained' : 'outlined'}
                            onClick={() => {
                              setDay(d);
                              setSlot(null);
                            }}
                            disabled={free === 0}
                            sx={{
                              flexDirection: 'column',
                              minWidth: 64,
                              py: 1,
                              lineHeight: 1.2,
                              flexShrink: 0,
                            }}
                          >
                            <Typography variant="caption" component="span">
                              {format(d, 'EEE')}
                            </Typography>
                            <Typography variant="h6" component="span" sx={{ lineHeight: 1.2 }}>
                              {format(d, 'd')}
                            </Typography>
                            <Typography variant="caption" component="span">
                              {format(d, 'MMM')}
                            </Typography>
                          </Button>
                        );
                      })}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }} id="slot-label">
                      Available times · {format(day, 'EEEE d MMMM')}
                    </Typography>
                    {countAvailable(slots) === 0 ? (
                      <EmptyState
                        dense
                        icon={<EventBusyIcon />}
                        title="Fully booked"
                        description="Try another day."
                      />
                    ) : (
                      <Box
                        role="radiogroup"
                        aria-labelledby="slot-label"
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
                          gap: 1,
                        }}
                      >
                        {slots
                          .filter((s) => s.available)
                          .map((s) => (
                            <Button
                              key={s.id}
                              role="radio"
                              aria-checked={slot?.id === s.id}
                              variant={slot?.id === s.id ? 'contained' : 'outlined'}
                              sx={{ whiteSpace: 'nowrap', px: 1 }}
                              onClick={() => {
                                setSlot(s);
                                setError('');
                              }}
                            >
                              {format(s.time, 'h:mm a')}
                            </Button>
                          ))}
                      </Box>
                    )}
                  </Box>
                </Stack>
              )}
            </SectionCard>

            <SectionCard id="confirm" title="3. Confirm">
              {doctor && slot ? (
                <Box
                  component="dl"
                  sx={{
                    m: 0,
                    mb: 2,
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    columnGap: 2,
                    rowGap: 0.75,
                    '& dt': { color: 'text.secondary' },
                    '& dd': { m: 0, fontWeight: 600 },
                  }}
                >
                  <dt>Doctor</dt>
                  <dd>{doctor.name}</dd>
                  <dt>When</dt>
                  <dd>{format(slot.time, 'EEE d MMM, h:mm a')}</dd>
                  <dt>Where</dt>
                  <dd>{mode === 'video' ? 'Video call' : doctor.location}</dd>
                  <dt>Fee</dt>
                  <dd>{formatCurrency(doctor.fee)} · pay at visit</dd>
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Choose a doctor and a time slot to review your booking.
                </Typography>
              )}
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Notes for the doctor (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 500 } }}
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addReminder}
                    onChange={(e) => setAddReminder(e.target.checked)}
                  />
                }
                label="Remind me 2 hours before"
              />
              {error && (
                <Alert severity="warning" sx={{ my: 1 }} role="alert">
                  {error}
                </Alert>
              )}
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleConfirm}
                sx={{ mt: 1 }}
              >
                Confirm booking
              </Button>
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        open={Boolean(profile)}
        onClose={() => setProfile(null)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="profile-title"
      >
        {profile && (
          <>
            <DialogTitle id="profile-title" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                }}
              >
                {initials(profile.name)}
              </Avatar>
              <Box>
                {profile.name}
                <Typography color="text.secondary">{profile.title}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Typography>{profile.bio}</Typography>
                <ProfileRow label="Location" value={profile.location} />
                <ProfileRow label="Experience" value={`${profile.experienceYears} years`} />
                <ProfileRow label="Qualifications" value={profile.education.join(' · ')} />
                <ProfileRow label="Languages" value={profile.languages.join(', ')} />
                <ProfileRow
                  label="Consultation"
                  value={`${profile.consultationMinutes} min · ${formatCurrency(profile.fee)}`}
                />
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                  {profile.expertise.map((e) => (
                    <Chip key={e} label={e} size="small" variant="outlined" color="primary" />
                  ))}
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setProfile(null)}>Close</Button>
              <Button
                variant="contained"
                onClick={() => {
                  chooseDoctor(profile.id);
                  setProfile(null);
                }}
              >
                Choose this doctor
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

function ProfileRow({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}
