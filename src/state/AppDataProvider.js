import React, { createContext, useCallback, useContext, useMemo } from 'react';
import usePersistentState from '../hooks/usePersistentState';
import { SEED_INSURANCE } from '../data/patient';
import { SEED_BEDS, SEED_HOSPITAL_APPOINTMENTS, SEED_STAFF } from '../data/hospital';
import { seedReminders, seedAppointments } from '../data/seeds';
import { STORAGE_PREFIX } from '../utils/storage';

const AppDataContext = createContext(null);

/**
 * Client-side demo "database". Every slice is persisted to localStorage so the
 * patient and hospital portals share data within the same browser.
 */
export default function AppDataProvider({ children }) {
  const [reminders, setReminders] = usePersistentState('reminders', seedReminders);
  const [appointments, setAppointments] = usePersistentState('appointments', seedAppointments);
  const [symptomReports, setSymptomReports] = usePersistentState('symptomReports', []);
  const [readMessages, setReadMessages] = usePersistentState('readMessages', ['msg-4', 'msg-5']);
  const [favorites, setFavorites] = usePersistentState('favoriteFacilities', []);
  const [insurance, setInsurance] = usePersistentState('insurance', SEED_INSURANCE);
  const [beds, setBeds] = usePersistentState('beds', SEED_BEDS);
  const [staff, setStaff] = usePersistentState('staff', SEED_STAFF);
  const [hospitalAppointments, setHospitalAppointments] = usePersistentState(
    'hospitalAppointments',
    SEED_HOSPITAL_APPOINTMENTS,
  );
  const [acknowledgedAlerts, setAcknowledgedAlerts] = usePersistentState('acknowledgedAlerts', []);

  const resetDemoData = useCallback(() => {
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX) && !k.endsWith('colorMode'))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // storage unavailable — nothing to clear
    }
    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({
      reminders,
      setReminders,
      appointments,
      setAppointments,
      symptomReports,
      setSymptomReports,
      readMessages,
      setReadMessages,
      favorites,
      setFavorites,
      insurance,
      setInsurance,
      beds,
      setBeds,
      staff,
      setStaff,
      hospitalAppointments,
      setHospitalAppointments,
      acknowledgedAlerts,
      setAcknowledgedAlerts,
      resetDemoData,
    }),
    [
      reminders,
      setReminders,
      appointments,
      setAppointments,
      symptomReports,
      setSymptomReports,
      readMessages,
      setReadMessages,
      favorites,
      setFavorites,
      insurance,
      setInsurance,
      beds,
      setBeds,
      staff,
      setStaff,
      hospitalAppointments,
      setHospitalAppointments,
      acknowledgedAlerts,
      setAcknowledgedAlerts,
      resetDemoData,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
}
