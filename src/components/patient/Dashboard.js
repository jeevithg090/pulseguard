import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  TextField,
  IconButton,
  Checkbox,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Navigation as NavigationIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Message as MessageIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Map as MapIcon,
  NotificationsActive as NotificationsActiveIcon,
  Bed as BedIcon,
  Group as GroupIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
} from '@mui/icons-material';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Follow-up with Dr. Smith',
      date: '2024-04-25',
      time: '10:00 AM',
      completed: false,
    },
    {
      id: 2,
      title: 'Lab Test Results',
      date: '2024-04-26',
      time: '2:00 PM',
      completed: false,
    },
  ]);
  const [resourceStatus, setResourceStatus] = useState({
    beds: {
      total: 100,
      available: 25,
      occupied: 75,
    },
    staff: {
      total: 50,
      available: 35,
      onBreak: 10,
      offDuty: 5,
    },
  });

  const handleAddSymptom = () => {
    if (newSymptom.trim()) {
      setSymptoms([...symptoms, {
        id: Date.now(),
        text: newSymptom.trim(),
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setNewSymptom('');
    }
  };

  const handleDeleteSymptom = (id) => {
    setSymptoms(symptoms.filter(symptom => symptom.id !== id));
  };

  const handleMapClick = () => {
    setShowMap(true);
  };

  const handleReminderClick = () => {
    setShowReminders(!showReminders);
  };

  const handleReminderComplete = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const handleContactSupport = (method) => {
    // Implement Twilio API integration here
    console.log(`Contacting support via ${method}`);
  };

  const quickActions = [
    {
      title: 'Report Symptoms',
      icon: <AssignmentIcon />,
      path: '/patient/symptoms',
      color: '#1976d2',
    },
    {
      title: 'Book Appointment',
      icon: <CalendarIcon />,
      path: '/patient/book-appointment',
      color: '#9c27b0',
    },
    {
      title: 'Care Navigation',
      icon: <NavigationIcon />,
      path: '/patient/care-navigation',
      color: '#2e7d32',
    },
    {
      title: 'Follow-up Reminders',
      icon: <NotificationsIcon />,
      path: '/patient/reminders',
      color: '#ed6c02',
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Smith',
      department: 'Cardiology',
      date: '2024-04-25',
      time: '10:00 AM',
    },
    {
      id: 2,
      doctor: 'Dr. Johnson',
      department: 'General Medicine',
      date: '2024-05-02',
      time: '2:30 PM',
    },
  ];

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', status: 'Normal' },
    { label: 'Heart Rate', value: '72 bpm', status: 'Normal' },
    { label: 'Blood Sugar', value: '95 mg/dL', status: 'Normal' },
  ];

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: 37.7749, // Default to San Francisco
    lng: -122.4194
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, John!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's your health overview for today
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.title}>
            <Card>
              <CardActionArea onClick={() => navigate(action.path)}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: `${action.color}15`,
                        borderRadius: '50%',
                        p: 1,
                        mr: 2,
                      }}
                    >
                      {React.cloneElement(action.icon, { sx: { color: action.color } })}
                    </Box>
                    <Typography variant="h6">{action.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Click to {action.title.toLowerCase()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Health Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 2,
            boxShadow: 3
          }}>
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: '#1a237e',
              mb: 3
            }}>
              Health Metrics
            </Typography>
            <List>
              {healthMetrics.map((metric, index) => (
                <React.Fragment key={metric.label}>
                  <ListItem sx={{ 
                    py: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: 1
                    }
                  }}>
                    <ListItemIcon>
                      <TrendingUpIcon sx={{ color: '#1a237e' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ color: '#1a237e' }}>
                          {metric.label}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h5" sx={{ 
                            mr: 2,
                            fontWeight: 'bold',
                            color: metric.status === 'Normal' ? '#2e7d32' : '#d32f2f'
                          }}>
                            {metric.value}
                          </Typography>
                          <Chip
                            label={metric.status}
                            color={metric.status === 'Normal' ? 'success' : 'error'}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < healthMetrics.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Real-time Symptom Tracking */}
          <Paper sx={{ 
            p: 3,
            mt: 3,
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            borderRadius: 2,
            boxShadow: 3
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: '#e65100',
              mb: 3
            }}>
              Symptom Tracker
            </Typography>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your symptom..."
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAddSymptom}
                sx={{
                  backgroundColor: '#e65100',
                  '&:hover': {
                    backgroundColor: '#f57c00'
                  }
                }}
              >
                <AddIcon />
              </Button>
            </Box>
            <List>
              {symptoms.map((symptom) => (
                <ListItem
                  key={symptom.id}
                  sx={{
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: 1
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {symptom.text}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Added at {symptom.timestamp}
                      </Typography>
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteSymptom(symptom.id)}
                    sx={{ color: '#e65100' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: 2,
            boxShadow: 3
          }}>
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: '#0d47a1',
              mb: 3
            }}>
              Upcoming Appointments
            </Typography>
            <List>
              {upcomingAppointments.map((appointment, index) => (
                <React.Fragment key={appointment.id}>
                  <ListItem sx={{ 
                    py: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: 1
                    }
                  }}>
                    <ListItemIcon>
                      <CalendarIcon sx={{ color: '#0d47a1' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ color: '#0d47a1' }}>
                          {appointment.doctor}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {appointment.department}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#0d47a1' }}>
                            {appointment.date} at {appointment.time}
                          </Typography>
                        </>
                      }
                    />
                    <Button 
                      variant="contained" 
                      size="small"
                      sx={{ 
                        backgroundColor: '#0d47a1',
                        '&:hover': {
                          backgroundColor: '#1565c0'
                        }
                      }}
                    >
                      Reschedule
                    </Button>
                  </ListItem>
                  {index < upcomingAppointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Messages */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Messages</Typography>
              <Button startIcon={<MessageIcon />} variant="outlined">
                View All
              </Button>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <MessageIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Appointment Reminder"
                  secondary="Your appointment with Dr. Smith is scheduled for tomorrow at 10:00 AM"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <MessageIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Lab Results Available"
                  secondary="Your recent blood work results are now available in your patient portal"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Resource Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            borderRadius: 2,
            boxShadow: 3
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: '#1565c0',
              mb: 3
            }}>
              Resource Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, background: 'white', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BedIcon sx={{ color: '#1565c0', mr: 1 }} />
                    <Typography variant="h6">Bed Availability</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Beds: {resourceStatus.beds.total}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      Available: {resourceStatus.beds.available}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      Occupied: {resourceStatus.beds.occupied}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(resourceStatus.beds.occupied / resourceStatus.beds.total) * 100}
                    color={resourceStatus.beds.available < 10 ? 'error' : 'primary'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, background: 'white', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GroupIcon sx={{ color: '#1565c0', mr: 1 }} />
                    <Typography variant="h6">Staff Status</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Staff: {resourceStatus.staff.total}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      Available: {resourceStatus.staff.available}
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                      On Break: {resourceStatus.staff.onBreak}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      Off Duty: {resourceStatus.staff.offDuty}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(resourceStatus.staff.available / resourceStatus.staff.total) * 100}
                    color={resourceStatus.staff.available < 15 ? 'error' : 'primary'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Contact Support */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
            borderRadius: 2,
            boxShadow: 3
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 'bold',
              color: '#c2185b',
              mb: 3
            }}>
              Contact Support
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  onClick={() => handleContactSupport('voice')}
                  fullWidth
                  sx={{
                    backgroundColor: '#c2185b',
                    '&:hover': {
                      backgroundColor: '#e91e63'
                    }
                  }}
                >
                  Call Support
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  startIcon={<SmsIcon />}
                  onClick={() => handleContactSupport('sms')}
                  fullWidth
                  sx={{
                    backgroundColor: '#c2185b',
                    '&:hover': {
                      backgroundColor: '#e91e63'
                    }
                  }}
                >
                  Text Support
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Care Navigation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
            borderRadius: 2,
            boxShadow: 3
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold',
                color: '#2e7d32'
              }}>
                Care Navigation
              </Typography>
              <IconButton
                onClick={handleReminderClick}
                sx={{ 
                  color: '#2e7d32',
                  position: 'relative'
                }}
              >
                <NotificationsActiveIcon />
                {reminders.filter(r => !r.completed).length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: '#f44336',
                      color: 'white',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    {reminders.filter(r => !r.completed).length}
                  </Box>
                )}
              </IconButton>
            </Box>
            <Button
              variant="contained"
              startIcon={<MapIcon />}
              onClick={handleMapClick}
              sx={{
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#388e3c'
                }
              }}
            >
              Find Nearest Healthcare Facility
            </Button>
          </Paper>

          {/* Reminders Dropdown */}
          {showReminders && (
            <Paper sx={{ 
              p: 2,
              mt: 2,
              background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
              borderRadius: 2,
              boxShadow: 3
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#e65100' }}>
                Follow-up Reminders
              </Typography>
              <List>
                {reminders.map((reminder) => (
                  <ListItem
                    key={reminder.id}
                    sx={{
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        borderRadius: 1
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            textDecoration: reminder.completed ? 'line-through' : 'none',
                            color: reminder.completed ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {reminder.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {reminder.date} at {reminder.time}
                        </Typography>
                      }
                    />
                    <Checkbox
                      checked={reminder.completed}
                      onChange={() => handleReminderComplete(reminder.id)}
                      sx={{ color: '#e65100' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>

      {showMap && (
        <Dialog
          open={showMap}
          onClose={() => setShowMap(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Find Nearest Healthcare Facility</DialogTitle>
          <DialogContent>
            {/* Google Maps code removed as per instructions */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowMap(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default PatientDashboard; 