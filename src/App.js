import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Layout Components
import Header from './components/layout/Header';

// Patient Interface Components
import PatientDashboard from './components/patient/Dashboard';
import SymptomForm from './components/patient/SymptomForm';
import CareNavigation from './components/patient/CareNavigation';
import FollowUpReminders from './components/patient/FollowUpReminders';
import AppointmentBooking from './components/patient/AppointmentBooking';

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
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
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
            {/* Patient Routes */}
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/symptoms" element={<SymptomForm />} />
            <Route path="/patient/care-navigation" element={<CareNavigation />} />
            <Route path="/patient/reminders" element={<FollowUpReminders />} />
            <Route path="/patient/book-appointment" element={<AppointmentBooking />} />

            {/* Hospital Routes */}
            <Route path="/hospital" element={<HospitalDashboard />} />
            <Route path="/hospital/resources" element={<ResourceAllocation />} />
            <Route path="/hospital/crisis" element={<CrisisPrediction />} />
            <Route path="/hospital/scheduling" element={<AppointmentScheduling />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
