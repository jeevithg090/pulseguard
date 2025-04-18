import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const commonSymptoms = [
  'Fever',
  'Cough',
  'Shortness of breath',
  'Fatigue',
  'Muscle or body aches',
  'Headache',
  'Loss of taste or smell',
  'Sore throat',
  'Congestion',
  'Nausea',
  'Diarrhea',
];

const severityLevels = [
  'Mild',
  'Moderate',
  'Severe',
  'Emergency',
];

const SymptomForm = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAddSymptom = () => {
    if (currentSymptom && severity) {
      setSymptoms([
        ...symptoms,
        {
          name: currentSymptom,
          severity,
          duration,
          notes,
        },
      ]);
      setCurrentSymptom('');
      setSeverity('');
      setDuration('');
      setNotes('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Submitted symptoms:', symptoms);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleVoiceInput = () => {
    // Mock voice input functionality
    alert('Voice input feature coming soon!');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Report Your Symptoms
        </Typography>

        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your symptoms have been reported successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Symptom</InputLabel>
                <Select
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  label="Select Symptom"
                >
                  {commonSymptoms.map((symptom) => (
                    <MenuItem key={symptom} value={symptom}>
                      {symptom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  label="Severity"
                >
                  {severityLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2 days"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your symptoms in detail..."
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddSymptom}
                  disabled={!currentSymptom || !severity}
                >
                  Add Symptom
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<MicIcon />}
                  onClick={handleVoiceInput}
                >
                  Voice Input
                </Button>
              </Box>
            </Grid>

            {symptoms.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Added Symptoms
                </Typography>
                {symptoms.map((symptom, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 1 }}>
                    <Typography variant="subtitle1">
                      {symptom.name} - {symptom.severity}
                    </Typography>
                    {symptom.duration && (
                      <Typography variant="body2">
                        Duration: {symptom.duration}
                      </Typography>
                    )}
                    {symptom.notes && (
                      <Typography variant="body2">
                        Notes: {symptom.notes}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={symptoms.length === 0}
              >
                Submit Report
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SymptomForm; 