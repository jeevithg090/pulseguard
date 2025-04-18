import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BedIcon from '@mui/icons-material/Bed';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Mock data for bed allocation
const mockBeds = [
  { id: 1, number: '101', type: 'ICU', status: 'Occupied', patient: 'John Doe', condition: 'Critical' },
  { id: 2, number: '102', type: 'General', status: 'Available', patient: null, condition: null },
  { id: 3, number: '103', type: 'ICU', status: 'Occupied', patient: 'Jane Smith', condition: 'Stable' },
  { id: 4, number: '104', type: 'General', status: 'Maintenance', patient: null, condition: null },
];

// Mock data for staff schedules
const mockStaff = [
  { id: 1, name: 'Dr. Sarah Wilson', role: 'Cardiologist', shift: 'Morning', status: 'On Duty' },
  { id: 2, name: 'Dr. Michael Brown', role: 'General Physician', shift: 'Evening', status: 'On Duty' },
  { id: 3, name: 'Nurse Emily Davis', role: 'ICU Nurse', shift: 'Night', status: 'Off Duty' },
  { id: 4, name: 'Dr. James Miller', role: 'Surgeon', shift: 'Morning', status: 'On Break' },
];

// Mock data for resource utilization
const mockUtilization = {
  icu: { total: 20, occupied: 15, available: 5 },
  general: { total: 50, occupied: 35, available: 15 },
  staff: { total: 100, onDuty: 75, offDuty: 25 },
};

const ResourceAllocation = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleOpenDialog = (resource = null) => {
    setSelectedResource(resource);
    setEditMode(!!resource);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResource(null);
    setEditMode(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'occupied':
        return 'error';
      case 'available':
        return 'success';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStaffStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on duty':
        return 'success';
      case 'off duty':
        return 'error';
      case 'on break':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Resource Utilization Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">ICU Beds</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {mockUtilization.icu.occupied}/{mockUtilization.icu.total}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(mockUtilization.icu.occupied / mockUtilization.icu.total) * 100}
                color={mockUtilization.icu.available < 3 ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BedIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">General Beds</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {mockUtilization.general.occupied}/{mockUtilization.general.total}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(mockUtilization.general.occupied / mockUtilization.general.total) * 100}
                color={mockUtilization.general.available < 10 ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Staff Available</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {mockUtilization.staff.onDuty}/{mockUtilization.staff.total}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(mockUtilization.staff.onDuty / mockUtilization.staff.total) * 100}
                color={mockUtilization.staff.onDuty < 50 ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bed Allocation Table */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Bed Allocation</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Bed
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bed Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockBeds.map((bed) => (
                <TableRow key={bed.id}>
                  <TableCell>{bed.number}</TableCell>
                  <TableCell>{bed.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={bed.status}
                      color={getStatusColor(bed.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{bed.patient || '-'}</TableCell>
                  <TableCell>{bed.condition || '-'}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(bed)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Staff Schedule Table */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Staff Schedule</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Staff
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{staff.shift}</TableCell>
                  <TableCell>
                    <Chip
                      label={staff.status}
                      color={getStaffStatusColor(staff.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(staff)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Resource' : 'Add New Resource'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name/Number"
                defaultValue={selectedResource?.name || selectedResource?.number}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type/Role</InputLabel>
                <Select
                  label="Type/Role"
                  defaultValue={selectedResource?.type || selectedResource?.role || ''}
                >
                  <MenuItem value="ICU">ICU</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="Doctor">Doctor</MenuItem>
                  <MenuItem value="Nurse">Nurse</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedResource?.status || ''}
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Occupied">Occupied</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="On Duty">On Duty</MenuItem>
                  <MenuItem value="Off Duty">Off Duty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary">
            {editMode ? 'Save Changes' : 'Add Resource'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResourceAllocation; 