import { addDays, set, startOfDay } from 'date-fns';

const at = (dayOffset, hours, minutes = 0) =>
  set(addDays(startOfDay(new Date()), dayOffset), { hours, minutes }).toISOString();

/** Initial reminders for the demo patient (relative to today so they never look stale). */
export const seedReminders = () => [
  {
    id: 'rem-seed-1',
    title: 'Blood-pressure tablet',
    type: 'medication',
    datetime: at(1, 8, 0),
    repeat: 'daily',
    notify: true,
    notified: false,
    completed: false,
  },
  {
    id: 'rem-seed-2',
    title: 'Fasting blood test',
    type: 'test',
    datetime: at(3, 7, 30),
    repeat: 'none',
    notify: true,
    notified: false,
    completed: false,
  },
];

/** Initial booked appointments for the demo patient. */
export const seedAppointments = () => [
  {
    id: 'appt-seed-1',
    doctorId: 'dr-sarah-smith',
    datetime: at(2, 10, 0),
    mode: 'in-person',
    reason: 'follow-up',
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  },
];
