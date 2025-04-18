import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Chip,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as HospitalIcon,
  Save as SaveIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

// Common symptoms with severity thresholds
const commonSymptoms = [
  { id: 'fever', label: 'Fever', threshold: 38, unit: '°C', urgent: 39 },
  { id: 'cough', label: 'Cough', threshold: 3, unit: 'days', urgent: 7 },
  { id: 'headache', label: 'Headache', threshold: 5, unit: 'hours', urgent: 24 },
  { id: 'fatigue', label: 'Fatigue', threshold: 2, unit: 'days', urgent: 5 },
  { id: 'shortness_of_breath', label: 'Shortness of Breath', threshold: 1, unit: 'hours', urgent: 2 },
  { id: 'chest_pain', label: 'Chest Pain', threshold: 1, unit: 'hours', urgent: 1 },
  { id: 'nausea', label: 'Nausea', threshold: 1, unit: 'days', urgent: 2 },
  { id: 'vomiting', label: 'Vomiting', threshold: 1, unit: 'days', urgent: 2 },
  { id: 'diarrhea', label: 'Diarrhea', threshold: 1, unit: 'days', urgent: 2 },
  { id: 'rash', label: 'Rash', threshold: 1, unit: 'days', urgent: 2 },
];

// Duration options
const durationOptions = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
];

// Symptom suggestions based on combinations
const symptomSuggestions = {
  'fever,cough': ['Shortness of Breath', 'Fatigue'],
  'fever,headache': ['Nausea', 'Light Sensitivity'],
  'chest_pain,shortness_of_breath': ['Dizziness', 'Sweating'],
};

const SymptomReport = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomDetails, setSymptomDetails] = useState({});
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [suggestedSymptoms, setSuggestedSymptoms] = useState([]);
  const [flaggedIssues, setFlaggedIssues] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Track symptom severity and duration
  const [severity, setSeverity] = useState({});
  const [duration, setDuration] = useState({});

  // Handle symptom selection
  const handleSymptomSelect = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setSymptomDetails(prev => ({
        ...prev,
        [symptom]: { severity: 1, duration: 1, unit: 'hours' }
      }));
    }
  };

  // Handle symptom removal
  const handleSymptomRemove = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    setSymptomDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[symptom];
      return newDetails;
    });
  };

  // Update severity
  const handleSeverityChange = (symptom, value) => {
    setSymptomDetails(prev => ({
      ...prev,
      [symptom]: { ...prev[symptom], severity: value }
    }));
  };

  // Update duration
  const handleDurationChange = (symptom, value, unit) => {
    setSymptomDetails(prev => ({
      ...prev,
      [symptom]: { ...prev[symptom], duration: value, unit }
    }));
  };

  // Check for flagged issues
  useEffect(() => {
    const flags = selectedSymptoms.filter(symptom => {
      const details = symptomDetails[symptom];
      const symptomData = commonSymptoms.find(s => s.id === symptom);
      return details && symptomData && (
        (details.severity >= symptomData.threshold) ||
        (details.duration >= symptomData.urgent)
      );
    });
    setFlaggedIssues(flags);
  }, [selectedSymptoms, symptomDetails]);

  // Update suggested symptoms
  useEffect(() => {
    const currentSymptoms = selectedSymptoms.join(',');
    const suggestions = symptomSuggestions[currentSymptoms] || [];
    setSuggestedSymptoms(suggestions);
  }, [selectedSymptoms]);

  // Handle step change
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Update symptom history
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      const newHistory = selectedSymptoms.map(symptom => {
        const details = symptomDetails[symptom];
        const symptomData = commonSymptoms.find(s => s.id === symptom);
        return {
          id: Date.now(),
          symptom: symptomData?.label || symptom,
          severity: details?.severity || 1,
          duration: details?.duration || 1,
          unit: details?.unit || 'hours',
          timestamp: new Date().toISOString(),
        };
      });
      setSymptomHistory(prev => [...prev, ...newHistory]);
    }
  }, [selectedSymptoms, symptomDetails]);

  const steps = [
    'Select Symptoms',
    'Rate Severity',
    'Add Details',
    'Review & Submit'
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select Your Symptoms
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {commonSymptoms.map((symptom) => (
                <Chip
                  key={symptom.id}
                  label={symptom.label}
                  onClick={() => handleSymptomSelect(symptom.id)}
                  onDelete={selectedSymptoms.includes(symptom.id) ? () => handleSymptomRemove(symptom.id) : undefined}
                  color={selectedSymptoms.includes(symptom.id) ? 'primary' : 'default'}
                  variant={selectedSymptoms.includes(symptom.id) ? 'filled' : 'outlined'}
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            {selectedSymptoms.map((symptom) => {
              const details = symptomDetails[symptom] || { severity: 1, duration: 1, unit: 'hours' };
              return (
                <Paper key={symptom} sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {commonSymptoms.find(s => s.id === symptom)?.label || symptom}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography>Severity</Typography>
                    <Slider
                      value={details.severity}
                      onChange={(e, value) => handleSeverityChange(symptom, value)}
                      min={1}
                      max={10}
                      marks
                      valueLabelDisplay="auto"
                      sx={{
                        '& .MuiSlider-thumb': {
                          width: 24,
                          height: 24,
                          backgroundColor: details.severity >= 8 ? '#d32f2f' : 
                                        details.severity >= 5 ? '#ed6c02' : '#2e7d32',
                        },
                      }}
                    />
                  </Box>
                </Paper>
              );
            })}
          </Box>
        );
      case 2:
        return (
          <Box>
            {selectedSymptoms.map((symptom) => {
              const details = symptomDetails[symptom] || { severity: 1, duration: 1, unit: 'hours' };
              return (
                <Paper key={symptom} sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {commonSymptoms.find(s => s.id === symptom)?.label || symptom}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography gutterBottom>Duration</Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          type="number"
                          value={details.duration}
                          onChange={(e) => handleDurationChange(symptom, parseInt(e.target.value), details.unit)}
                          sx={{ width: '100px' }}
                        />
                        <FormControl sx={{ minWidth: 120 }}>
                          <Select
                            value={details.unit}
                            onChange={(e) => handleDurationChange(symptom, details.duration, e.target.value)}
                          >
                            {durationOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Symptoms
            </Typography>
            {selectedSymptoms.map((symptom) => {
              const details = symptomDetails[symptom] || { severity: 1, duration: 1, unit: 'hours' };
              const isFlagged = flaggedIssues.includes(symptom);
              return (
                <Paper key={symptom} sx={{ p: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                      {commonSymptoms.find(s => s.id === symptom)?.label || symptom}
                    </Typography>
                    <Badge
                      badgeContent={isFlagged ? '!' : null}
                      color={isFlagged ? 'error' : 'default'}
                    >
                      <Avatar
                        sx={{
                          bgcolor: details.severity >= 8 ? '#d32f2f' : 
                                  details.severity >= 5 ? '#ed6c02' : '#2e7d32',
                        }}
                      >
                        {details.severity}
                      </Avatar>
                    </Badge>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {details.duration} {details.unit}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setShowSummary(true);
  };

  // Save symptom report
  const handleSave = () => {
    // Implement save functionality
    console.log('Saving symptom report:', {
      selectedSymptoms,
      symptomDetails,
      additionalNotes
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            Report Your Symptoms
          </Typography>
          <IconButton onClick={() => setShowHistory(!showHistory)} color="primary">
            <HistoryIcon />
          </IconButton>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={selectedSymptoms.length === 0}
          >
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Paper>

      {/* Symptom History Dialog */}
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Symptom History</DialogTitle>
        <DialogContent>
          <Timeline>
            {symptomHistory.map((entry, index) => (
              <TimelineItem key={entry.id}>
                <TimelineOppositeContent color="text.secondary">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={entry.severity >= 8 ? 'error' : entry.severity >= 5 ? 'warning' : 'success'}>
                    {entry.severity}
                  </TimelineDot>
                  {index < symptomHistory.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="subtitle1">{entry.symptom}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {entry.duration} {entry.unit}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Summary Dialog */}
      <Dialog
        open={showSummary}
        onClose={() => setShowSummary(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Symptom Report Summary</DialogTitle>
        <DialogContent>
          {flaggedIssues.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6">Urgent Attention Required</Typography>
              <List>
                {flaggedIssues.map((symptom) => {
                  const details = symptomDetails[symptom] || { severity: 1, duration: 1, unit: 'hours' };
                  const symptomData = commonSymptoms.find(s => s.id === symptom);
                  return (
                    <ListItem key={symptom}>
                      <ListItemIcon>
                        <ErrorIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={symptomData?.label || symptom}
                        secondary={`Severity: ${details.severity}/10, Duration: ${details.duration} ${details.unit}`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            Recommended Next Steps
          </Typography>
          <List>
            {flaggedIssues.length > 0 ? (
              <>
                <ListItem>
                  <ListItemIcon>
                    <HospitalIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Seek Immediate Medical Attention"
                    secondary="Please contact your healthcare provider or visit the nearest emergency department"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Monitor Symptoms"
                    secondary="Keep track of your symptoms and note any changes"
                  />
                </ListItem>
              </>
            ) : (
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Schedule a Regular Check-up"
                  secondary="Your symptoms don't require immediate attention, but it's recommended to schedule a regular check-up"
                />
              </ListItem>
            )}
          </List>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Symptom Trends
            </Typography>
            <Grid container spacing={2}>
              {selectedSymptoms.map((symptom) => {
                const details = symptomDetails[symptom] || { severity: 1, duration: 1, unit: 'hours' };
                const history = symptomHistory.filter(h => h.symptom === symptom);
                const trend = history.length > 1 ? 
                  (history[history.length - 1].severity - history[0].severity) : 0;
                
                return (
                  <Grid item xs={12} sm={6} key={symptom}>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          {commonSymptoms.find(s => s.id === symptom)?.label || symptom}
                        </Typography>
                        {trend !== 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {trend > 0 ? <TrendingUpIcon color="error" /> : <TrendingDownIcon color="success" />}
                            <Typography variant="body2" color={trend > 0 ? 'error' : 'success'}>
                              {Math.abs(trend)} points
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <CircularProgress
                          variant="determinate"
                          value={details.severity * 10}
                          size={40}
                          thickness={4}
                          sx={{
                            color: details.severity >= 8 ? '#d32f2f' : 
                                  details.severity >= 5 ? '#ed6c02' : '#2e7d32',
                          }}
                        />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body2">
                            Current Severity: {details.severity}/10
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {details.duration} {details.unit}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSummary(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSave();
              setShowSummary(false);
            }}
          >
            Save & Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SymptomReport; 