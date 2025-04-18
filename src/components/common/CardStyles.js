import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

// Styled card component with consistent sizing and hover effects
export const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// Common card content styles
export const cardContentStyles = {
  flex: 1,
  padding: 3,
  display: 'flex',
  flexDirection: 'column',
};

// Common grid item styles for cards
export const cardGridItemStyles = {
  display: 'flex',
  minHeight: 200, // Minimum height for consistency
};

// Common styles for metric cards
export const metricCardStyles = {
  padding: 3,
  height: '100%',
  minHeight: 140,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

// Common styles for facility cards
export const facilityCardStyles = {
  height: '100%',
  minHeight: 220,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 2,
  '&:hover': {
    boxShadow: 6,
    transform: 'translateY(-2px)',
    transition: 'all 0.2s',
  },
}; 