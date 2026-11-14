import { addDays, set, startOfDay, subMinutes } from 'date-fns';

/** Simulated data for the hospital portal. Every name here is fictional. */

export const DEPARTMENTS = [
  'Cardiology',
  'Emergency',
  'General Medicine',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
];

export const BED_TYPES = ['ICU', 'General', 'Pediatric', 'Maternity'];
export const BED_STATUSES = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];

export const SEED_BEDS = [
  { id: 'bed-101', number: '101', type: 'ICU', status: 'Occupied', patient: 'Patient #4821' },
  { id: 'bed-102', number: '102', type: 'ICU', status: 'Occupied', patient: 'Patient #4830' },
  { id: 'bed-103', number: '103', type: 'ICU', status: 'Available', patient: '' },
  { id: 'bed-201', number: '201', type: 'General', status: 'Occupied', patient: 'Patient #4799' },
  { id: 'bed-202', number: '202', type: 'General', status: 'Cleaning', patient: '' },
  { id: 'bed-203', number: '203', type: 'General', status: 'Available', patient: '' },
  { id: 'bed-204', number: '204', type: 'General', status: 'Occupied', patient: 'Patient #4812' },
  { id: 'bed-301', number: '301', type: 'Pediatric', status: 'Available', patient: '' },
  { id: 'bed-302', number: '302', type: 'Pediatric', status: 'Occupied', patient: 'Patient #4840' },
  { id: 'bed-401', number: '401', type: 'Maternity', status: 'Maintenance', patient: '' },
];

export const SHIFTS = ['Morning', 'Evening', 'Night'];
export const STAFF_STATUSES = ['On duty', 'On break', 'Off duty'];

export const SEED_STAFF = [
  {
    id: 'st-1',
    name: 'Dr. Sarah Smith',
    role: 'Cardiologist',
    shift: 'Morning',
    status: 'On duty',
  },
  {
    id: 'st-2',
    name: 'Dr. Michael Johnson',
    role: 'Physician',
    shift: 'Evening',
    status: 'On duty',
  },
  { id: 'st-3', name: 'Dr. Priya Rao', role: 'Pediatrician', shift: 'Morning', status: 'On break' },
  { id: 'st-4', name: 'Nurse Emily Davis', role: 'ICU Nurse', shift: 'Night', status: 'Off duty' },
  { id: 'st-5', name: 'Nurse Rahul Nair', role: 'ER Nurse', shift: 'Morning', status: 'On duty' },
  {
    id: 'st-6',
    name: 'Dr. Arjun Mehta',
    role: 'Orthopedic Surgeon',
    shift: 'Evening',
    status: 'Off duty',
  },
];

export const SEED_ALERTS = [
  {
    id: 'alert-heat',
    category: 'Weather',
    severity: 'high',
    title: 'Heatwave advisory in effect',
    impact: 'Expect more heat exhaustion and dehydration cases over the next 72 hours.',
    action: 'Prepare cooling bays and IV fluids in the emergency department.',
  },
  {
    id: 'alert-flu',
    category: 'Disease',
    severity: 'medium',
    title: 'Rise in influenza-like illness',
    impact: 'Respiratory presentations are up week-on-week in the district.',
    action: 'Review ICU capacity and staff vaccination status.',
  },
  {
    id: 'alert-event',
    category: 'Event',
    severity: 'low',
    title: 'Large public event this weekend',
    impact: 'Possible increase in minor injuries near the stadium.',
    action: 'Place an extra triage nurse on the Saturday evening shift.',
  },
];

export const SEED_PREDICTIONS = [
  {
    id: 'pred-surge',
    metric: 'Patient surge',
    probability: 72,
    timeframe: 'Next 24 hours',
    factors: ['Heatwave advisory', 'Weekend admissions pattern', 'Recent ED arrivals'],
  },
  {
    id: 'pred-icu',
    metric: 'ICU capacity strain',
    probability: 58,
    timeframe: 'Next 48 hours',
    factors: ['Current ICU occupancy', 'Respiratory trend', 'Planned surgeries'],
  },
  {
    id: 'pred-supply',
    metric: 'IV fluid shortage',
    probability: 31,
    timeframe: 'Next 7 days',
    factors: ['Stock on hand', 'Supplier lead time'],
  },
];

export const ENVIRONMENT = {
  temperatureC: 36,
  humidity: 58,
  airQuality: 'Moderate',
  aqi: 112,
  pollen: 'High',
};

export const RECOMMENDED_ACTIONS = [
  {
    id: 'ra-1',
    title: 'Add one ICU nurse to the night shift',
    detail: 'Covers the predicted ICU strain window.',
  },
  {
    id: 'ra-2',
    title: 'Brief the emergency response team',
    detail: 'Heat-illness protocol and cooling bays.',
  },
  {
    id: 'ra-3',
    title: 'Re-order IV fluids and ORS',
    detail: 'Bring stock above the 7-day threshold.',
  },
];

const at = (dayOffset, hours, minutes = 0) =>
  set(addDays(startOfDay(new Date()), dayOffset), { hours, minutes }).toISOString();

export const APPOINTMENT_TYPES = ['Consultation', 'Follow-up', 'Emergency', 'Procedure'];
export const APPOINTMENT_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

export const SEED_HOSPITAL_APPOINTMENTS = [
  {
    id: 'ha-1',
    patientName: 'Patient #4821',
    type: 'Follow-up',
    doctor: 'Dr. Sarah Smith',
    department: 'Cardiology',
    datetime: at(0, 10, 30),
    status: 'Confirmed',
    notes: 'Post-discharge review',
  },
  {
    id: 'ha-2',
    patientName: 'Patient #4855',
    type: 'Consultation',
    doctor: 'Dr. Michael Johnson',
    department: 'General Medicine',
    datetime: at(0, 14, 0),
    status: 'Pending',
    notes: 'New patient',
  },
  {
    id: 'ha-3',
    patientName: 'Patient #4790',
    type: 'Procedure',
    doctor: 'Dr. Arjun Mehta',
    department: 'Orthopedics',
    datetime: at(1, 9, 0),
    status: 'Confirmed',
    notes: 'Knee arthroscopy pre-assessment',
  },
  {
    id: 'ha-4',
    patientName: 'Patient #4802',
    type: 'Consultation',
    doctor: 'Dr. Priya Rao',
    department: 'Pediatrics',
    datetime: at(-1, 11, 15),
    status: 'Completed',
    notes: 'Vaccination schedule',
  },
];

/** Symptom reports already in the triage queue (patient-submitted reports are added on top). */
export const SEED_TRIAGE_QUEUE = [
  {
    id: 'tq-1',
    patient: 'Patient #4861',
    age: 58,
    symptoms: ['Chest pain', 'Shortness of breath'],
    level: 'emergency',
    submittedAt: subMinutes(new Date(), 6).toISOString(),
    status: 'Escalated',
  },
  {
    id: 'tq-2',
    patient: 'Patient #4859',
    age: 34,
    symptoms: ['Fever', 'Cough', 'Fatigue'],
    level: 'urgent',
    submittedAt: subMinutes(new Date(), 18).toISOString(),
    status: 'Pending review',
  },
  {
    id: 'tq-3',
    patient: 'Patient #4857',
    age: 27,
    symptoms: ['Headache', 'Nausea'],
    level: 'routine',
    submittedAt: subMinutes(new Date(), 41).toISOString(),
    status: 'In review',
  },
  {
    id: 'tq-4',
    patient: 'Patient #4850',
    age: 45,
    symptoms: ['Rash'],
    level: 'self-care',
    submittedAt: subMinutes(new Date(), 75).toISOString(),
    status: 'Advice sent',
  },
];
