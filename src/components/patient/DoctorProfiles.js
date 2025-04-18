import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  LocalHospital as SpecialtyIcon,
  School as EducationIcon,
  WorkHistory as ExperienceIcon,
  EmojiEvents as AchievementsIcon,
  Language as LanguageIcon,
  Schedule as AvailabilityIcon,
} from '@mui/icons-material';

// Enhanced mock data for doctors
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Smith',
    image: 'https://i.pravatar.cc/300?img=1',
    specialties: ['Cardiology', 'Interventional Cardiology'],
    subspecialties: ['Heart Failure', 'Cardiac Rehabilitation'],
    experience: '15 years',
    rating: 4.8,
    totalReviews: 245,
    education: [
      'MD - Stanford University School of Medicine',
      'Cardiology Fellowship - Mayo Clinic',
      'Internal Medicine Residency - Johns Hopkins Hospital',
    ],
    achievements: [
      'Best Cardiologist Award 2023',
      'Published 25+ research papers',
      'Member of American College of Cardiology',
    ],
    languages: ['English', 'Spanish'],
    availability: {
      nextAvailable: '2024-04-20',
      consultationTime: '30 mins',
    },
    expertise: [
      'Complex Cardiac Cases',
      'Preventive Cardiology',
      'Cardiac Imaging',
      'Minimally Invasive Procedures',
    ],
    location: 'Main Hospital, Floor 3',
    consultationFee: 1500,
  },
  {
    id: 2,
    name: 'Dr. Michael Johnson',
    image: 'https://i.pravatar.cc/300?img=2',
    specialties: ['General Medicine', 'Internal Medicine'],
    subspecialties: ['Preventive Medicine', 'Chronic Disease Management'],
    experience: '12 years',
    rating: 4.6,
    totalReviews: 180,
    education: [
      'MD - Harvard Medical School',
      'Internal Medicine Residency - Massachusetts General Hospital',
    ],
    achievements: [
      'Excellence in Patient Care Award 2022',
      'Published 15+ research papers',
      'Member of American College of Physicians',
    ],
    languages: ['English', 'Mandarin'],
    availability: {
      nextAvailable: '2024-04-19',
      consultationTime: '45 mins',
    },
    expertise: [
      'Primary Care',
      'Diabetes Management',
      'Hypertension',
      'Preventive Health',
    ],
    location: 'Main Hospital, Floor 2',
    consultationFee: 1000,
  },
];

const DoctorProfiles = ({ onSelectDoctor }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleBookAppointment = (doctor) => {
    if (onSelectDoctor) {
      onSelectDoctor(doctor);
    }
    handleCloseDialog();
  };

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const allSpecialties = [...new Set(mockDoctors.flatMap(doctor => doctor.specialties))];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Find a Doctor
      </Typography>
      
      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search doctors by name or specialty"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Specialty</InputLabel>
              <Select
                value={selectedSpecialty}
                label="Specialty"
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <MenuItem value="all">All Specialties</MenuItem>
                {allSpecialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Doctor Cards */}
      <Grid container spacing={3}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={12} md={6} key={doctor.id}>
            <Card sx={{ display: 'flex', height: '100%' }}>
              <CardMedia
                component="img"
                sx={{ width: 140 }}
                image={doctor.image}
                alt={doctor.name}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {doctor.name}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  {doctor.specialties.map((specialty) => (
                    <Chip
                      key={specialty}
                      label={specialty}
                      size="small"
                      color="primary"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={doctor.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({doctor.totalReviews} reviews)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {doctor.experience} experience
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Next available: {new Date(doctor.availability.nextAvailable).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDoctorClick(doctor)}
                  sx={{ mt: 1, mr: 1 }}
                >
                  View Profile
                </Button>
                {onSelectDoctor && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onSelectDoctor(doctor)}
                    sx={{ mt: 1 }}
                  >
                    Select Doctor
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Doctor Profile Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedDoctor && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">{selectedDoctor.name}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      sx={{ height: 300 }}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={selectedDoctor.rating} precision={0.1} readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({selectedDoctor.totalReviews} reviews)
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary" gutterBottom>
                        ₹{selectedDoctor.consultationFee}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleBookAppointment(selectedDoctor)}
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SpecialtyIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Specialties</Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            {selectedDoctor.specialties.map((specialty) => (
                              <Chip
                                key={specialty}
                                label={specialty}
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Subspecialties: {selectedDoctor.subspecialties.join(', ')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ExperienceIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Experience & Expertise</Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {selectedDoctor.experience} of clinical experience
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {selectedDoctor.expertise.map((item) => (
                                <Chip
                                  key={item}
                                  label={item}
                                  variant="outlined"
                                  size="small"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EducationIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Education</Typography>
                          </Box>
                        }
                        secondary={
                          <List dense>
                            {selectedDoctor.education.map((edu, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={edu} />
                              </ListItem>
                            ))}
                          </List>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AchievementsIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Achievements</Typography>
                          </Box>
                        }
                        secondary={
                          <List dense>
                            {selectedDoctor.achievements.map((achievement, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={achievement} />
                              </ListItem>
                            ))}
                          </List>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LanguageIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Languages</Typography>
                          </Box>
                        }
                        secondary={selectedDoctor.languages.join(', ')}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default DoctorProfiles; 