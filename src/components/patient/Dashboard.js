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
  Phone as PhoneIcon,
  Sms as SmsIcon,
} from '@mui/icons-material';
import HealthInsurance from './HealthInsurance';

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
                        p: 1.5,
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
        {/* Recent Messages */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Recent Messages</Typography>
              <Button 
                startIcon={<MessageIcon />} 
                variant="outlined"
                color="primary"
                onClick={() => navigate('/patient/messages')}
              >
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

        {/* Health Insurance Section */}
        <Grid item xs={12}>
          <HealthInsurance />
        </Grid>

        {/* Contact Support */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Contact Support
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  onClick={() => handleContactSupport('voice')}
                  fullWidth
                  color="primary"
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
                  color="primary"
                >
                  Text Support
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Care Navigation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Care Navigation</Typography>
              <IconButton
                onClick={handleReminderClick}
                color="primary"
                sx={{ position: 'relative' }}
              >
                <NotificationsIcon />
                {reminders.filter(r => !r.completed).length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'error.main',
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
              color="primary"
              fullWidth
            >
              Find Nearest Healthcare Facility
            </Button>
          </Paper>

          {/* Reminders Dropdown */}
          {showReminders && (
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
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
                      color="primary"
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