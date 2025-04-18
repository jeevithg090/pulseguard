import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Slider,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import DirectionsIcon from '@mui/icons-material/Directions';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MapIcon from '@mui/icons-material/Map';
import SortIcon from '@mui/icons-material/Sort';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import InsuranceIcon from '@mui/icons-material/HealthAndSafety';
import NearMeIcon from '@mui/icons-material/NearMe';
import TimerIcon from '@mui/icons-material/Timer';
import TodayIcon from '@mui/icons-material/Today';
import { StyledCard, cardContentStyles, cardGridItemStyles, facilityCardStyles } from '../common/CardStyles';

// Mock data for healthcare facilities
const mockFacilities = [
  {
    id: 1,
    name: 'City General Hospital',
    type: 'Hospital',
    address: '123 Medical Center Dr, City, State 12345',
    phone: '(555) 123-4567',
    waitTime: 15,
    rating: 4.5,
    reviews: 528,
    distance: 0.8,
    services: ['Emergency', 'General Medicine', 'Pediatrics', 'Surgery', 'Cardiology'],
    insurance: ['Medicare', 'Blue Cross', 'Aetna', 'UnitedHealth', 'Cigna'],
    verified: true,
    image: 'https://example.com/hospital1.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['24/7 Emergency', 'Parking Available', 'Wheelchair Accessible', 'Helipad', 'ICU'],
  },
  {
    id: 2,
    name: 'Community Health Clinic',
    type: 'Clinic',
    address: '456 Health Ave, City, State 12345',
    phone: '(555) 234-5678',
    waitTime: 30,
    rating: 4.2,
    reviews: 342,
    distance: 1.2,
    services: ['Primary Care', 'Women\'s Health', 'Pediatrics', 'Vaccinations', 'Lab Tests'],
    insurance: ['Medicare', 'Medicaid', 'Blue Cross', 'Kaiser'],
    verified: true,
    image: 'https://example.com/clinic1.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['Same-day Appointments', 'Multilingual Staff', 'Online Portal'],
  },
  {
    id: 3,
    name: 'Rapid Care Urgent Center',
    type: 'Urgent Care',
    address: '789 Care St, City, State 12345',
    phone: '(555) 345-6789',
    waitTime: 45,
    rating: 4.0,
    reviews: 215,
    distance: 2.5,
    services: ['Urgent Care', 'Minor Injuries', 'X-Ray', 'Lab Services', 'COVID Testing'],
    insurance: ['Medicare', 'Blue Cross', 'Aetna', 'UnitedHealth'],
    verified: true,
    image: 'https://example.com/urgent1.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['Walk-ins Welcome', 'Virtual Check-in', 'On-site Pharmacy'],
  },
  {
    id: 4,
    name: 'Wellness Family Practice',
    type: 'Clinic',
    address: '321 Wellness Blvd, City, State 12345',
    phone: '(555) 456-7890',
    waitTime: 20,
    rating: 4.8,
    reviews: 189,
    distance: 1.8,
    services: ['Family Medicine', 'Preventive Care', 'Mental Health', 'Nutrition Counseling'],
    insurance: ['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealth'],
    verified: true,
    image: 'https://example.com/clinic2.jpg',
    availability: {
      today: false,
      nextAvailable: 'Tomorrow',
    },
    specialFeatures: ['Evening Hours', 'Telehealth', 'Family-friendly'],
  },
  {
    id: 5,
    name: 'Metropolitan Medical Center',
    type: 'Hospital',
    address: '555 Metro Ave, City, State 12345',
    phone: '(555) 567-8901',
    waitTime: 25,
    rating: 4.3,
    reviews: 892,
    distance: 3.2,
    services: ['Emergency', 'Surgery', 'Oncology', 'Neurology', 'Orthopedics', 'Maternity'],
    insurance: ['Medicare', 'Medicaid', 'Blue Cross', 'Aetna', 'UnitedHealth', 'Kaiser'],
    verified: true,
    image: 'https://example.com/hospital2.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['Level 1 Trauma Center', 'Research Facility', 'Teaching Hospital', 'Robotic Surgery'],
  },
  {
    id: 6,
    name: 'Pediatric Plus Care',
    type: 'Specialty Center',
    address: '234 Kids Way, City, State 12345',
    phone: '(555) 678-9012',
    waitTime: 15,
    rating: 4.9,
    reviews: 156,
    distance: 2.1,
    services: ['Pediatrics', 'Child Psychology', 'Pediatric Dentistry', 'Child Development'],
    insurance: ['Blue Cross', 'Aetna', 'UnitedHealth', 'Cigna'],
    verified: true,
    image: 'https://example.com/peds1.jpg',
    availability: {
      today: false,
      nextAvailable: '2 days',
    },
    specialFeatures: ['Child-friendly Environment', 'Play Area', 'Specialized Equipment'],
  },
  {
    id: 7,
    name: 'Express Diagnostic Center',
    type: 'Diagnostic Center',
    address: '876 Test Rd, City, State 12345',
    phone: '(555) 789-0123',
    waitTime: 10,
    rating: 4.4,
    reviews: 234,
    distance: 1.5,
    services: ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'Blood Work', 'EKG'],
    insurance: ['Medicare', 'Blue Cross', 'Aetna', 'UnitedHealth'],
    verified: true,
    image: 'https://example.com/diag1.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['Same-day Results', 'Online Results Portal', 'Extended Hours'],
  },
  {
    id: 8,
    name: 'HealthPlus Pharmacy',
    type: 'Pharmacy',
    address: '432 Medicine Lane, City, State 12345',
    phone: '(555) 890-1234',
    waitTime: 5,
    rating: 4.6,
    reviews: 423,
    distance: 0.5,
    services: ['Prescription Filling', 'Vaccinations', 'Health Screenings', 'Medical Supplies'],
    insurance: ['Medicare Part D', 'Blue Cross', 'Aetna', 'UnitedHealth', 'Cigna'],
    verified: true,
    image: 'https://example.com/pharm1.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['Drive-thru Service', '24/7 Operation', 'Medication Counseling', 'Home Delivery'],
  }
];

const facilityTypes = [
  'All Types',
  'Hospital',
  'Clinic',
  'Urgent Care',
  'Specialty Center',
  'Diagnostic Center',
  'Pharmacy',
];

const sortOptions = [
  { value: 'distance', label: 'Distance', icon: <NearMeIcon /> },
  { value: 'rating', label: 'Rating', icon: <StarIcon /> },
  { value: 'waitTime', label: 'Wait Time', icon: <TimerIcon /> },
  { value: 'availability', label: 'Availability', icon: <TodayIcon /> },
];

const HealthcareFacilitySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [facilities, setFacilities] = useState(mockFacilities);
  const [sortBy, setSortBy] = useState('distance');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    maxDistance: 10,
    minRating: 0,
    insuranceProviders: [],
    services: [],
    availability: 'all',
  });
  const [favorites, setFavorites] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilityDialogOpen, setFacilityDialogOpen] = useState(false);

  // Add sorting effect
  useEffect(() => {
    const sortedFacilities = [...facilities].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'waitTime':
          return a.waitTime - b.waitTime;
        case 'availability':
          // Sort by availability (today first, then by next available date)
          if (a.availability.today && !b.availability.today) return -1;
          if (!a.availability.today && b.availability.today) return 1;
          return a.availability.nextAvailable.localeCompare(b.availability.nextAvailable);
        default:
          return 0;
      }
    });
    setFacilities(sortedFacilities);
  }, [sortBy]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    // Implement search logic here
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    // Implement filter logic here
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleFavorite = (facilityId) => {
    setFavorites(prev => 
      prev.includes(facilityId)
        ? prev.filter(id => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  const openFacilityDetails = (facility) => {
    setSelectedFacility(facility);
    setFacilityDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Find Healthcare Facilities
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search facilities"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Facility Type</InputLabel>
              <Select
                value={selectedType}
                label="Facility Type"
                onChange={handleTypeChange}
              >
                {facilityTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDialogOpen(true)}
            >
              Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Sort and Results Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1">
          {facilities.length} facilities found
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            displayEmpty
            renderValue={(value) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SortIcon />
                {sortOptions.find(option => option.value === value)?.label || 'Sort by'}
              </Box>
            )}
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              },
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}
              >
                {option.icon}
                <Typography>{option.label}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Facility Cards */}
      <Grid container spacing={3}>
        {facilities.map((facility) => (
          <Grid item xs={12} key={facility.id} sx={cardGridItemStyles}>
            <StyledCard>
              <CardContent sx={cardContentStyles}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Facility Name and Verified Icon */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                          {facility.name}
                        </Typography>
                        {facility.verified && (
                          <Tooltip title="Verified Facility">
                            <VerifiedIcon color="primary" sx={{ mr: 'auto' }} />
                          </Tooltip>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => toggleFavorite(facility.id)}
                        >
                          {favorites.includes(facility.id) ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      </Box>

                      {/* Facility Type */}
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {facility.type}
                      </Typography>

                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating
                          value={facility.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                          ({facility.reviews} reviews)
                        </Typography>
                      </Box>

                      {/* Address */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary', flexShrink: 0 }} />
                        <Typography variant="body2">
                          {facility.address} • {facility.distance} miles away
                        </Typography>
                      </Box>

                      {/* Services */}
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Available Services
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {facility.services.map((service) => (
                            <Chip
                              key={service}
                              label={service}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Wait Time
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {facility.waitTime}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => openFacilityDetails(facility)}
                        >
                          VIEW DETAILS & BOOK
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ mt: 1 }}
                          startIcon={<DirectionsIcon />}
                        >
                          GET DIRECTIONS
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Filters Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Facilities</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Distance (miles)</Typography>
            <Slider
              value={filters.maxDistance}
              onChange={(e, value) => handleFilterChange('maxDistance', value)}
              valueLabelDisplay="auto"
              max={50}
              marks={[
                { value: 0, label: '0' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Rating
              value={filters.minRating}
              onChange={(e, value) => handleFilterChange('minRating', value)}
              precision={0.5}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Insurance Accepted</Typography>
            <Grid container spacing={1}>
              {['Medicare', 'Medicaid', 'Blue Cross', 'Aetna', 'UnitedHealth'].map((insurance) => (
                <Grid item key={insurance}>
                  <Chip
                    label={insurance}
                    onClick={() => {
                      const current = filters.insuranceProviders;
                      handleFilterChange(
                        'insuranceProviders',
                        current.includes(insurance)
                          ? current.filter(i => i !== insurance)
                          : [...current, insurance]
                      );
                    }}
                    color={filters.insuranceProviders.includes(insurance) ? 'primary' : 'default'}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Availability</Typography>
            <Select
              fullWidth
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              <MenuItem value="all">Any time</MenuItem>
              <MenuItem value="today">Available today</MenuItem>
              <MenuItem value="tomorrow">Available tomorrow</MenuItem>
              <MenuItem value="week">Available this week</MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setFilterDialogOpen(false)}>
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Facility Details Dialog */}
      <Dialog
        open={facilityDialogOpen}
        onClose={() => setFacilityDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedFacility && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalHospitalIcon sx={{ mr: 2 }} />
                <Typography variant="h6">{selectedFacility.name}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Facility Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={selectedFacility.address}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Contact"
                        secondary={selectedFacility.phone}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Current Wait Time"
                        secondary={`${selectedFacility.waitTime} minutes`}
                      />
                    </ListItem>
                  </List>

                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Special Features</Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedFacility.specialFeatures.map((feature) => (
                      <Chip
                        key={feature}
                        label={feature}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>

                  <Typography variant="h6" gutterBottom>Insurance Accepted</Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedFacility.insurance.map((insurance) => (
                      <Chip
                        key={insurance}
                        icon={<InsuranceIcon />}
                        label={insurance}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => {
                        setFacilityDialogOpen(false);
                        // Navigate to appointment booking
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<MapIcon />}
                      onClick={() => window.open(`https://www.openstreetmap.org/search?query=${encodeURIComponent(selectedFacility.address)}`, '_blank')}
                    >
                      View on Map
                    </Button>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>Available Services</Typography>
                  <List>
                    {selectedFacility.services.map((service) => (
                      <ListItem key={service}>
                        <ListItemIcon>
                          <LocalHospitalIcon />
                        </ListItemIcon>
                        <ListItemText primary={service} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFacilityDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default HealthcareFacilitySearch; 