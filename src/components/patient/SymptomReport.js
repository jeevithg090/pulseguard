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
  Tabs,
  Tab,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Card,
  CardContent,
  CardMedia,
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
  Medication as MedicationIcon,
  PhotoCamera as PhotoCameraIcon,
  Mic as MicIcon,
  Cloud as CloudIcon,
  Psychology as PsychologyIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

// Update the common symptoms with more detailed thresholds and categories
const commonSymptoms = [
  { 
    id: 'fever', 
    label: 'Fever', 
    threshold: 38, 
    unit: '°C', 
    urgent: 39,
    category: 'vital',
    description: 'Elevated body temperature',
    commonTriggers: ['Infection', 'Inflammation', 'Exercise', 'Environment']
  },
  { 
    id: 'cough', 
    label: 'Cough', 
    threshold: 3, 
    unit: 'days', 
    urgent: 7,
    category: 'respiratory',
    description: 'Persistent cough or throat irritation',
    commonTriggers: ['Cold Air', 'Allergies', 'Infection', 'Post-nasal Drip']
  },
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

// Expand symptom patterns with more specific timeframes
const symptomPatterns = [
  { id: 'early_morning', label: 'Early Morning (4AM-8AM)', description: 'Symptoms occurring right after waking up' },
  { id: 'morning', label: 'Morning (8AM-12PM)', description: 'Symptoms during morning activities' },
  { id: 'afternoon', label: 'Afternoon (12PM-4PM)', description: 'Symptoms during midday' },
  { id: 'evening', label: 'Evening (4PM-8PM)', description: 'Symptoms in the evening' },
  { id: 'night', label: 'Night (8PM-12AM)', description: 'Symptoms before bedtime' },
  { id: 'late_night', label: 'Late Night (12AM-4AM)', description: 'Symptoms during sleep hours' },
  { id: 'after_eating', label: 'After Eating', description: 'Symptoms that appear post-meals' },
  { id: 'during_exercise', label: 'During Exercise', description: 'Symptoms during physical activity' },
  { id: 'after_exercise', label: 'After Exercise', description: 'Symptoms following physical activity' },
  { id: 'during_rest', label: 'During Rest', description: 'Symptoms while resting' },
  { id: 'during_stress', label: 'During Stress', description: 'Symptoms during stressful situations' },
  { id: 'after_stress', label: 'After Stress', description: 'Symptoms following stressful events' }
];

// Enhance environmental factors with categories and descriptions
const environmentalFactors = [
  {
    category: 'Weather',
    factors: [
      { id: 'hot_weather', label: 'Hot Weather', description: 'Temperature above 30°C/86°F' },
      { id: 'cold_weather', label: 'Cold Weather', description: 'Temperature below 10°C/50°F' },
      { id: 'humid', label: 'Humid', description: 'High moisture in the air' },
      { id: 'dry', label: 'Dry', description: 'Low moisture in the air' }
    ]
  },
  {
    category: 'Air Quality',
    factors: [
      { id: 'polluted_air', label: 'Polluted Air', description: 'Poor air quality or smog' },
      { id: 'dust', label: 'Dust', description: 'Presence of dust particles' },
      { id: 'pollen', label: 'Pollen', description: 'High pollen count' },
      { id: 'smoke', label: 'Smoke', description: 'Presence of smoke or fire' }
    ]
  },
  {
    category: 'Environment',
    factors: [
      { id: 'indoor', label: 'Indoor Environment', description: 'Symptoms while indoors' },
      { id: 'outdoor', label: 'Outdoor Environment', description: 'Symptoms while outdoors' },
      { id: 'workplace', label: 'Workplace', description: 'Symptoms at work' },
      { id: 'home', label: 'Home', description: 'Symptoms at home' }
    ]
  }
];

// Enhance body map regions with more detailed sub-regions
const bodyMapRegions = [
  {
    id: 'head',
    label: 'Head',
    subRegions: [
      { id: 'forehead', label: 'Forehead' },
      { id: 'temples', label: 'Temples' },
      { id: 'back_head', label: 'Back of Head' },
      { id: 'scalp', label: 'Scalp' }
    ]
  },
  {
    id: 'face',
    label: 'Face',
    subRegions: [
      { id: 'eyes', label: 'Eyes' },
      { id: 'nose', label: 'Nose' },
      { id: 'mouth', label: 'Mouth' },
      { id: 'jaw', label: 'Jaw' },
      { id: 'cheeks', label: 'Cheeks' }
    ]
  },
  {
    id: 'neck',
    label: 'Neck',
    subRegions: [
      { id: 'front_neck', label: 'Front Neck' },
      { id: 'back_neck', label: 'Back Neck' },
      { id: 'sides_neck', label: 'Sides of Neck' }
    ]
  },
  {
    id: 'chest',
    label: 'Chest',
    subRegions: [
      { id: 'upper_chest', label: 'Upper Chest' },
      { id: 'lower_chest', label: 'Lower Chest' },
      { id: 'left_chest', label: 'Left Chest' },
      { id: 'right_chest', label: 'Right Chest' }
    ]
  },
  // ... similar detailed subregions for other body parts ...
];

// Add severity descriptions for better understanding
const severityLevels = [
  { value: 1, label: 'Very Mild', description: 'Barely noticeable' },
  { value: 2, label: 'Mild', description: 'Noticeable but not disturbing' },
  { value: 3, label: 'Mild-Moderate', description: 'Somewhat disturbing' },
  { value: 4, label: 'Moderate', description: 'Disturbing but manageable' },
  { value: 5, label: 'Moderate-Severe', description: 'Significantly disturbing' },
  { value: 6, label: 'Severe', description: 'Very disturbing' },
  { value: 7, label: 'Very Severe', description: 'Highly disturbing' },
  { value: 8, label: 'Intense', description: 'Extremely disturbing' },
  { value: 9, label: 'Very Intense', description: 'Almost unbearable' },
  { value: 10, label: 'Extreme', description: 'Unbearable' }
];

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
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPatterns, setSelectedPatterns] = useState({});
  const [selectedRegions, setSelectedRegions] = useState({});
  const [environmentalFactors, setEnvironmentalFactors] = useState([]);
  const [medications, setMedications] = useState([]);
  const [symptomPhotos, setSymptomPhotos] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

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

  // Add new handlers
  const handlePatternSelect = (symptom, pattern) => {
    setSelectedPatterns(prev => ({
      ...prev,
      [symptom]: {
        ...prev[symptom],
        [pattern]: !prev[symptom]?.[pattern]
      }
    }));
  };

  const handleRegionSelect = (symptom, region) => {
    setSelectedRegions(prev => ({
      ...prev,
      [symptom]: {
        ...prev[symptom],
        [region]: !prev[symptom]?.[region]
      }
    }));
  };

  const handleMedicationAdd = (symptom) => {
    setMedications(prev => [...prev, {
      id: Date.now(),
      symptom,
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString(),
    }]);
  };

  const handlePhotoUpload = (symptom, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSymptomPhotos(prev => [...prev, {
        id: Date.now(),
        symptom,
        url: reader.result,
        timestamp: new Date().toISOString(),
      }]);
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    // Implement voice recognition here
    setTimeout(() => {
      setIsRecording(false);
      // Mock voice recognition result
      setAdditionalNotes(prev => prev + '\nVoice note: Symptom description recorded at ' + new Date().toLocaleTimeString());
    }, 3000);
  };

  const analyzeSymptoms = () => {
    // Mock AI analysis
    setAiAnalysis({
      possibleConditions: ['Common Cold', 'Allergic Reaction', 'Stress-related Symptoms'],
      confidence: 0.85,
      recommendations: [
        'Get adequate rest',
        'Stay hydrated',
        'Monitor temperature',
        'Consider over-the-counter medication',
      ],
    });
  };

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
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)} 
              sx={{ mb: 3 }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Severity" icon={<ErrorIcon />} />
              <Tab label="Patterns" icon={<TimelineIcon />} />
              <Tab label="Location" icon={<LocationIcon />} />
              <Tab label="Environment" icon={<CloudIcon />} />
            </Tabs>
            
            {activeTab === 0 && (
              <Box>
                {selectedSymptoms.map((symptom) => (
                  <Paper key={symptom} sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {commonSymptoms.find(s => s.id === symptom)?.label || symptom}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {commonSymptoms.find(s => s.id === symptom)?.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ mb: 1 }}>Severity:</Typography>
                      <Slider
                        value={symptomDetails[symptom]?.severity || 1}
                        onChange={(e, value) => handleSeverityChange(symptom, value)}
                        min={1}
                        max={10}
                        marks={[
                          { value: 1, label: 'Very Mild' },
                          { value: 3, label: 'Mild' },
                          { value: 5, label: 'Moderate' },
                          { value: 7, label: 'Severe' },
                          { value: 9, label: 'Very Severe' },
                          { value: 10, label: 'Extreme' }
                        ]}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => severityLevels.find(l => l.value === value)?.label}
                        sx={{
                          '& .MuiSlider-thumb': {
                            width: 24,
                            height: 24,
                            backgroundColor: (symptomDetails[symptom]?.severity || 1) >= 8 ? '#d32f2f' : 
                                          (symptomDetails[symptom]?.severity || 1) >= 5 ? '#ed6c02' : '#2e7d32',
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(to right, #2e7d32, #ed6c02, #d32f2f)',
                          },
                          '& .MuiSlider-markLabel': {
                            fontSize: '0.875rem'
                          },
                          mt: 2,
                          mb: 4,
                          ml: 2,
                          width: 'calc(100% - 16px)'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {severityLevels.find(l => l.value === (symptomDetails[symptom]?.severity || 1))?.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                {selectedSymptoms.map((symptom) => (
                  <Paper key={symptom} sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {commonSymptoms.find(s => s.id === symptom)?.label || symptom}
                    </Typography>
                    <Grid container spacing={2}>
                      {symptomPatterns.map((pattern) => (
                        <Grid item xs={12} sm={6} md={4} key={pattern.id}>
                          <Card 
                            variant="outlined"
                            sx={{
                              cursor: 'pointer',
                              bgcolor: selectedPatterns[symptom]?.[pattern.id] ? 'primary.light' : 'background.paper',
                              '&:hover': {
                                bgcolor: selectedPatterns[symptom]?.[pattern.id] ? 'primary.light' : 'action.hover',
                              },
                            }}
                            onClick={() => handlePatternSelect(symptom, pattern.id)}
                          >
                            <CardContent>
                              <Typography variant="subtitle1">{pattern.label}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {pattern.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                ))}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                {selectedSymptoms.map((symptom) => (
                  <Paper key={symptom} sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {commonSymptoms.find(s => s.id === symptom)?.label || symptom}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {bodyMapRegions.map((region) => (
                        <Box key={region.id} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {region.label}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {region.subRegions.map((subRegion) => (
                              <Chip
                                key={subRegion.id}
                                label={subRegion.label}
                                onClick={() => handleRegionSelect(symptom, `${region.id}_${subRegion.id}`)}
                                color={selectedRegions[symptom]?.[`${region.id}_${subRegion.id}`] ? 'primary' : 'default'}
                                variant={selectedRegions[symptom]?.[`${region.id}_${subRegion.id}`] ? 'filled' : 'outlined'}
                                sx={{
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.2s',
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                {environmentalFactors.map((category) => (
                  <Paper key={category.category} sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {category.category}
                    </Typography>
                    <Grid container spacing={2}>
                      {category.factors.map((factor) => (
                        <Grid item xs={12} sm={6} md={4} key={factor.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={environmentalFactors.includes(factor.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEnvironmentalFactors([...environmentalFactors, factor.id]);
                                      } else {
                                        setEnvironmentalFactors(environmentalFactors.filter(f => f !== factor.id));
                                      }
                                    }}
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography variant="subtitle1">{factor.label}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {factor.description}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            {selectedSymptoms.map((symptom) => (
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
                        value={symptomDetails[symptom]?.duration || 1}
                        onChange={(e) => handleDurationChange(symptom, parseInt(e.target.value), symptomDetails[symptom]?.unit || 'hours')}
                        sx={{ width: '100px' }}
                      />
                      <FormControl sx={{ minWidth: 120 }}>
                        <Select
                          value={symptomDetails[symptom]?.unit || 'hours'}
                          onChange={(e) => handleDurationChange(symptom, symptomDetails[symptom]?.duration || 1, e.target.value)}
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
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="h6">Medications</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {medications.filter(m => m.symptom === symptom).map((medication) => (
                        <Card key={medication.id} sx={{ minWidth: 250, maxWidth: 300 }}>
                          <CardContent>
                            <TextField
                              fullWidth
                              label="Medication Name"
                              value={medication.name}
                              onChange={(e) => {
                                const updatedMeds = medications.map(m =>
                                  m.id === medication.id ? { ...m, name: e.target.value } : m
                                );
                                setMedications(updatedMeds);
                              }}
                              sx={{ mb: 2 }}
                              size="small"
                            />
                            <TextField
                              fullWidth
                              label="Dosage"
                              value={medication.dosage}
                              onChange={(e) => {
                                const updatedMeds = medications.map(m =>
                                  m.id === medication.id ? { ...m, dosage: e.target.value } : m
                                );
                                setMedications(updatedMeds);
                              }}
                              sx={{ mb: 2 }}
                              size="small"
                            />
                            <TextField
                              fullWidth
                              label="Frequency"
                              value={medication.frequency}
                              onChange={(e) => {
                                const updatedMeds = medications.map(m =>
                                  m.id === medication.id ? { ...m, frequency: e.target.value } : m
                                );
                                setMedications(updatedMeds);
                              }}
                              sx={{ mb: 2 }}
                              size="small"
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton
                                onClick={() => {
                                  setMedications(medications.filter(m => m.id !== medication.id));
                                }}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                      <Card 
                        sx={{ 
                          minWidth: 250, 
                          maxWidth: 300, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          cursor: 'pointer',
                          bgcolor: 'action.hover',
                          '&:hover': {
                            bgcolor: 'action.selected'
                          }
                        }}
                        onClick={() => handleMedicationAdd(symptom)}
                      >
                        <CardContent sx={{ textAlign: 'center' }}>
                          <IconButton color="primary" sx={{ mb: 1 }}>
                            <AddIcon />
                          </IconButton>
                          <Typography color="primary">ADD MEDICATION</Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Photos</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {symptomPhotos.filter(p => p.symptom === symptom).map((photo) => (
                        <Card key={photo.id} sx={{ maxWidth: 200 }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={photo.url}
                            alt="Symptom photo"
                          />
                          <CardContent>
                            <Typography variant="caption">
                              {new Date(photo.timestamp).toLocaleString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCameraIcon />}
                      >
                        Add Photo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(symptom, e.target.files[0])}
                        />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
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
                  {selectedPatterns[symptom] && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">Patterns:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(selectedPatterns[symptom])
                          .filter(([_, value]) => value)
                          .map(([pattern]) => (
                            <Chip key={pattern} label={pattern} size="small" />
                          ))}
                      </Box>
                    </Box>
                  )}
                  {selectedRegions[symptom] && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">Affected Areas:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(selectedRegions[symptom])
                          .filter(([_, value]) => value)
                          .map(([region]) => (
                            <Chip
                              key={region}
                              label={bodyMapRegions.find(r => r.id === region)?.label}
                              size="small"
                              icon={<LocationIcon />}
                            />
                          ))}
                      </Box>
                    </Box>
                  )}
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setShowHistory(!showHistory)} color="primary">
              <HistoryIcon />
            </IconButton>
            <IconButton onClick={handleVoiceInput} color="primary" disabled={isRecording}>
              <MicIcon />
            </IconButton>
            <IconButton onClick={analyzeSymptoms} color="primary">
              <PsychologyIcon />
            </IconButton>
          </Box>
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

      {/* AI Analysis Dialog */}
      <Dialog
        open={!!aiAnalysis}
        onClose={() => setAiAnalysis(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>AI Symptom Analysis</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Possible Conditions
          </Typography>
          <List>
            {aiAnalysis?.possibleConditions.map((condition, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <PsychologyIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={condition} />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Recommendations
          </Typography>
          <List>
            {aiAnalysis?.recommendations.map((recommendation, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={recommendation} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Confidence: {(aiAnalysis?.confidence * 100).toFixed(1)}%
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiAnalysis(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SymptomReport; 