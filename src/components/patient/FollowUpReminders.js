import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  Card,
  CardContent,
  Grid,
  Alert,
  Snackbar,
  Container
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  NotificationsActive as NotificationsActiveIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  Repeat as RepeatIcon,
  LocalHospital as MedicationIcon,
  Science as TestIcon,
  Assignment as AppointmentIcon
} from '@mui/icons-material';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, addDays, isAfter, isBefore } from 'date-fns';

const reminderTypes = [
  { id: 'medication', label: 'Medication', icon: <MedicationIcon />, color: '#1976d2' },
  { id: 'test', label: 'Test/Lab Work', icon: <TestIcon />, color: '#2e7d32' },
  { id: 'appointment', label: 'Appointment', icon: <AppointmentIcon />, color: '#ed6c02' }
];

const repeatOptions = [
  { value: 'none', label: 'Do not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const FollowUpReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderType, setReminderType] = useState('medication');
  const [repeatOption, setRepeatOption] = useState('none');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationSnackbar, setNotificationSnackbar] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
    
    // Request notification permission on component mount
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationMessage('Notifications enabled!');
          setNotificationSnackbar(true);
        }
      });
    }
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Check for due reminders every 30 seconds
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.datetime);
        if (!reminder.notified && isAfter(now, reminderTime)) {
          // Show notification
          if (Notification.permission === 'granted' && reminder.notificationEnabled) {
            new Notification(reminder.title, {
              body: `Time for your ${reminderTypes.find(t => t.id === reminder.type)?.label}: ${reminder.title}`,
              icon: '/notification-icon.png',
              requireInteraction: true // Keep notification visible until user interacts
            });
          }
          
          // Update reminder as notified
          setReminders(prev => prev.map(r => 
            r.id === reminder.id ? { ...r, notified: true } : r
          ));
          
          // Show snackbar
          setNotificationMessage(`Time for your ${reminder.title}!`);
          setNotificationSnackbar(true);
          
          // If repeating reminder, create next occurrence
          if (reminder.repeat !== 'none') {
            createNextReminder(reminder);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [reminders]);

  const createNextReminder = (reminder) => {
    const nextDate = new Date(reminder.datetime);
    switch (reminder.repeat) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      default:
        return;
    }

    const newReminder = {
      ...reminder,
      id: Date.now(),
      datetime: nextDate.toISOString(),
      notified: false
    };

    setReminders(prev => [...prev, newReminder]);
  };

  const handleAddReminder = () => {
    const datetime = new Date(selectedDate);
    datetime.setHours(selectedTime.getHours());
    datetime.setMinutes(selectedTime.getMinutes());

    const newReminder = {
      id: editingReminder?.id || Date.now(),
      title: reminderTitle,
      type: reminderType,
      datetime: datetime.toISOString(),
      repeat: repeatOption,
      notificationEnabled,
      notified: false
    };

    if (editingReminder) {
      setReminders(prev => prev.map(r => 
        r.id === editingReminder.id ? newReminder : r
      ));
      setNotificationMessage('Reminder updated successfully!');
    } else {
      setReminders(prev => [...prev, newReminder]);
      setNotificationMessage('New reminder added successfully!');
    }

    setNotificationSnackbar(true);
    handleCloseDialog();
  };

  const handleDeleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setNotificationMessage('Reminder deleted successfully!');
    setNotificationSnackbar(true);
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setReminderTitle(reminder.title);
    setReminderType(reminder.type);
    setSelectedDate(new Date(reminder.datetime));
    setSelectedTime(new Date(reminder.datetime));
    setRepeatOption(reminder.repeat);
    setNotificationEnabled(reminder.notificationEnabled);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReminder(null);
    setReminderTitle('');
    setReminderType('medication');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setRepeatOption('none');
    setNotificationEnabled(true);
  };

  const getReminderColor = (reminder) => {
    const now = new Date();
    const reminderTime = new Date(reminder.datetime);
    if (reminder.notified) return 'default';
    if (isBefore(reminderTime, now)) return 'error';
    if (isBefore(reminderTime, addDays(now, 1))) return 'warning';
    return 'primary';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon fontSize="large" />
                <Typography variant="h4">Follow-up Reminders</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                size="large"
              >
                ADD REMINDER
              </Button>
            </Box>

            <Grid container spacing={3}>
              {reminders
                .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
                .map((reminder) => (
                <Grid item xs={12} sm={6} md={4} key={reminder.id}>
                  <Card 
                    sx={{ 
                      position: 'relative',
                      borderLeft: `4px solid ${reminderTypes.find(t => t.id === reminder.type)?.color}`,
                      '&:hover': { 
                        transform: 'translateY(-2px)', 
                        transition: 'transform 0.2s',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" component="div" sx={{ color: reminderTypes.find(t => t.id === reminder.type)?.color }}>
                          {reminder.title}
                        </Typography>
                        <Chip
                          icon={reminderTypes.find(t => t.id === reminder.type)?.icon}
                          label={reminderTypes.find(t => t.id === reminder.type)?.label}
                          color={getReminderColor(reminder)}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                          {format(new Date(reminder.datetime), 'h:mm a')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarTodayIcon fontSize="small" />
                        <Typography variant="body2">
                          {format(new Date(reminder.datetime), 'MMM d, yyyy')}
                        </Typography>
                      </Box>

                      {reminder.repeat !== 'none' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <RepeatIcon fontSize="small" />
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            Repeats {reminder.repeat}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditReminder(reminder)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteReminder(reminder.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {reminders.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <NotificationsActiveIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No reminders yet
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Click the "Add Reminder" button to create your first reminder
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Your First Reminder
                </Button>
              </Box>
            )}
          </Paper>
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                label="Reminder Title"
                fullWidth
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                placeholder="Enter reminder title..."
              />

              <FormControl fullWidth>
                <InputLabel>Reminder Type</InputLabel>
                <Select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  label="Reminder Type"
                >
                  {reminderTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={setSelectedDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
              />

              <TimePicker
                label="Time"
                value={selectedTime}
                onChange={setSelectedTime}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />

              <FormControl fullWidth>
                <InputLabel>Repeat</InputLabel>
                <Select
                  value={repeatOption}
                  onChange={(e) => setRepeatOption(e.target.value)}
                  label="Repeat"
                >
                  {repeatOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={notificationEnabled}
                    onChange={(e) => setNotificationEnabled(e.target.checked)}
                  />
                }
                label="Enable Notifications"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleAddReminder}
              variant="contained"
              disabled={!reminderTitle}
            >
              {editingReminder ? 'Update' : 'Add'} Reminder
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={notificationSnackbar}
          autoHideDuration={6000}
          onClose={() => setNotificationSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNotificationSnackbar(false)} 
            severity="info" 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notificationMessage}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default FollowUpReminders; 