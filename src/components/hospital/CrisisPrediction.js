import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Mock data for crisis predictions
const mockCrisisData = {
  currentAlerts: [
    {
      id: 1,
      type: 'Weather',
      severity: 'High',
      description: 'Extreme heat warning in effect',
      impact: 'Increased risk of heat-related illnesses',
      timestamp: '2024-03-18 10:00',
      action: 'Prepare for increased patient load',
    },
    {
      id: 2,
      type: 'Disease',
      severity: 'Medium',
      description: 'Rise in flu cases reported',
      impact: 'Potential surge in respiratory cases',
      timestamp: '2024-03-18 09:30',
      action: 'Monitor ICU capacity',
    },
  ],
  predictions: [
    {
      id: 1,
      metric: 'Patient Surge',
      probability: 75,
      timeframe: 'Next 24 hours',
      factors: ['Weather conditions', 'Local events', 'Historical data'],
    },
    {
      id: 2,
      metric: 'Resource Strain',
      probability: 60,
      timeframe: 'Next 48 hours',
      factors: ['Staff availability', 'Bed capacity', 'Equipment status'],
    },
  ],
  environmentalData: {
    temperature: 32,
    humidity: 65,
    airQuality: 'Moderate',
    pollenCount: 'High',
  },
};

const CrisisPrediction = () => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getAirQualityColor = (quality) => {
    switch (quality.toLowerCase()) {
      case 'good':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Current Alerts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Active Crisis Alerts
            </Typography>
            {mockCrisisData.currentAlerts.map((alert) => (
              <Alert
                key={alert.id}
                severity={getSeverityColor(alert.severity)}
                sx={{ mb: 2 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {alert.type} Alert - {alert.severity} Severity
                    </Typography>
                    <Typography variant="body2">{alert.description}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Impact: {alert.impact}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {alert.timestamp}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                  >
                    Take Action
                  </Button>
                </Box>
              </Alert>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Crisis Predictions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Crisis Predictions
            </Typography>
            {mockCrisisData.predictions.map((prediction) => (
              <Card key={prediction.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {prediction.metric}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                      Probability:
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={prediction.probability}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Typography variant="body2">
                      {prediction.probability}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Timeframe: {prediction.timeframe}
                  </Typography>
                  <List dense>
                    {prediction.factors.map((factor, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendingUpIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={factor} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  <Button size="small" color="primary">
                    Prepare Response
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Environmental Data */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Environmental Conditions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ThermostatIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        {mockCrisisData.environmentalData.temperature}°C
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Temperature
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WaterDropIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        {mockCrisisData.environmentalData.humidity}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Humidity
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AirIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        {mockCrisisData.environmentalData.airQuality}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Air Quality
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        {mockCrisisData.environmentalData.pollenCount}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Pollen Count
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Response Recommendations */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Recommended Actions
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <WarningIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Increase ICU Staff"
              secondary="Based on predicted patient surge and current capacity"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WarningIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Prepare Emergency Response Team"
              secondary="Due to extreme weather conditions and increased health risks"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WarningIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Stock Additional Medical Supplies"
              secondary="Anticipated increase in respiratory cases"
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default CrisisPrediction; 