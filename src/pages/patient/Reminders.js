import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { addHours, startOfHour } from 'date-fns';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import { useToast } from '../../state/ToastProvider';
import {
  REMINDER_TYPES,
  REPEAT_OPTIONS,
  reminderStatus,
  sortReminders,
  toDateTimeLocalValue,
  validateReminder,
} from '../../utils/reminders';
import { notificationPermission, requestNotificationPermission } from '../../utils/notifications';
import { formatDateTime } from '../../utils/format';
import { createId } from '../../utils/id';

const TYPE_ICONS = {
  medication: MedicationOutlinedIcon,
  test: ScienceOutlinedIcon,
  appointment: EventOutlinedIcon,
  other: PushPinOutlinedIcon,
};

const STATUS_CHIPS = {
  overdue: { label: 'Overdue', color: 'error' },
  today: { label: 'Within 24h', color: 'warning' },
  upcoming: { label: 'Upcoming', color: 'default' },
  done: { label: 'Done', color: 'success' },
};

const emptyForm = () => ({
  title: '',
  type: 'medication',
  datetime: toDateTimeLocalValue(addHours(startOfHour(new Date()), 1)),
  repeat: 'none',
  notify: true,
});

export default function Reminders() {
  usePageTitle('Reminders');
  const { reminders, setReminders } = useAppData();
  const showToast = useToast();
  const [filter, setFilter] = useState('active');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [permission, setPermission] = useState(notificationPermission);

  const visible = useMemo(() => {
    const sorted = sortReminders(reminders);
    if (filter === 'active') return sorted.filter((r) => !r.completed);
    if (filter === 'done') return sorted.filter((r) => r.completed);
    return sorted;
  }, [reminders, filter]);

  const counts = {
    active: reminders.filter((r) => !r.completed).length,
    done: reminders.filter((r) => r.completed).length,
    all: reminders.length,
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (reminder) => {
    setEditingId(reminder.id);
    setForm({
      title: reminder.title,
      type: reminder.type,
      datetime: toDateTimeLocalValue(reminder.datetime),
      repeat: reminder.repeat,
      notify: reminder.notify,
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const original = reminders.find((r) => r.id === editingId);
    const dateChanged = !original || toDateTimeLocalValue(original.datetime) !== form.datetime;
    const nextErrors = validateReminder(form, { isNew: dateChanged });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const record = {
      ...form,
      title: form.title.trim(),
      datetime: new Date(form.datetime).toISOString(),
    };
    if (editingId) {
      setReminders((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, ...record, notified: dateChanged ? false : r.notified } : r,
        ),
      );
      showToast('Reminder updated');
    } else {
      setReminders((prev) => [
        ...prev,
        { id: createId('rem'), ...record, notified: false, completed: false },
      ]);
      showToast('Reminder added');
    }
    setDialogOpen(false);
  };

  const toggleDone = (reminder) =>
    setReminders((prev) =>
      prev.map((r) => (r.id === reminder.id ? { ...r, completed: !r.completed } : r)),
    );

  const handleDelete = (reminder) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminder.id));
    showToast(`Deleted “${reminder.title}”`, {
      severity: 'info',
      actionLabel: 'Undo',
      onAction: () => setReminders((prev) => [...prev, reminder]),
    });
  };

  const enableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') showToast('Browser notifications enabled');
  };

  return (
    <>
      <PageHeader
        eyebrow="Patient portal"
        title="Reminders"
        description="Medication, tests and appointments — PulseGuard alerts you while the app is open."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
            Add reminder
          </Button>
        }
      />

      {permission === 'default' && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={enableNotifications}>
              Enable
            </Button>
          }
        >
          Turn on browser notifications to be alerted even when this tab is in the background.
        </Alert>
      )}
      {permission === 'denied' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Browser notifications are blocked. You’ll still see in-app alerts; to change this, allow
          notifications for this site in your browser settings.
        </Alert>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 2 }} role="group" aria-label="Filter reminders">
        {[
          ['active', 'Active'],
          ['done', 'Done'],
          ['all', 'All'],
        ].map(([value, label]) => (
          <Chip
            key={value}
            label={`${label} (${counts[value]})`}
            clickable
            aria-pressed={filter === value}
            color={filter === value ? 'primary' : 'default'}
            variant={filter === value ? 'filled' : 'outlined'}
            onClick={() => setFilter(value)}
          />
        ))}
      </Stack>

      {visible.length === 0 ? (
        <EmptyState
          icon={<NotificationsActiveOutlinedIcon />}
          title={filter === 'done' ? 'Nothing completed yet' : 'No reminders yet'}
          description={
            filter === 'done'
              ? 'Reminders you tick off appear here.'
              : 'Add a reminder for your next dose, test or appointment.'
          }
          action={
            filter !== 'done' && (
              <Button variant="outlined" startIcon={<AddIcon />} onClick={openNew}>
                Add your first reminder
              </Button>
            )
          }
        />
      ) : (
        <Grid container spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {visible.map((reminder) => {
            const status = reminderStatus(reminder);
            const Icon = TYPE_ICONS[reminder.type] ?? PushPinOutlinedIcon;
            const typeLabel = REMINDER_TYPES.find((t) => t.value === reminder.type)?.label;
            return (
              <Grid key={reminder.id} size={{ xs: 12, sm: 6, lg: 4 }} component="li">
                <Card sx={{ height: '100%', opacity: reminder.completed ? 0.75 : 1 }}>
                  <CardContent
                    sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1.5 }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                      <Checkbox
                        checked={reminder.completed}
                        onChange={() => toggleDone(reminder)}
                        slotProps={{
                          input: {
                            'aria-label': `Mark “${reminder.title}” as ${reminder.completed ? 'not done' : 'done'}`,
                          },
                        }}
                        sx={{ mt: -0.75, ml: -1 }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            textDecoration: reminder.completed ? 'line-through' : 'none',
                            wordBreak: 'break-word',
                          }}
                        >
                          {reminder.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(reminder.datetime)}
                        </Typography>
                      </Box>
                      <Chip size="small" {...STATUS_CHIPS[status]} />
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center', mt: 'auto' }}
                    >
                      <Chip size="small" variant="outlined" icon={<Icon />} label={typeLabel} />
                      {reminder.repeat !== 'none' && (
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={<RepeatIcon />}
                          label={REPEAT_OPTIONS.find((o) => o.value === reminder.repeat)?.label}
                        />
                      )}
                      {!reminder.notify && (
                        <Tooltip title="Notifications off">
                          <NotificationsOffOutlinedIcon
                            fontSize="small"
                            color="action"
                            aria-label="Notifications off"
                          />
                        </Tooltip>
                      )}
                      <Box sx={{ flexGrow: 1 }} />
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label={`Edit ${reminder.title}`}
                          onClick={() => openEdit(reminder)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label={`Delete ${reminder.title}`}
                          onClick={() => handleDelete(reminder)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="reminder-dialog-title"
      >
        <form onSubmit={handleSave} noValidate>
          <DialogTitle id="reminder-dialog-title">
            {editingId ? 'Edit reminder' : 'New reminder'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                autoFocus
                required
                label="Title"
                placeholder="e.g. Take vitamin D"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                error={Boolean(errors.title)}
                helperText={errors.title}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="reminder-type">Type</InputLabel>
                  <Select
                    labelId="reminder-type"
                    label="Type"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  >
                    {REMINDER_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="reminder-repeat">Repeat</InputLabel>
                  <Select
                    labelId="reminder-repeat"
                    label="Repeat"
                    value={form.repeat}
                    onChange={(e) => setForm((f) => ({ ...f, repeat: e.target.value }))}
                  >
                    {REPEAT_OPTIONS.map((o) => (
                      <MenuItem key={o.value} value={o.value}>
                        {o.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <TextField
                required
                type="datetime-local"
                label="Date and time"
                value={form.datetime}
                onChange={(e) => setForm((f) => ({ ...f, datetime: e.target.value }))}
                error={Boolean(errors.datetime)}
                helperText={errors.datetime}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.notify}
                    onChange={(e) => setForm((f) => ({ ...f, notify: e.target.checked }))}
                  />
                }
                label="Send a browser notification"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Save changes' : 'Add reminder'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
