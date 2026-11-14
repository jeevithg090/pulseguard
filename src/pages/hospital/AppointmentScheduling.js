import React, { useMemo, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { addHours, isToday, startOfHour } from 'date-fns';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatCard from '../../components/common/StatCard';
import ResponsiveTable from '../../components/common/ResponsiveTable';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import { useToast } from '../../state/ToastProvider';
import { APPOINTMENT_STATUSES, APPOINTMENT_TYPES, DEPARTMENTS } from '../../data/hospital';
import { DOCTORS } from '../../data/doctors';
import { patientAppointmentsForSchedule } from '../../utils/hospital';
import { toDateTimeLocalValue } from '../../utils/reminders';
import { formatDateTime } from '../../utils/format';
import { createId } from '../../utils/id';

const STATUS_COLOR = {
  Confirmed: 'success',
  Pending: 'warning',
  Completed: 'info',
  Cancelled: 'default',
};

const emptyAppointment = () => ({
  id: createId('ha'),
  patientName: '',
  type: 'Consultation',
  doctor: DOCTORS[0].name,
  department: DOCTORS[0].specialty,
  datetime: toDateTimeLocalValue(addHours(startOfHour(new Date()), 2)),
  status: 'Pending',
  notes: '',
});

function validate(appt) {
  const errors = {};
  if (!appt.patientName.trim()) errors.patientName = 'Enter a patient reference.';
  if (!appt.datetime || Number.isNaN(new Date(appt.datetime).getTime()))
    errors.datetime = 'Choose a date and time.';
  return errors;
}

function Field({ label, value, options, onChange, disabled }) {
  const id = `appt-${label.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select labelId={id} label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function AppointmentScheduling() {
  usePageTitle('Appointment scheduling');
  const { hospitalAppointments, setHospitalAppointments, appointments, setAppointments } =
    useAppData();
  const showToast = useToast();
  const [statusFilter, setStatusFilter] = useState('all');
  const [editor, setEditor] = useState(null);
  const [errors, setErrors] = useState({});

  const all = useMemo(
    () =>
      [
        ...hospitalAppointments.map((a) => ({ ...a, source: 'hospital' })),
        ...patientAppointmentsForSchedule(appointments),
      ].sort((a, b) => new Date(a.datetime) - new Date(b.datetime)),
    [hospitalAppointments, appointments],
  );
  const rows = all.filter((a) => statusFilter === 'all' || a.status === statusFilter);

  const stats = {
    today: all.filter((a) => isToday(new Date(a.datetime)) && a.status !== 'Cancelled').length,
    pending: all.filter((a) => a.status === 'Pending').length,
    confirmed: all.filter((a) => a.status === 'Confirmed').length,
    departments: new Set(all.map((a) => a.department)).size,
  };

  const openEditor = (appt) => {
    setErrors({});
    setEditor(
      appt
        ? { isNew: false, value: { ...appt, datetime: toDateTimeLocalValue(appt.datetime) } }
        : { isNew: true, value: emptyAppointment() },
    );
  };
  const update = (patch) => setEditor((e) => ({ ...e, value: { ...e.value, ...patch } }));

  const save = (event) => {
    event.preventDefault();
    const { value, isNew } = editor;
    const nextErrors = validate(value);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (value.source === 'patient') {
      setAppointments((prev) =>
        prev.map((a) => (a.id === value.id ? { ...a, status: value.status } : a)),
      );
    } else {
      const { source, ...record } = value;
      const clean = {
        ...record,
        patientName: record.patientName.trim(),
        datetime: new Date(record.datetime).toISOString(),
      };
      setHospitalAppointments((prev) =>
        isNew ? [...prev, clean] : prev.map((a) => (a.id === clean.id ? clean : a)),
      );
    }
    showToast(isNew ? 'Appointment created' : 'Appointment updated');
    setEditor(null);
  };

  const columns = [
    {
      key: 'patientName',
      label: 'Patient',
      primary: true,
      render: (a) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <span>{a.patientName}</span>
          {a.source === 'patient' && (
            <Chip size="small" label="Portal" color="primary" variant="outlined" />
          )}
        </Stack>
      ),
    },
    { key: 'datetime', label: 'When', render: (a) => formatDateTime(a.datetime) },
    { key: 'type', label: 'Type' },
    { key: 'doctor', label: 'Doctor', render: (a) => `${a.doctor} · ${a.department}` },
    {
      key: 'status',
      label: 'Status',
      render: (a) => <Chip size="small" label={a.status} color={STATUS_COLOR[a.status]} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (a) => (
        <Tooltip title="Edit appointment">
          <IconButton
            aria-label={`Edit appointment for ${a.patientName}`}
            onClick={() => openEditor(a)}
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const v = editor?.value;
  const locked = v?.source === 'patient';

  return (
    <>
      <PageHeader
        eyebrow="Hospital portal"
        title="Appointment scheduling"
        description="Every appointment across departments, including bookings made in the patient portal."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => openEditor(null)}>
            New appointment
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Today"
            value={stats.today}
            icon={<EventOutlinedIcon />}
            helper="Excluding cancelled"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<PendingActionsOutlinedIcon />}
            tone="warning"
            helper="Need confirmation"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Confirmed"
            value={stats.confirmed}
            icon={<EventAvailableOutlinedIcon />}
            tone="success"
            helper="Upcoming and today"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Departments"
            value={stats.departments}
            icon={<ApartmentOutlinedIcon />}
            tone="secondary"
            helper="With bookings"
          />
        </Grid>
      </Grid>

      <SectionCard id="schedule" title="Schedule" icon={<CalendarMonthOutlinedIcon />}>
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}
          role="group"
          aria-label="Filter by status"
        >
          {['all', ...APPOINTMENT_STATUSES].map((s) => (
            <Chip
              key={s}
              clickable
              label={
                s === 'all'
                  ? `All (${all.length})`
                  : `${s} (${all.filter((a) => a.status === s).length})`
              }
              color={statusFilter === s ? 'primary' : 'default'}
              variant={statusFilter === s ? 'filled' : 'outlined'}
              aria-pressed={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            />
          ))}
        </Stack>
        <ResponsiveTable
          caption="Appointment schedule"
          columns={columns}
          rows={rows}
          empty={
            <EmptyState dense title="No appointments" description="Nothing matches this filter." />
          }
        />
      </SectionCard>

      <Dialog
        open={Boolean(editor)}
        onClose={() => setEditor(null)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="appt-dialog-title"
      >
        {editor && (
          <form onSubmit={save} noValidate>
            <DialogTitle id="appt-dialog-title">
              {editor.isNew ? 'New appointment' : 'Edit appointment'}
            </DialogTitle>
            <DialogContent>
              {locked && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Booked by the patient online — only the status can be changed here.
                </Typography>
              )}
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                <TextField
                  required
                  autoFocus={!locked}
                  disabled={locked}
                  label="Patient reference"
                  placeholder="e.g. Patient #4901"
                  value={v.patientName}
                  onChange={(e) => update({ patientName: e.target.value })}
                  error={Boolean(errors.patientName)}
                  helperText={errors.patientName}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Field
                    label="Type"
                    value={v.type}
                    options={APPOINTMENT_TYPES}
                    onChange={(type) => update({ type })}
                    disabled={locked}
                  />
                  <Field
                    label="Status"
                    value={v.status}
                    options={APPOINTMENT_STATUSES}
                    onChange={(status) => update({ status })}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Field
                    label="Doctor"
                    value={v.doctor}
                    options={[...new Set([v.doctor, ...DOCTORS.map((d) => d.name)])]}
                    onChange={(doctor) =>
                      update({
                        doctor,
                        department:
                          DOCTORS.find((d) => d.name === doctor)?.specialty ?? v.department,
                      })
                    }
                    disabled={locked}
                  />
                  <Field
                    label="Department"
                    value={v.department}
                    options={[...new Set([v.department, ...DEPARTMENTS])]}
                    onChange={(department) => update({ department })}
                    disabled={locked}
                  />
                </Stack>
                <TextField
                  required
                  disabled={locked}
                  type="datetime-local"
                  label="Date and time"
                  value={v.datetime}
                  onChange={(e) => update({ datetime: e.target.value })}
                  error={Boolean(errors.datetime)}
                  helperText={errors.datetime}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="Notes"
                  multiline
                  minRows={2}
                  disabled={locked}
                  value={v.notes}
                  onChange={(e) => update({ notes: e.target.value })}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setEditor(null)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </>
  );
}
