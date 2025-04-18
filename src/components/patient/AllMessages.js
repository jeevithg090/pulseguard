import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Message as MessageIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    title: 'Appointment Reminder',
    content: 'Your appointment with Dr. Smith is scheduled for tomorrow at 10:00 AM',
    date: '2024-03-20',
    type: 'reminder',
    isRead: false,
  },
  {
    id: 2,
    title: 'Lab Results Available',
    content: 'Your recent blood work results are now available in your patient portal',
    date: '2024-03-19',
    type: 'results',
    isRead: true,
  },
  {
    id: 3,
    title: 'Prescription Refill',
    content: 'Your prescription refill request has been approved',
    date: '2024-03-18',
    type: 'prescription',
    isRead: false,
  },
  {
    id: 4,
    title: 'Follow-up Care Instructions',
    content: 'Please review the attached follow-up care instructions from your recent visit',
    date: '2024-03-17',
    type: 'care',
    isRead: true,
  },
  {
    id: 5,
    title: 'Insurance Update',
    content: 'Your insurance claim has been processed successfully',
    date: '2024-03-16',
    type: 'insurance',
    isRead: true,
  },
];

const AllMessages = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const handleBack = () => {
    navigate('/patient');
  };

  const getMessageTypeColor = (type) => {
    const colors = {
      reminder: 'primary',
      results: 'success',
      prescription: 'warning',
      care: 'info',
      insurance: 'secondary',
    };
    return colors[type] || 'default';
  };

  const filteredAndSortedMessages = mockMessages
    .filter((message) => {
      const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || message.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">All Messages</Typography>
        </Box>

        {/* Filters and Search */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterType}
              label="Filter"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="reminder">Reminders</MenuItem>
              <MenuItem value="results">Results</MenuItem>
              <MenuItem value="prescription">Prescriptions</MenuItem>
              <MenuItem value="care">Care</MenuItem>
              <MenuItem value="insurance">Insurance</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Messages List */}
        <List>
          {filteredAndSortedMessages.map((message, index) => (
            <React.Fragment key={message.id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  py: 2,
                  backgroundColor: message.isRead ? 'transparent' : 'action.hover',
                }}
              >
                <ListItemIcon>
                  <MessageIcon color={message.isRead ? 'action' : 'primary'} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" component="span">
                        {message.title}
                      </Typography>
                      <Chip
                        label={message.type}
                        size="small"
                        color={getMessageTypeColor(message.type)}
                      />
                      {!message.isRead && (
                        <Chip label="New" size="small" color="error" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {message.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default AllMessages; 