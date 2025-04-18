import React, { useState } from 'react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    patientName: 'John Doe',
    type: 'Follow-up',
    doctor: 'Dr. Smith',
    department: 'Cardiology',
    date: new Date(2024, 3, 20, 14, 30),
    status: 'Confirmed',
    notes: 'Regular check-up',
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    type: 'Initial Consultation',
    doctor: 'Dr. Johnson',
    department: 'General Medicine',
    date: new Date(2024, 3, 21, 10, 0),
    status: 'Pending',
    notes: 'New patient',
  },
  {
    id: 3,
    patientName: 'Mike Johnson',
    type: 'Emergency',
    doctor: 'Dr. Wilson',
    department: 'Emergency',
    date: new Date(2024, 3, 19, 15, 45),
    status: 'Completed',
    notes: 'Urgent care required',
  },
];

// Mock data for doctors
const mockDoctors = [
  { id: 1, name: 'Dr. Smith', department: 'Cardiology', availability: 'Available' },
  { id: 2, name: 'Dr. Johnson', department: 'General Medicine', availability: 'Busy' },
  { id: 3, name: 'Dr. Wilson', department: 'Emergency', availability: 'Available' },
];

const AppointmentScheduling = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    type: '',
    doctor: '',
    department: '',
    notes: '',
  });

  const handleOpenDialog = (appointment = null) => {
    setSelectedAppointment(appointment);
    if (appointment) {
      setNewAppointment({
        patientName: appointment.patientName,
        type: appointment.type,
        doctor: appointment.doctor,
        department: appointment.department,
        notes: appointment.notes,
      });
      setSelectedDate(appointment.date);
      setSelectedTime(appointment.date);
    } else {
      setNewAppointment({
        patientName: '',
        type: '',
        doctor: '',
        department: '',
        notes: '',
      });
      setSelectedDate(null);
      setSelectedTime(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setNewAppointment({
      patientName: '',
      type: '',
      doctor: '',
      department: '',
      notes: '',
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
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
        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Today's Appointments</Typography>
                </Box>
                <Typography variant="h4">12</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Available Doctors</Typography>
                </Box>
                <Typography variant="h4">8</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Departments</Typography>
                </Box>
                <Typography variant="h4">6</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Pending Reviews</Typography>
                </Box>
                <Typography variant="h4">5</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Appointments Table */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Appointment Schedule</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog()}
            >
              Schedule New Appointment
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.type}</TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>{appointment.department}</TableCell>
                    <TableCell>
                      {formatDate(appointment.date)}
                      <br />
                      {formatTime(appointment.date)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(appointment)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add/Edit Appointment Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Patient Name"
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Appointment Type</InputLabel>
                  <Select
                    value={newAppointment.type}
                    label="Appointment Type"
                    onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                  >
                    <MenuItem value="Initial Consultation">Initial Consultation</MenuItem>
                    <MenuItem value="Follow-up">Follow-up</MenuItem>
                    <MenuItem value="Emergency">Emergency</MenuItem>
                    <MenuItem value="Regular Check-up">Regular Check-up</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    value={newAppointment.doctor}
                    label="Doctor"
                    onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                  >
                    {mockDoctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.name}>
                        {doctor.name} - {doctor.department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={newAppointment.department}
                    label="Department"
                    onChange={(e) => setNewAppointment({ ...newAppointment, department: e.target.value })}
                  >
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="General Medicine">General Medicine</MenuItem>
                    <MenuItem value="Emergency">Emergency</MenuItem>
                    <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                  </Select>
                </FormControl>
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
            <Button variant="contained" color="primary">
              {selectedAppointment ? 'Save Changes' : 'Schedule Appointment'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default AppointmentScheduling; 