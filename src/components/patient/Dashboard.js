import React from 'react';
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
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Navigation as NavigationIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Message as MessageIcon,
} from '@mui/icons-material';

const PatientDashboard = () => {
  const navigate = useNavigate();

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
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Health Metrics
            </Typography>
            <List>
              {healthMetrics.map((metric, index) => (
                <React.Fragment key={metric.label}>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={metric.label}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ mr: 2 }}>
                            {metric.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: metric.status === 'Normal' ? 'success.main' : 'error.main',
                            }}
                          >
                            {metric.status}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < healthMetrics.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            <List>
              {upcomingAppointments.map((appointment, index) => (
                <React.Fragment key={appointment.id}>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={appointment.doctor}
                      secondary={
                        <>
                          <Typography variant="body2">{appointment.department}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.date} at {appointment.time}
                          </Typography>
                        </>
                      }
                    />
                    <Button variant="outlined" size="small">
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
      </Grid>
    </Container>
  );
};

export default PatientDashboard; 