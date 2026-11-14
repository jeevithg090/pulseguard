import { SYMPTOMS_BY_ID } from '../data/symptoms';

/** Triage levels, ordered from least to most urgent. */
export const TRIAGE_LEVELS = ['self-care', 'routine', 'urgent', 'emergency'];

export const TRIAGE_META = {
  'self-care': {
    label: 'Self-care',
    color: 'success',
    headline: 'Your symptoms can likely be managed at home',
    advice: [
      'Rest and stay well hydrated.',
      'Track how your symptoms change over the next few days.',
      'Book a routine appointment if they do not improve.',
    ],
  },
  routine: {
    label: 'See a doctor',
    color: 'info',
    headline: 'Book an appointment with a doctor in the next few days',
    advice: [
      'Schedule a routine appointment with your doctor.',
      'Keep a note of when symptoms start and what makes them better or worse.',
      'Seek care sooner if symptoms get worse.',
    ],
  },
  urgent: {
    label: 'Urgent care',
    color: 'warning',
    headline: 'Get medical advice today',
    advice: [
      'Contact your doctor or visit an urgent care centre today.',
      'Do not drive yourself if you feel faint or unwell.',
      'Call emergency services if symptoms suddenly worsen.',
    ],
  },
  emergency: {
    label: 'Emergency',
    color: 'error',
    headline: 'Call emergency services or go to the nearest emergency department now',
    advice: [
      'Call your local emergency number immediately.',
      'Do not wait to see whether symptoms improve.',
      'If possible, have someone stay with you.',
    ],
  },
};

const UNIT_HOURS = { hours: 1, days: 24, weeks: 24 * 7 };

/** Converts a duration value and unit into hours. Invalid input yields 0. */
export function toHours(value, unit = 'hours') {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n * (UNIT_HOURS[unit] ?? 1);
}

const maxLevel = (a, b) => (TRIAGE_LEVELS.indexOf(a) >= TRIAGE_LEVELS.indexOf(b) ? a : b);

/**
 * Assesses a single symptom entry.
 * @param {{id: string, severity: number, duration: number, unit: string}} entry
 * @returns {{id: string, level: string, reasons: string[]}}
 */
export function assessSymptom(entry) {
  const def = SYMPTOMS_BY_ID[entry.id];
  const severity = Number(entry.severity) || 1;
  const hours = toHours(entry.duration, entry.unit);
  const reasons = [];
  let level = 'self-care';

  if (!def) return { id: entry.id, level, reasons };

  if (def.redFlag && severity >= 7) {
    level = 'emergency';
    reasons.push(`${def.label} rated ${severity}/10 can be a sign of a medical emergency`);
  }
  if (severity >= def.urgentSeverity) {
    level = maxLevel(level, 'urgent');
    reasons.push(`Severity ${severity}/10 is high for ${def.label.toLowerCase()}`);
  }
  if (def.redFlag && severity >= 4) {
    level = maxLevel(level, 'urgent');
    if (severity < 7) reasons.push(`${def.label} should always be checked promptly`);
  }
  if (hours >= def.urgentAfterHours) {
    level = maxLevel(level, 'urgent');
    reasons.push(`${def.label} has lasted longer than expected`);
  } else if (hours >= def.reviewAfterHours) {
    level = maxLevel(level, 'routine');
    reasons.push(`${def.label} has lasted long enough to be reviewed by a doctor`);
  }
  if (severity >= 5) {
    level = maxLevel(level, 'routine');
    if (reasons.length === 0) reasons.push(`Moderate-to-severe ${def.label.toLowerCase()}`);
  }

  return { id: entry.id, level, reasons };
}

/**
 * Rule-based triage across all reported symptoms.
 * This is an illustrative demo algorithm and not a medical device.
 *
 * @param {Array<{id: string, severity: number, duration: number, unit: string}>} entries
 * @returns {{level: string, results: Array, flagged: string[], reasons: string[]}}
 */
export function assessSymptoms(entries = []) {
  const results = entries.map(assessSymptom);
  let level = results.reduce((acc, r) => maxLevel(acc, r.level), 'self-care');
  const reasons = [];

  const byId = Object.fromEntries(entries.map((e) => [e.id, Number(e.severity) || 1]));
  if ((byId.chest_pain ?? 0) >= 5 && (byId.shortness_of_breath ?? 0) >= 5) {
    level = 'emergency';
    reasons.push('Chest pain together with shortness of breath needs emergency assessment');
  }

  const severeCount = entries.filter((e) => Number(e.severity) >= 6).length;
  if (severeCount >= 3) {
    level = maxLevel(level, 'urgent');
    reasons.push('Several severe symptoms at the same time');
  }

  const flagged = results
    .filter((r) => TRIAGE_LEVELS.indexOf(r.level) >= TRIAGE_LEVELS.indexOf('urgent'))
    .map((r) => r.id);

  return { level, results, flagged, reasons };
}

/**
 * Suggests related symptoms the user may also want to report,
 * excluding anything already selected. Ordered by how many selected
 * symptoms point at each suggestion.
 */
export function suggestRelatedSymptoms(selectedIds = [], limit = 4) {
  const selected = new Set(selectedIds);
  const score = new Map();
  selectedIds.forEach((id) => {
    (SYMPTOMS_BY_ID[id]?.related ?? []).forEach((rel) => {
      if (!selected.has(rel)) score.set(rel, (score.get(rel) ?? 0) + 1);
    });
  });
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([id]) => id);
}

/** Maps a triage level to a 1–4 numeric priority (4 = most urgent). */
export function triagePriority(level) {
  return TRIAGE_LEVELS.indexOf(level) + 1;
}
