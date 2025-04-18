import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Mock data for appointments and reminders
const mockAppointments = [
  {
    id: 1,
    type: 'Follow-up',
    doctor: 'Dr. Smith',
    specialty: 'Cardiology',
    date: new Date(2024, 3, 20, 14, 30),
    location: 'City General Hospital',
    notes: 'Bring previous test results',
  },
  {
    id: 2,
    type: 'Check-up',
    doctor: 'Dr. Johnson',
    specialty: 'General Medicine',
    date: new Date(2024, 3, 25, 10, 0),
    location: 'Community Health Clinic',
    notes: 'Annual physical examination',
  },
];

const mockReminders = [
  {
    id: 1,
    type: 'Medication',
    title: 'Take Blood Pressure Medication',
    time: '08:00 AM',
    frequency: 'Daily',
    active: true,
  },
  {
    id: 2,
    type: 'Test',
    title: 'Blood Test Results',
    date: new Date(2024, 3, 18),
    active: true,
  },
];

const FollowUpReminders = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [reminders, setReminders] = useState(mockReminders);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    type: '',
    doctor: '',
    specialty: '',
    location: '',
    notes: '',
  });

  const handleAddAppointment = () => {
    if (selectedDate && selectedTime && newAppointment.doctor) {
      const appointment = {
        id: appointments.length + 1,
        ...newAppointment,
        date: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        ),
      };
      setAppointments([...appointments, appointment]);
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setNewAppointment({
      type: '',
      doctor: '',
      specialty: '',
      location: '',
      notes: '',
    });
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(app => app.id !== id));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Appointments Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Upcoming Appointments
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenDialog(true)}
                >
                  Add Appointment
                </Button>
              </Box>

              {appointments.map((appointment) => (
                <Card key={appointment.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {appointment.type} with {appointment.doctor}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {appointment.specialty}
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(appointment.date)} at {formatTime(appointment.date)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Location: {appointment.location}
                    </Typography>
                    {appointment.notes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Notes: {appointment.notes}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Button size="small" color="primary">
                      Reschedule
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Paper>
          </Grid>

          {/* Reminders Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Reminders
                </Typography>
                <Button variant="contained" color="primary">
                  Add Reminder
                </Button>
              </Box>

              {reminders.map((reminder) => (
                <Card key={reminder.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">{reminder.title}</Typography>
                      <Chip
                        label={reminder.type}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    {reminder.time && (
                      <Typography variant="body2" color="textSecondary">
                        Time: {reminder.time} ({reminder.frequency})
                      </Typography>
                    )}
                    {reminder.date && (
                      <Typography variant="body2" color="textSecondary">
                        Date: {formatDate(reminder.date)}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Add Appointment Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Appointment</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Appointment Type"
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Doctor's Name"
                  value={newAppointment.doctor}
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specialty"
                  value={newAppointment.specialty}
                  onChange={(e) => setNewAppointment({ ...newAppointment, specialty: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Time"
                  value={selectedTime}
                  onChange={setSelectedTime}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddAppointment} variant="contained" color="primary">
              Add Appointment
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default FollowUpReminders; 