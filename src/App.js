import React, { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ColorModeProvider from './theme/ColorModeProvider';
import AppDataProvider from './state/AppDataProvider';
import ToastProvider from './state/ToastProvider';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));
const SymptomReport = lazy(() => import('./pages/patient/SymptomReport'));
const FacilitySearch = lazy(() => import('./pages/patient/FacilitySearch'));
const Reminders = lazy(() => import('./pages/patient/Reminders'));
const AppointmentBooking = lazy(() => import('./pages/patient/AppointmentBooking'));
const Messages = lazy(() => import('./pages/patient/Messages'));
const HospitalDashboard = lazy(() => import('./pages/hospital/HospitalDashboard'));
const ResourceAllocation = lazy(() => import('./pages/hospital/ResourceAllocation'));
const CrisisPrediction = lazy(() => import('./pages/hospital/CrisisPrediction'));
const AppointmentScheduling = lazy(() => import('./pages/hospital/AppointmentScheduling'));

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />

        <Route path="patient">
          <Route index element={<PatientDashboard />} />
          <Route path="symptoms" element={<SymptomReport />} />
          <Route path="book-appointment" element={<AppointmentBooking />} />
          <Route path="facilities" element={<FacilitySearch />} />
          <Route path="care-navigation" element={<Navigate to="/patient/facilities" replace />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        <Route path="hospital">
          <Route index element={<HospitalDashboard />} />
          <Route path="resources" element={<ResourceAllocation />} />
          <Route path="crisis" element={<CrisisPrediction />} />
          <Route path="appointments" element={<AppointmentScheduling />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export function AppProviders({ children }) {
  return (
    <ColorModeProvider>
      <AppDataProvider>
        <ToastProvider>{children}</ToastProvider>
      </AppDataProvider>
    </ColorModeProvider>
  );
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter basename={process.env.PUBLIC_URL || undefined}>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}
