import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Layout Components
import Header from './components/layout/Header';
import HomePage from './components/HomePage';

// Patient Interface Components
import PatientDashboard from './components/patient/Dashboard';
import SymptomReport from './components/patient/SymptomReport';
import HealthcareFacilitySearch from './components/patient/HealthcareFacilitySearch';
import FollowUpReminders from './components/patient/FollowUpReminders';
import AppointmentBooking from './components/patient/AppointmentBooking';
import AllMessages from './components/patient/AllMessages';
import CareNavigation from './components/patient/CareNavigation';

// Hospital Interface Components
import HospitalDashboard from './components/hospital/Dashboard';
import ResourceAllocation from './components/hospital/ResourceAllocation';
import CrisisPrediction from './components/hospital/CrisisPrediction';
import AppointmentScheduling from './components/hospital/AppointmentScheduling';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    success: {
      main: '#2e7d32',
    },
    info: {
      main: '#0288d1',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#1a237e',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#1a237e',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#1a237e',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#1a237e',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#1a237e',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#1a237e',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router>
          <Header />
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<HomePage />} />

            {/* Patient Routes */}
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/messages" element={<AllMessages />} />
            <Route path="/patient/symptoms" element={<SymptomReport />} />
            <Route path="/patient/facilities" element={<HealthcareFacilitySearch />} />
            <Route path="/patient/reminders" element={<FollowUpReminders />} />
            <Route path="/patient/book-appointment" element={<AppointmentBooking />} />
            <Route path="/patient/care-navigation" element={<CareNavigation />} />

            {/* Hospital Routes */}
            <Route path="/hospital" element={<HospitalDashboard />} />
            <Route path="/hospital/resources" element={<ResourceAllocation />} />
            <Route path="/hospital/crisis" element={<CrisisPrediction />} />
            <Route path="/hospital/appointments" element={<AppointmentScheduling />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
