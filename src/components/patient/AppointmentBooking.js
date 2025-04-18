import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Mock data for doctors and their available slots
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Smith',
    department: 'Cardiology',
    specialization: 'Heart Specialist',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Dr. Johnson',
    department: 'General Medicine',
    specialization: 'Primary Care',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Dr. Wilson',
    department: 'Pediatrics',
    specialization: 'Child Care',
    rating: 4.9,
  },
];

// Generate mock available slots for the next 7 days
const generateMockSlots = () => {
  const slots = [];
  const startTime = 9; // 9 AM
  const endTime = 17; // 5 PM
  const interval = 30; // 30 minutes

  for (let i = 0; i < 7; i++) {
    const date = addDays(new Date(), i);
    const daySlots = [];

    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = new Date(date);
        time.setHours(hour, minute, 0, 0);

        // Randomly mark some slots as unavailable
        const isAvailable = Math.random() > 0.3;

        daySlots.push({
          id: `${date.toISOString()}-${hour}-${minute}`,
          time,
          isAvailable,
        });
      }
    }

    slots.push({
      date,
      slots: daySlots,
    });
  }

  return slots;
};

const mockAvailableSlots = generateMockSlots();

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [addToReminders, setAddToReminders] = useState(true);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    if (slot.isAvailable) {
      setSelectedSlot(slot);
      setOpenConfirmation(true);
    }
  };

  const handleDoctorSelect = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleConfirmBooking = () => {
    setOpenConfirmation(false);
    setOpenSuccess(true);
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    if (addToReminders) {
      // Navigate to reminders page
      navigate('/patient/reminders');
    }
  };

  const getAvailableSlotsForDate = (date) => {
    const dayData = mockAvailableSlots.find((day) =>
      isSameDay(day.date, date)
    );
    return dayData ? dayData.slots : [];
  };

  const formatTime = (date) => {
    return format(date, 'h:mm a');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book an Appointment
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Select your preferred doctor and time slot
        </Typography>

        <Grid container spacing={3}>
          {/* Doctor Selection */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Select Doctor
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={selectedDoctor}
                  label="Doctor"
                  onChange={handleDoctorSelect}
                >
                  {mockDoctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="body1">{doctor.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {doctor.department} - {doctor.specialization}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h6" gutterBottom>
                Select Date
              </Typography>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <Box sx={{ mb: 3 }}>
                    <TextField {...params} fullWidth />
                  </Box>
                )}
                minDate={new Date()}
                maxDate={addDays(new Date(), 7)}
              />
            </Paper>
          </Grid>

          {/* Time Slots */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Available Time Slots
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </Typography>

              <Grid container spacing={2}>
                {getAvailableSlotsForDate(selectedDate).map((slot) => (
                  <Grid item xs={12} sm={6} md={4} key={slot.id}>
                    <ListItemButton
                      onClick={() => handleSlotSelect(slot)}
                      disabled={!slot.isAvailable}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        opacity: slot.isAvailable ? 1 : 0.5,
                      }}
                    >
                      <ListItemText
                        primary={formatTime(slot.time)}
                        secondary={
                          slot.isAvailable ? (
                            <Chip
                              size="small"
                              label="Available"
                              color="success"
                              icon={<AccessTimeIcon />}
                            />
                          ) : (
                            <Chip
                              size="small"
                              label="Unavailable"
                              color="error"
                              icon={<AccessTimeIcon />}
                            />
                          )
                        }
                      />
                    </ListItemButton>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <Dialog open={openConfirmation} onClose={() => setOpenConfirmation(false)}>
          <DialogTitle>Confirm Appointment</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Appointment Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Doctor"
                    secondary={mockDoctors.find((d) => d.id === selectedDoctor)?.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Date"
                    secondary={format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Time"
                    secondary={selectedSlot ? formatTime(selectedSlot.time) : ''}
                  />
                </ListItem>
              </List>
            </Box>
            <FormControl fullWidth>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Add to follow-up reminders
                </Typography>
              </Box>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmation(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Message */}
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000}
          onClose={handleCloseSuccess}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            sx={{ width: '100%' }}
          >
            Appointment booked successfully! You can view it in your reminders.
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default AppointmentBooking; 