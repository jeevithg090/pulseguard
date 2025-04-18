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
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as HospitalIcon,
  Save as SaveIcon,
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
        <Typography variant="h4" gutterBottom>
          Report Your Symptoms
        </Typography>

        {/* Common Symptoms Selection */}
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
              />
            ))}
          </Box>
        </Box>

        {/* Selected Symptoms Details */}
        {selectedSymptoms.map((symptom) => {
          const details = symptomDetails[symptom] || { severity: 1, duration: 1, unit: 'hours' };
          const symptomData = commonSymptoms.find(s => s.id === symptom);
          const isFlagged = flaggedIssues.includes(symptom);

          return (
            <Paper key={symptom} sx={{ p: 3, mb: 2, position: 'relative' }}>
              {isFlagged && (
                <Alert
                  severity={details.severity >= symptomData.urgent ? 'error' : 'warning'}
                  sx={{ mb: 2 }}
                >
                  {details.severity >= symptomData.urgent
                    ? 'This symptom requires immediate attention'
                    : 'Please monitor this symptom closely'}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {symptomData?.label || symptom}
                </Typography>
                <IconButton onClick={() => handleSymptomRemove(symptom)}>
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Severity (1-10)</Typography>
                  <Slider
                    value={details.severity}
                    onChange={(e, value) => handleSeverityChange(symptom, value)}
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
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

        {/* Suggested Symptoms */}
        {suggestedSymptoms.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Suggested Additional Symptoms
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestedSymptoms.map((symptom) => (
                <Chip
                  key={symptom}
                  label={symptom}
                  onClick={() => handleSymptomSelect(symptom.toLowerCase().replace(/\s+/g, '_'))}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Additional Notes */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Additional Notes
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Add any additional details about your symptoms..."
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save for Later
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={selectedSymptoms.length === 0}
          >
            Submit & Review
          </Button>
        </Box>
      </Paper>

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