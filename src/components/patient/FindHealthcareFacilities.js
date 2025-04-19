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

// Mock data for Bangalore healthcare facilities
const mockFacilities = [
  {
    id: 1,
    name: 'Manipal Hospital',
    type: 'Hospital',
    address: '98, HAL Airport Road, Kodihalli, Bangalore',
    phone: '080-2502-4444',
    distance: '2.5 km',
    rating: 4.5,
    waitTime: '15 mins',
    specialties: ['Emergency', 'General Medicine', 'Cardiology', 'Neurology'],
    isOpen: true,
  },
  {
    id: 2,
    name: 'Apollo Hospital',
    type: 'Hospital',
    address: '154/11, Bannerghatta Road, Bangalore',
    phone: '080-4612-4444',
    distance: '3.8 km',
    rating: 4.7,
    waitTime: '20 mins',
    specialties: ['Emergency', 'General Medicine', 'Orthopedics', 'Pediatrics'],
    isOpen: true,
  },
  {
    id: 3,
    name: 'Fortis Hospital',
    type: 'Hospital',
    address: '154/9, Bannerghatta Road, Bangalore',
    phone: '080-6621-4444',
    distance: '4.2 km',
    rating: 4.6,
    waitTime: '25 mins',
    specialties: ['Emergency', 'General Medicine', 'Oncology', 'Cardiology'],
    isOpen: true,
  },
  {
    id: 4,
    name: 'Narayana Health City',
    type: 'Hospital',
    address: '258/A, Bommasandra Industrial Area, Bangalore',
    phone: '080-7178-4444',
    distance: '5.5 km',
    rating: 4.8,
    waitTime: '30 mins',
    specialties: ['Emergency', 'Cardiac Care', 'General Medicine', 'Surgery'],
    isOpen: true,
  },
  {
    id: 5,
    name: 'Columbia Asia Hospital',
    type: 'Hospital',
    address: '26/4, Brigade Gateway, Malleshwaram, Bangalore',
    phone: '080-3989-4444',
    distance: '6.2 km',
    rating: 4.4,
    waitTime: '10 mins',
    specialties: ['Emergency', 'General Medicine', 'Pediatrics', 'Gynecology'],
    isOpen: true,
  },
];

const FindHealthcareFacilities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredFacilities = mockFacilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || facility.type.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  const handleGetDirections = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
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
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Facility Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                variant="outlined"
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
                    <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">{facility.address}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">{facility.phone}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
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
                    color="primary"
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

export default FindHealthcareFacilities; 