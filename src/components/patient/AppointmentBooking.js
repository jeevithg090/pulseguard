import React, { useState, useEffect } from 'react';
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
  Avatar,
  Rating,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  CircularProgress,
  Fade,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

// Mock data for doctors and their available slots
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Smith',
    department: 'Cardiology',
    specialization: 'Heart Specialist',
    rating: 4.8,
    experience: '15 years',
    image: 'https://i.pravatar.cc/150?img=1',
    location: 'Main Hospital, Floor 3',
    availableToday: true,
  },
  {
    id: 2,
    name: 'Dr. Johnson',
    department: 'General Medicine',
    specialization: 'Primary Care',
    rating: 4.6,
    experience: '12 years',
    image: 'https://i.pravatar.cc/150?img=2',
    location: 'Main Hospital, Floor 2',
    availableToday: true,
  },
  {
    id: 3,
    name: 'Dr. Wilson',
    department: 'Pediatrics',
    specialization: 'Child Care',
    rating: 4.9,
    experience: '18 years',
    image: 'https://i.pravatar.cc/150?img=3',
    location: 'Children\'s Wing, Floor 1',
    availableToday: false,
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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [consultationType, setConsultationType] = useState('regular');
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [addToReminders, setAddToReminders] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPatientHistory, setShowPatientHistory] = useState(false);

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

  const handleAppointmentTypeChange = (event, newType) => {
    if (newType !== null) {
      setAppointmentType(newType);
    }
  };

  const handleConsultationTypeChange = (event) => {
    setConsultationType(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const togglePatientHistory = () => {
    setShowPatientHistory(!showPatientHistory);
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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Book an Appointment
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Select your preferred doctor and time slot
        </Typography>

        <Grid container spacing={3}>
          {/* Appointment Type Selection */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Appointment Type
              </Typography>
              <ToggleButtonGroup
                value={appointmentType}
                exclusive
                onChange={handleAppointmentTypeChange}
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="in-person">
                  <PersonIcon sx={{ mr: 1 }} />
                  In-Person
                </ToggleButton>
                <ToggleButton value="video">
                  <VideoCallIcon sx={{ mr: 1 }} />
                  Video Consultation
                </ToggleButton>
              </ToggleButtonGroup>

              <FormControl fullWidth>
                <InputLabel>Consultation Type</InputLabel>
                <Select
                  value={consultationType}
                  label="Consultation Type"
                  onChange={handleConsultationTypeChange}
                >
                  <MenuItem value="regular">Regular Check-up</MenuItem>
                  <MenuItem value="follow-up">Follow-up</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="specialist">Specialist Consultation</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Doctor Selection */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Select Doctor
                </Typography>
                <Tooltip title="View Patient History">
                  <IconButton onClick={togglePatientHistory}>
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {showPatientHistory && (
                <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Previous Appointments
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Dr. Smith - Cardiology"
                          secondary="March 15, 2024 - Regular Check-up"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Dr. Johnson - General Medicine"
                          secondary="February 28, 2024 - Follow-up"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              )}

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={selectedDoctor}
                  label="Doctor"
                  onChange={handleDoctorSelect}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {mockDoctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar
                          src={doctor.image}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {doctor.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {doctor.specialization}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Rating
                              value={doctor.rating}
                              precision={0.1}
                              readOnly
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              ({doctor.rating})
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Location Selection */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Location</InputLabel>
                <Select
                  value={selectedLocation}
                  label="Location"
                  onChange={handleLocationChange}
                >
                  <MenuItem value="main">Main Hospital</MenuItem>
                  <MenuItem value="branch1">North Branch</MenuItem>
                  <MenuItem value="branch2">South Branch</MenuItem>
                  <MenuItem value="branch3">East Branch</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <CalendarTodayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
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
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
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
                      selected={selectedSlot?.id === slot.id}
                      sx={{
                        border: '1px solid',
                        borderColor: selectedSlot?.id === slot.id ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        mb: 1,
                        opacity: slot.isAvailable ? 1 : 0.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {formatTime(slot.time)}
                          </Typography>
                        }
                        secondary={
                          slot.isAvailable ? (
                            <Chip
                              size="small"
                              label="Available"
                              color="success"
                              icon={<AccessTimeIcon />}
                              sx={{ mt: 1 }}
                            />
                          ) : (
                            <Chip
                              size="small"
                              label="Unavailable"
                              color="error"
                              icon={<AccessTimeIcon />}
                              sx={{ mt: 1 }}
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

        {/* Enhanced Confirmation Dialog */}
        <Dialog 
          open={openConfirmation} 
          onClose={() => setOpenConfirmation(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            Confirm Appointment
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Appointment Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">Doctor</Typography>
                      </Box>
                    }
                    secondary={mockDoctors.find((d) => d.id === selectedDoctor)?.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">Date</Typography>
                      </Box>
                    }
                    secondary={format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">Time</Typography>
                      </Box>
                    }
                    secondary={selectedSlot ? formatTime(selectedSlot.time) : ''}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">Location</Typography>
                      </Box>
                    }
                    secondary={selectedLocation}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VideoCallIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1">Type</Typography>
                      </Box>
                    }
                    secondary={appointmentType === 'in-person' ? 'In-Person Consultation' : 'Video Consultation'}
                  />
                </ListItem>
              </List>
            </Box>

            {/* Payment Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Payment Method
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                <FormControlLabel value="insurance" control={<Radio />} label="Insurance" />
                <FormControlLabel value="upi" control={<Radio />} label="UPI" />
              </RadioGroup>
            </Box>

            {/* Notifications Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addToReminders}
                    onChange={(e) => setAddToReminders(e.target.checked)}
                  />
                }
                label="Add to follow-up reminders"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enableNotifications}
                    onChange={(e) => setEnableNotifications(e.target.checked)}
                  />
                }
                label="Enable appointment notifications"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenConfirmation(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmBooking}
              sx={{ borderRadius: 2 }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              disabled={isLoading}
            >
              {isLoading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Message */}
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            sx={{ width: '100%', borderRadius: 2 }}
            icon={<CheckCircleIcon fontSize="large" />}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Appointment Booked Successfully!
            </Typography>
            <Typography variant="body2">
              You can view it in your reminders.
            </Typography>
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default AppointmentBooking; 