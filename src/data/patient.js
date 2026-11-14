import { subDays } from 'date-fns';

/** The fictional demo patient whose portal is shown. */
export const DEMO_PATIENT = {
  firstName: 'Alex',
  lastName: 'Morgan',
};

const daysAgo = (n) => subDays(new Date(), n).toISOString();

export const SEED_MESSAGES = [
  {
    id: 'msg-1',
    title: 'Lab results available',
    body: 'Your recent blood work results are now available. Your doctor has added a note: all values are within the normal range.',
    from: 'Lakeside General Hospital · Lab',
    date: daysAgo(1),
    type: 'results',
  },
  {
    id: 'msg-2',
    title: 'Prescription refill approved',
    body: 'Your refill request for your blood-pressure medication has been approved and is ready for pickup at the pharmacy.',
    from: 'Dr. Michael Johnson',
    date: daysAgo(2),
    type: 'prescription',
  },
  {
    id: 'msg-3',
    title: 'Follow-up care instructions',
    body: 'Thanks for visiting. Please continue the prescribed exercises twice daily and book a follow-up in four weeks.',
    from: 'Dr. Arjun Mehta',
    date: daysAgo(5),
    type: 'care',
  },
  {
    id: 'msg-4',
    title: 'Insurance claim processed',
    body: 'Your claim for the consultation on your last visit has been processed. No further action is needed.',
    from: 'Billing',
    date: daysAgo(9),
    type: 'insurance',
  },
  {
    id: 'msg-5',
    title: 'Flu vaccination clinic',
    body: 'Seasonal flu vaccinations are available this month at all partner clinics. Walk-ins are welcome.',
    from: 'PulseGuard',
    date: daysAgo(14),
    type: 'reminder',
  },
];

export const MESSAGE_TYPES = {
  results: { label: 'Results', color: 'success' },
  prescription: { label: 'Prescription', color: 'warning' },
  care: { label: 'Care', color: 'info' },
  insurance: { label: 'Insurance', color: 'secondary' },
  reminder: { label: 'Reminder', color: 'primary' },
};

export const SEED_INSURANCE = {
  provider: 'Star Health',
  planType: 'Family Floater',
  policyNumber: 'DEMO-0000-1234',
  groupNumber: 'GRP-DEMO-01',
  validUntil: `${new Date().getFullYear()}-12-31`,
  copay: { primaryCare: 300, specialist: 500, emergency: 2500 },
  contactPhone: '+91 80 5550 9000',
};
