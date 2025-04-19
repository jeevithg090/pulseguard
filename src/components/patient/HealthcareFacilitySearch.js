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
import FacilityMap from '../FacilityMap';

// Add this utility function at the top of the file, after the imports
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d * 0.621371; // Convert to miles
};

// Update the mockFacilities array to use Bangalore coordinates
const mockFacilities = [
  {
    id: 1,
    name: "Manipal Hospital",
    type: "Hospital",
    position: [12.9716, 77.5946], // Bangalore coordinates
    address: "98, HAL Airport Road, Kodihalli",
    waitTime: 15,
    rating: 4.5,
    reviews: 528,
    distance: null,
    services: ["Emergency", "General Medicine", "Pediatrics", "Surgery", "Cardiology"],
    insurance: ["Medicare", "Blue Cross", "Aetna", "UnitedHealth", "Cigna"],
    verified: true,
    image: 'https://example.com/hospital1.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['24/7 Emergency', 'Parking Available', 'Wheelchair Accessible']
  },
  {
    id: 2,
    name: "Apollo Hospital",
    type: "Hospital",
    position: [12.9667, 77.5667],
    address: "154/11, Bannerghatta Road",
    waitTime: 20,
    rating: 4.7,
    reviews: 342,
    distance: null,
    services: ["Emergency", "General Medicine", "Pediatrics", "Surgery", "Cardiology"],
    insurance: ["Medicare", "Blue Cross", "Aetna", "UnitedHealth", "Cigna"],
    verified: true,
    image: 'https://example.com/hospital2.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['24/7 Emergency', 'Parking Available', 'Wheelchair Accessible']
  },
  {
    id: 3,
    name: "Fortis Hospital",
    type: "Hospital",
    position: [12.9617, 77.6447],
    address: "154/9, Bannerghatta Road",
    waitTime: 25,
    rating: 4.6,
    reviews: 215,
    distance: null,
    services: ["Emergency", "General Medicine", "Pediatrics", "Surgery", "Cardiology"],
    insurance: ["Medicare", "Blue Cross", "Aetna", "UnitedHealth", "Cigna"],
    verified: true,
    image: 'https://example.com/hospital3.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['24/7 Emergency', 'Parking Available', 'Wheelchair Accessible']
  },
  {
    id: 4,
    name: "Narayana Health City",
    type: "Hospital",
    position: [12.8917, 77.6028],
    address: "258/A, Bommasandra Industrial Area",
    waitTime: 30,
    rating: 4.8,
    reviews: 189,
    distance: null,
    services: ["Emergency", "General Medicine", "Pediatrics", "Surgery", "Cardiology"],
    insurance: ["Medicare", "Blue Cross", "Aetna", "UnitedHealth", "Cigna"],
    verified: true,
    image: 'https://example.com/hospital4.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['24/7 Emergency', 'Parking Available', 'Wheelchair Accessible']
  },
  {
    id: 5,
    name: "Columbia Asia Hospital",
    type: "Hospital",
    position: [12.9784, 77.6408],
    address: "26/4, Brigade Gateway, Malleshwaram",
    waitTime: 10,
    rating: 4.4,
    reviews: 892,
    distance: null,
    services: ["Emergency", "General Medicine", "Pediatrics", "Surgery", "Cardiology"],
    insurance: ["Medicare", "Blue Cross", "Aetna", "UnitedHealth", "Cigna"],
    verified: true,
    image: 'https://example.com/hospital5.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['24/7 Emergency', 'Parking Available', 'Wheelchair Accessible']
  }
];

const facilityTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'urgent', label: 'Urgent Care' }
];

const sortOptions = [
  { value: 'distance', label: 'Distance', icon: <NearMeIcon /> },
  { value: 'rating', label: 'Rating', icon: <StarIcon /> },
  { value: 'waitTime', label: 'Wait Time', icon: <TimerIcon /> },
  { value: 'availability', label: 'Availability', icon: <TodayIcon /> },
];

const HealthcareFacilitySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [localFacilities, setLocalFacilities] = useState(mockFacilities);
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

  // Add this function to handle location updates
  const handleLocationUpdate = (location) => {
    setUserLocation(location);
    
    // Update facilities with calculated distances
    const facilitiesWithDistances = mockFacilities.map(facility => ({
      ...facility,
      distance: calculateDistance(
        location[0], location[1],
        facility.position[0], facility.position[1]
      ).toFixed(1)
    }));

    // Sort facilities by distance
    const sortedFacilities = facilitiesWithDistances.sort((a, b) => a.distance - b.distance);
    setLocalFacilities(sortedFacilities);
  };

  // Update the useEffect for sorting to use localFacilities
  useEffect(() => {
    const sortedFacilities = [...localFacilities].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'waitTime':
          return a.waitTime - b.waitTime;
        case 'availability':
          if (a.availability.today && !b.availability.today) return -1;
          if (!a.availability.today && b.availability.today) return 1;
          return a.availability.nextAvailable.localeCompare(b.availability.nextAvailable);
        default:
          return 0;
      }
    });
    setLocalFacilities(sortedFacilities);
  }, [sortBy]);

  // Update the search handler to filter localFacilities
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const query = event.target.value.toLowerCase();
    
    const filteredFacilities = mockFacilities
      .map(facility => ({
        ...facility,
        distance: userLocation ? calculateDistance(
          userLocation[0], userLocation[1],
          facility.position[0], facility.position[1]
        ).toFixed(1) : null
      }))
      .filter(facility => 
        facility.name.toLowerCase().includes(query) ||
        facility.type.toLowerCase().includes(query) ||
        facility.services.some(service => service.toLowerCase().includes(query))
      )
      .sort((a, b) => a.distance - b.distance);
    
    setLocalFacilities(filteredFacilities);
  };

  // Update the facility type filter
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    const type = event.target.value;
    
    const filteredFacilities = mockFacilities
      .map(facility => ({
        ...facility,
        distance: userLocation ? calculateDistance(
          userLocation[0], userLocation[1],
          facility.position[0], facility.position[1]
        ).toFixed(1) : null
      }))
      .filter(facility => 
        type === 'all' || facility.type.toLowerCase() === type.toLowerCase()
      )
      .sort((a, b) => a.distance - b.distance);
    
    setLocalFacilities(filteredFacilities);
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
      <Typography variant="h4" gutterBottom>
        Find Healthcare Facilities
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search facilities"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Facility Type"
            value={selectedType}
            onChange={handleTypeChange}
          >
            {facilityTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FacilityMap 
            facilities={localFacilities}
            onLocationUpdate={handleLocationUpdate}
          />
        </Grid>
      </Grid>

      {/* Sort and Results Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1">
          {localFacilities.length} facilities found
          {userLocation && " near you"}
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
        {localFacilities.map((facility) => (
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