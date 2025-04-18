import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Chip,
  Rating,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsIcon from '@mui/icons-material/Directions';

// Mock data for healthcare facilities
const mockFacilities = [
  {
    id: 1,
    name: 'City General Hospital',
    type: 'Hospital',
    address: '123 Medical Center Dr, City, State 12345',
    phone: '(555) 123-4567',
    distance: '2.5 miles',
    rating: 4.5,
    waitTime: '15 mins',
    specialties: ['Emergency', 'General Medicine', 'Pediatrics'],
    isOpen: true,
  },
  {
    id: 2,
    name: 'Community Health Clinic',
    type: 'Clinic',
    address: '456 Health Ave, City, State 12345',
    phone: '(555) 234-5678',
    distance: '1.8 miles',
    rating: 4.2,
    waitTime: '30 mins',
    specialties: ['Primary Care', 'Women\'s Health'],
    isOpen: true,
  },
  {
    id: 3,
    name: 'Urgent Care Center',
    type: 'Urgent Care',
    address: '789 Care St, City, State 12345',
    phone: '(555) 345-6789',
    distance: '3.2 miles',
    rating: 4.0,
    waitTime: '45 mins',
    specialties: ['Urgent Care', 'Minor Injuries'],
    isOpen: true,
  },
];

const CareNavigation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredFacilities = mockFacilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || facility.type.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  const handleGetDirections = (address) => {
    // Open default maps application
    window.open(`https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find Healthcare Facilities
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search facilities"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or address..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Facility Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="all">All Types</option>
                <option value="hospital">Hospitals</option>
                <option value="clinic">Clinics</option>
                <option value="urgent care">Urgent Care</option>
              </TextField>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {filteredFacilities.map((facility) => (
            <Grid item xs={12} md={6} lg={4} key={facility.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {facility.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {facility.type}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">{facility.address}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">{facility.phone}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Wait Time: {facility.waitTime}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Rating value={facility.rating} precision={0.5} readOnly />
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {facility.specialties.map((specialty) => (
                      <Chip
                        key={specialty}
                        label={specialty}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={<DirectionsIcon />}
                    onClick={() => handleGetDirections(facility.address)}
                  >
                    Get Directions
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ ml: 'auto' }}
                  >
                    Schedule Visit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default CareNavigation; 