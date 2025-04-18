import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardActionArea,
} from '@mui/material';
import {
  CardMembership as InsuranceIcon,
  ContactPhone as ContactIcon,
  Description as PolicyIcon,
  Payment as PaymentIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const HealthInsurance = () => {
  const [editMode, setEditMode] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [insuranceDetails, setInsuranceDetails] = useState({
    provider: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS123456789',
    groupNumber: 'GRP987654',
    planType: 'PPO',
    coverageStartDate: '2024-01-01',
    coverageEndDate: '2024-12-31',
    primaryHolder: 'John Doe',
    relationship: 'Self',
    copay: {
      primaryCare: 25,
      specialist: 50,
      emergencyRoom: 250,
    },
    deductible: {
      individual: 1500,
      family: 3000,
    },
    outOfPocketMax: {
      individual: 5000,
      family: 10000,
    },
    pointOfContact: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@bcbs.com',
      department: 'Member Services',
    },
  });

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
  };

  const handleCardClick = () => {
    setShowDetails(!showDetails);
  };

  if (!showDetails) {
    return (
      <Card 
        sx={{ 
          borderRadius: 4,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          background: '#fff',
          mb: 2
        }}
      >
        <CardActionArea onClick={handleCardClick}>
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <InsuranceIcon sx={{ color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" color="primary.main">
                Health Insurance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to view insurance details
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}
          >
            <InsuranceIcon sx={{ color: 'primary.main' }} />
          </Box>
          <Typography variant="h5">Health Insurance</Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
            sx={{ mr: 1 }}
          >
            {editMode ? 'Save Changes' : 'Edit'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Insurance
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Insurance Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <PolicyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Insurance Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Provider"
                  secondary={editMode ? (
                    <TextField
                      fullWidth
                      value={insuranceDetails.provider}
                      onChange={(e) => setInsuranceDetails({ ...insuranceDetails, provider: e.target.value })}
                    />
                  ) : insuranceDetails.provider}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Policy Number"
                  secondary={editMode ? (
                    <TextField
                      fullWidth
                      value={insuranceDetails.policyNumber}
                      onChange={(e) => setInsuranceDetails({ ...insuranceDetails, policyNumber: e.target.value })}
                    />
                  ) : insuranceDetails.policyNumber}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Group Number"
                  secondary={editMode ? (
                    <TextField
                      fullWidth
                      value={insuranceDetails.groupNumber}
                      onChange={(e) => setInsuranceDetails({ ...insuranceDetails, groupNumber: e.target.value })}
                    />
                  ) : insuranceDetails.groupNumber}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Plan Type"
                  secondary={editMode ? (
                    <TextField
                      fullWidth
                      value={insuranceDetails.planType}
                      onChange={(e) => setInsuranceDetails({ ...insuranceDetails, planType: e.target.value })}
                    />
                  ) : insuranceDetails.planType}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Coverage Period"
                  secondary={`${insuranceDetails.coverageStartDate} to ${insuranceDetails.coverageEndDate}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Coverage Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Coverage Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Copay"
                  secondary={
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Primary Care"
                          secondary={`$${insuranceDetails.copay.primaryCare}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Specialist"
                          secondary={`$${insuranceDetails.copay.specialist}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Emergency Room"
                          secondary={`$${insuranceDetails.copay.emergencyRoom}`}
                        />
                      </ListItem>
                    </List>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Deductible"
                  secondary={
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Individual"
                          secondary={`$${insuranceDetails.deductible.individual}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Family"
                          secondary={`$${insuranceDetails.deductible.family}`}
                        />
                      </ListItem>
                    </List>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Out of Pocket Maximum"
                  secondary={
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Individual"
                          secondary={`$${insuranceDetails.outOfPocketMax.individual}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Family"
                          secondary={`$${insuranceDetails.outOfPocketMax.family}`}
                        />
                      </ListItem>
                    </List>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Point of Contact */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <ContactIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Point of Contact
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Name"
                  secondary={editMode ? (
                    <TextField
                      fullWidth
                      value={insuranceDetails.pointOfContact.name}
                      onChange={(e) => setInsuranceDetails({
                        ...insuranceDetails,
                        pointOfContact: { ...insuranceDetails.pointOfContact, name: e.target.value }
                      })}
                    />
                  ) : insuranceDetails.pointOfContact.name}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Phone"
                  secondary={editMode ? (
                    <TextField
                      fullWidth
                      value={insuranceDetails.pointOfContact.phone}
                      onChange={(e) => setInsuranceDetails({
                        ...insuranceDetails,
                        pointOfContact: { ...insuranceDetails.pointOfContact, phone: e.target.value }
                      })}
                    />
                  ) : insuranceDetails.pointOfContact.phone}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Email"
                  secondary={editMode ? (
                    <TextField
                      fullWidth
                      value={insuranceDetails.pointOfContact.email}
                      onChange={(e) => setInsuranceDetails({
                        ...insuranceDetails,
                        pointOfContact: { ...insuranceDetails.pointOfContact, email: e.target.value }
                      })}
                    />
                  ) : insuranceDetails.pointOfContact.email}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Department"
                  secondary={editMode ? (
                    <TextField
                      fullWidth
                      value={insuranceDetails.pointOfContact.department}
                      onChange={(e) => setInsuranceDetails({
                        ...insuranceDetails,
                        pointOfContact: { ...insuranceDetails.pointOfContact, department: e.target.value }
                      })}
                    />
                  ) : insuranceDetails.pointOfContact.department}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Insurance Dialog */}
      <Dialog open={showAddDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Insurance</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Insurance Provider"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Policy Number"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Group Number"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Plan Type"
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Add Insurance
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default HealthInsurance; 