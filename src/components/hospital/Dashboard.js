import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  LocalHospital as LocalHospitalIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { StyledCard, cardContentStyles, metricCardStyles } from '../common/CardStyles';
import WarningIcon from '@mui/icons-material/Warning';

// Mock data for symptom analysis
const mockSymptomData = [
  {
    id: 1,
    patient: 'John Doe',
    age: 45,
    symptoms: ['Fever', 'Cough', 'Fatigue'],
    riskLevel: 'High',
    timestamp: '2024-03-18 14:30',
    status: 'Pending Review',
  },
  {
    id: 2,
    patient: 'Jane Smith',
    age: 32,
    symptoms: ['Headache', 'Nausea'],
    riskLevel: 'Medium',
    timestamp: '2024-03-18 14:25',
    status: 'Under Review',
  },
  {
    id: 3,
    patient: 'Mike Johnson',
    age: 28,
    symptoms: ['Shortness of breath', 'Chest pain'],
    riskLevel: 'Critical',
    timestamp: '2024-03-18 14:20',
    status: 'Urgent Care',
  },
];

// Mock data for hospital metrics
const mockMetrics = {
  bedOccupancy: 75,
  patientCount: 120,
  staffAvailable: 45,
  criticalCases: 8,
  trend: 'up',
};

const getRiskLevelColor = (risk) => {
  switch (risk.toLowerCase()) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    default:
      return 'success';
  }
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'urgent care':
      return 'error';
    case 'under review':
      return 'warning';
    case 'pending review':
      return 'info';
    default:
      return 'success';
  }
};

const HospitalDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent sx={metricCardStyles}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Bed Occupancy</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {mockMetrics.bedOccupancy}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={mockMetrics.bedOccupancy}
                color={mockMetrics.bedOccupancy > 80 ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent sx={metricCardStyles}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Patients</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {mockMetrics.patientCount}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {mockMetrics.trend === 'up' ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  From last hour
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent sx={metricCardStyles}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Staff Available</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {mockMetrics.staffAvailable}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Across all departments
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent sx={metricCardStyles}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Critical Cases</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {mockMetrics.criticalCases}
              </Typography>
              <Typography variant="body2" color="error">
                Requiring immediate attention
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Symptom Analysis Table */}
      <StyledCard sx={{ mb: 4 }}>
        <CardContent sx={cardContentStyles}>
          <Typography variant="h5" gutterBottom>
            Real-time Symptom Analysis
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Symptoms</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockSymptomData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.patient}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {row.symptoms.map((symptom) => (
                          <Chip
                            key={symptom}
                            label={symptom}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.riskLevel}
                        color={getRiskLevelColor(row.riskLevel)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.timestamp}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={getStatusColor(row.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default HospitalDashboard; 