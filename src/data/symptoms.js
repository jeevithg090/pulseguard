/**
 * Symptom catalogue used by the symptom reporter and the triage rules.
 *
 * - `redFlag`: symptoms that can indicate a medical emergency.
 * - `urgentSeverity`: severity (1–10) at or above which the symptom alone needs prompt care.
 * - `reviewAfterHours`: duration after which a clinician should review it.
 * - `urgentAfterHours`: duration after which it needs prompt care regardless of severity.
 *
 * Thresholds are illustrative demo values, not clinical guidance.
 */
export const SYMPTOMS = [
  {
    id: 'fever',
    label: 'Fever',
    category: 'General',
    description: 'Raised body temperature, chills or sweats',
    urgentSeverity: 8,
    reviewAfterHours: 48,
    urgentAfterHours: 72,
    related: ['cough', 'headache', 'fatigue', 'sore_throat'],
  },
  {
    id: 'cough',
    label: 'Cough',
    category: 'Respiratory',
    description: 'Persistent cough or throat irritation',
    urgentSeverity: 9,
    reviewAfterHours: 72,
    urgentAfterHours: 21 * 24,
    related: ['fever', 'shortness_of_breath', 'sore_throat'],
  },
  {
    id: 'sore_throat',
    label: 'Sore throat',
    category: 'Respiratory',
    description: 'Pain or scratchiness when swallowing',
    urgentSeverity: 9,
    reviewAfterHours: 72,
    urgentAfterHours: 7 * 24,
    related: ['fever', 'cough'],
  },
  {
    id: 'shortness_of_breath',
    label: 'Shortness of breath',
    category: 'Respiratory',
    description: 'Difficulty breathing or feeling breathless',
    redFlag: true,
    urgentSeverity: 6,
    reviewAfterHours: 2,
    urgentAfterHours: 6,
    related: ['chest_pain', 'cough', 'dizziness'],
  },
  {
    id: 'chest_pain',
    label: 'Chest pain',
    category: 'Cardiovascular',
    description: 'Pain, pressure or tightness in the chest',
    redFlag: true,
    urgentSeverity: 5,
    reviewAfterHours: 1,
    urgentAfterHours: 2,
    related: ['shortness_of_breath', 'dizziness', 'nausea'],
  },
  {
    id: 'headache',
    label: 'Headache',
    category: 'Neurological',
    description: 'Pain in the head, temples or behind the eyes',
    urgentSeverity: 9,
    reviewAfterHours: 72,
    urgentAfterHours: 7 * 24,
    related: ['fever', 'nausea', 'dizziness'],
  },
  {
    id: 'dizziness',
    label: 'Dizziness',
    category: 'Neurological',
    description: 'Light-headedness, spinning or loss of balance',
    urgentSeverity: 8,
    reviewAfterHours: 24,
    urgentAfterHours: 72,
    related: ['headache', 'nausea'],
  },
  {
    id: 'fatigue',
    label: 'Fatigue',
    category: 'General',
    description: 'Unusual tiredness or lack of energy',
    urgentSeverity: 10,
    reviewAfterHours: 14 * 24,
    urgentAfterHours: 30 * 24,
    related: ['fever', 'dizziness'],
  },
  {
    id: 'nausea',
    label: 'Nausea',
    category: 'Digestive',
    description: 'Feeling sick to the stomach',
    urgentSeverity: 9,
    reviewAfterHours: 48,
    urgentAfterHours: 96,
    related: ['vomiting', 'headache', 'dizziness'],
  },
  {
    id: 'vomiting',
    label: 'Vomiting',
    category: 'Digestive',
    description: 'Being sick; risk of dehydration',
    urgentSeverity: 8,
    reviewAfterHours: 24,
    urgentAfterHours: 48,
    related: ['nausea', 'diarrhea', 'fever'],
  },
  {
    id: 'diarrhea',
    label: 'Diarrhoea',
    category: 'Digestive',
    description: 'Loose or watery stools',
    urgentSeverity: 9,
    reviewAfterHours: 48,
    urgentAfterHours: 7 * 24,
    related: ['vomiting', 'nausea', 'fever'],
  },
  {
    id: 'rash',
    label: 'Rash',
    category: 'Skin',
    description: 'Red, itchy or irritated skin',
    urgentSeverity: 9,
    reviewAfterHours: 72,
    urgentAfterHours: 14 * 24,
    related: ['fever'],
  },
];

export const SYMPTOMS_BY_ID = Object.fromEntries(SYMPTOMS.map((s) => [s.id, s]));

export const DURATION_UNITS = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
];

export const SEVERITY_LABELS = {
  1: 'Very mild',
  2: 'Mild',
  3: 'Mild–moderate',
  4: 'Moderate',
  5: 'Moderate–severe',
  6: 'Severe',
  7: 'Very severe',
  8: 'Intense',
  9: 'Very intense',
  10: 'Worst imaginable',
};

export const SYMPTOM_PATTERNS = [
  { id: 'morning', label: 'Mornings' },
  { id: 'afternoon', label: 'Afternoons' },
  { id: 'evening', label: 'Evenings' },
  { id: 'night', label: 'At night' },
  { id: 'after_eating', label: 'After eating' },
  { id: 'during_exercise', label: 'During exercise' },
  { id: 'at_rest', label: 'At rest' },
  { id: 'during_stress', label: 'When stressed' },
];

export const BODY_REGIONS = [
  { id: 'head', label: 'Head' },
  { id: 'face', label: 'Face' },
  { id: 'neck', label: 'Neck & throat' },
  { id: 'chest', label: 'Chest' },
  { id: 'abdomen', label: 'Abdomen' },
  { id: 'back', label: 'Back' },
  { id: 'arms', label: 'Arms & hands' },
  { id: 'legs', label: 'Legs & feet' },
  { id: 'skin', label: 'Skin (widespread)' },
];

export const ENVIRONMENTAL_FACTORS = [
  { id: 'hot_weather', label: 'Hot weather', group: 'Weather' },
  { id: 'cold_weather', label: 'Cold weather', group: 'Weather' },
  { id: 'humid', label: 'Humidity', group: 'Weather' },
  { id: 'polluted_air', label: 'Air pollution', group: 'Air quality' },
  { id: 'pollen', label: 'Pollen', group: 'Air quality' },
  { id: 'dust', label: 'Dust', group: 'Air quality' },
  { id: 'smoke', label: 'Smoke', group: 'Air quality' },
  { id: 'workplace', label: 'At work', group: 'Setting' },
  { id: 'home', label: 'At home', group: 'Setting' },
  { id: 'travel', label: 'After travel', group: 'Setting' },
];
