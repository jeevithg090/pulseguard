import React, { Suspense, lazy, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DirectionsIcon from '@mui/icons-material/Directions';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import {
  ALL_SERVICES,
  DEFAULT_MAP_CENTER,
  FACILITIES,
  FACILITY_TYPES,
  FACILITY_TYPE_LABELS,
} from '../../data/facilities';
import { FACILITY_SORT_OPTIONS, searchFacilities, withDistances } from '../../utils/facilities';
import { directionsUrl, formatDistance } from '../../utils/geo';

const FacilityMap = lazy(() => import('../../components/map/FacilityMap'));

const GEO_ERRORS = {
  1: 'Location permission was denied. Distances are shown from the city centre instead.',
  2: 'Your location is unavailable right now. Distances are shown from the city centre.',
  3: 'Finding your location timed out. Distances are shown from the city centre.',
};

function MapFallback({ height }) {
  return (
    <Box
      sx={{
        height,
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'action.hover',
        borderRadius: 3,
      }}
    >
      <Stack spacing={1} sx={{ alignItems: 'center' }} role="status">
        <CircularProgress size={28} />
        <Typography variant="body2" color="text.secondary">
          Loading map…
        </Typography>
      </Stack>
    </Box>
  );
}

export default function FacilitySearch() {
  usePageTitle('Find care');
  const [params] = useSearchParams();
  const { favorites, setFavorites } = useAppData();

  const initialType = FACILITY_TYPES.some((t) => t.value === params.get('type'))
    ? params.get('type')
    : 'all';
  const [query, setQuery] = useState('');
  const [type, setType] = useState(initialType);
  const [service, setService] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [minRating, setMinRating] = useState(0);
  const [open24h, setOpen24h] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [geoState, setGeoState] = useState({ status: 'idle', message: '' });
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const origin = userLocation ?? DEFAULT_MAP_CENTER;
  const results = useMemo(
    () =>
      searchFacilities(withDistances(FACILITIES, origin), {
        query,
        type,
        service,
        minRating,
        open24h,
        favoritesOnly,
        favorites,
        sortBy,
      }),
    [origin, query, type, service, minRating, open24h, favoritesOnly, favorites, sortBy],
  );

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeoState({ status: 'error', message: 'Your browser does not support location services.' });
      return;
    }
    setGeoState({ status: 'loading', message: '' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setGeoState({ status: 'success', message: '' });
        setSortBy('distance');
      },
      (err) => setGeoState({ status: 'error', message: GEO_ERRORS[err.code] ?? GEO_ERRORS[2] }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const openDetails = (facility) => {
    setSelected(facility);
    setDetailsOpen(true);
  };

  const clearFilters = () => {
    setQuery('');
    setType('all');
    setService('all');
    setMinRating(0);
    setOpen24h(false);
    setFavoritesOnly(false);
  };

  const mapHeight = { xs: 300, md: 420 };

  return (
    <>
      <PageHeader
        eyebrow="Patient portal"
        title="Find healthcare near you"
        description="Compare hospitals, clinics and urgent care centres by distance, rating and current wait time."
        actions={
          <Button
            variant="outlined"
            startIcon={
              geoState.status === 'loading' ? <CircularProgress size={18} /> : <MyLocationIcon />
            }
            onClick={locate}
            disabled={geoState.status === 'loading'}
          >
            {userLocation ? 'Update my location' : 'Use my location'}
          </Button>
        }
      />

      {geoState.status === 'error' && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          onClose={() => setGeoState({ status: 'idle', message: '' })}
        >
          {geoState.message}
        </Alert>
      )}

      <Paper variant="outlined" role="search" sx={{ p: { xs: 2, sm: 2.5 }, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Name, area or service (e.g. cardiology)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {FACILITY_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel id="service-label">Service</InputLabel>
              <Select
                labelId="service-label"
                label="Service"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <MenuItem value="all">Any service</MenuItem>
                {ALL_SERVICES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="sort-label">Sort by</InputLabel>
              <Select
                labelId="sort-label"
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {FACILITY_SORT_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Stack direction="row" sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <FormControlLabel
            control={<Switch checked={open24h} onChange={(e) => setOpen24h(e.target.checked)} />}
            label="Open 24/7"
          />
          <FormControlLabel
            control={
              <Switch
                checked={minRating >= 4.5}
                onChange={(e) => setMinRating(e.target.checked ? 4.5 : 0)}
              />
            }
            label="Rated 4.5+"
          />
          <FormControlLabel
            control={
              <Switch
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
              />
            }
            label={`Saved only (${favorites.length})`}
          />
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 0, md: 1 } }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 136 } }}>
            <Box
              sx={{
                height: mapHeight,
                borderRadius: 3,
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Suspense fallback={<MapFallback height="100%" />}>
                <Box sx={{ height: mapHeight }}>
                  <FacilityMap
                    facilities={results}
                    center={origin}
                    userLocation={userLocation}
                    selected={selected}
                    onSelect={openDetails}
                    height="100%"
                  />
                </Box>
              </Suspense>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {userLocation
                ? 'Distances from your location.'
                : 'Distances from Bengaluru city centre.'}{' '}
              Facility data is fictional demo data.
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1.5 }}
            role="status"
            aria-live="polite"
          >
            {results.length} {results.length === 1 ? 'facility' : 'facilities'} found
          </Typography>
          {results.length === 0 ? (
            <EmptyState
              icon={<SearchOffIcon />}
              title="No facilities match your filters"
              description="Try a different search term or clear some filters."
              action={
                <Button variant="outlined" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {results.map((f) => (
                <li key={f.id}>
                  <FacilityCard
                    facility={f}
                    origin={userLocation}
                    isFavorite={favorites.includes(f.id)}
                    onToggleFavorite={() => toggleFavorite(f.id)}
                    onDetails={() => openDetails(f)}
                  />
                </li>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>

      <FacilityDetailsDialog
        facility={selected}
        open={detailsOpen}
        origin={userLocation}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
}

function FacilityCard({ facility: f, origin, isFavorite, onToggleFavorite, onDetails }) {
  return (
    <Card sx={{ '&:hover': { boxShadow: 3 } }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h2" sx={{ lineHeight: 1.3 }}>
              {f.name}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap', mt: 0.5, gap: 0.5 }}
            >
              <Chip size="small" label={FACILITY_TYPE_LABELS[f.type]} />
              {f.open24h && (
                <Chip size="small" color="success" variant="outlined" label="Open 24/7" />
              )}
              <Rating
                value={f.rating}
                precision={0.1}
                readOnly
                size="small"
                aria-label={`Rated ${f.rating} out of 5`}
              />
              <Typography variant="body2" color="text.secondary">
                {f.rating.toFixed(1)} ({f.reviews})
              </Typography>
            </Stack>
          </Box>
          <Tooltip title={isFavorite ? 'Remove from saved' : 'Save facility'}>
            <IconButton
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? `Remove ${f.name} from saved` : `Save ${f.name}`}
            >
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 0.5, sm: 2 }}
          sx={{ mt: 1.5 }}
        >
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <PlaceOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {f.address} · <strong>{formatDistance(f.distanceKm)}</strong>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2">~{f.waitMinutes} min wait</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
          {f.services.slice(0, 4).map((s) => (
            <Chip key={s} label={s} size="small" variant="outlined" color="primary" />
          ))}
          {f.services.length > 4 && (
            <Chip size="small" variant="outlined" label={`+${f.services.length - 4}`} />
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button variant="contained" onClick={onDetails}>
          Details
        </Button>
        <Button
          startIcon={<DirectionsIcon />}
          href={directionsUrl(f.position, origin)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Directions
        </Button>
        <Button
          startIcon={<CallOutlinedIcon />}
          href={`tel:${f.phone.replace(/\s/g, '')}`}
          sx={{ ml: { sm: 'auto !important' } }}
        >
          Call
        </Button>
      </CardActions>
    </Card>
  );
}

function FacilityDetailsDialog({ facility: f, open, origin, onClose }) {
  if (!f) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="facility-dialog-title"
    >
      <DialogTitle id="facility-dialog-title">{f.name}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography color="text.secondary">
            {FACILITY_TYPE_LABELS[f.type]} · {f.address} · {formatDistance(f.distanceKm)}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Current wait
              </Typography>
              <Typography variant="h6">~{f.waitMinutes} min</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="h6">{f.phone}</Typography>
            </Grid>
          </Grid>
          <DetailChips title="Services" items={f.services} color="primary" />
          <DetailChips title="Facilities" items={f.features} />
          <DetailChips title="Insurance accepted" items={f.insurance} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={onClose}>Close</Button>
        <Button
          href={directionsUrl(f.position, origin)}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<DirectionsIcon />}
        >
          Directions
        </Button>
        <Button
          component={RouterLink}
          to={`/patient/book-appointment?facility=${f.id}`}
          variant="contained"
        >
          Book appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DetailChips({ title, items, color }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
        {title}
      </Typography>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75 }}>
        {items.map((i) => (
          <Chip key={i} label={i} size="small" variant="outlined" color={color} />
        ))}
      </Stack>
    </Box>
  );
}
