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
    services: ['Emergency', 'General Medicine', 'Pediatrics'],
    insurance: ['Medicare', 'Blue Cross', 'Aetna'],
    verified: true,
    image: 'https://example.com/hospital1.jpg',
    availability: {
      today: true,
      nextAvailable: 'Today',
    },
    specialFeatures: ['24/7 Emergency', 'Parking Available', 'Wheelchair Accessible'],
  },
  // Add more mock facilities...
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
    // Implement sort logic here
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
            size="small"
            value={sortBy}
            onChange={handleSortChange}
            startAdornment={<SortIcon sx={{ mr: 1 }} />}
          >
            <MenuItem value="distance">Distance</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="waitTime">Wait Time</MenuItem>
            <MenuItem value="availability">Availability</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Facility Cards */}
      <Grid container spacing={3}>
        {facilities.map((facility) => (
          <Grid item xs={12} key={facility.id}>
            <Card sx={{ 
              borderRadius: 2,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s',
              }
            }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {facility.name}
                      </Typography>
                      {facility.verified && (
                        <Tooltip title="Verified Facility">
                          <VerifiedIcon color="primary" />
                        </Tooltip>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => toggleFavorite(facility.id)}
                        sx={{ ml: 'auto' }}
                      >
                        {favorites.includes(facility.id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Box>

                    <Typography color="text.secondary" gutterBottom>
                      {facility.type}
                    </Typography>

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

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {facility.address} • {facility.distance} miles away
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color={facility.waitTime < 30 ? 'success.main' : 'warning.main'}>
                        Current wait time: {facility.waitTime} mins
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      {facility.services.map((service) => (
                        <Chip
                          key={service}
                          label={service}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          icon={<EventAvailableIcon />}
                          label={facility.availability.today ? "Available Today" : `Next Available: ${facility.availability.nextAvailable}`}
                          color={facility.availability.today ? "success" : "default"}
                          sx={{ width: '100%', mb: 1 }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => openFacilityDetails(facility)}
                          sx={{ mb: 1 }}
                        >
                          View Details & Book
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<DirectionsIcon />}
                        >
                          Get Directions
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
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