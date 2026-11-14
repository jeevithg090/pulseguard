import { addDays, addMonths, addWeeks, isBefore } from 'date-fns';

export const REPEAT_OPTIONS = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const REMINDER_TYPES = [
  { value: 'medication', label: 'Medication' },
  { value: 'test', label: 'Test / lab work' },
  { value: 'appointment', label: 'Appointment' },
  { value: 'other', label: 'Other' },
];

/** Returns the next occurrence of a repeating reminder, or `null` if it does not repeat. */
export function nextOccurrence(datetime, repeat) {
  const date = new Date(datetime);
  switch (repeat) {
    case 'daily':
      return addDays(date, 1);
    case 'weekly':
      return addWeeks(date, 1);
    case 'monthly':
      return addMonths(date, 1);
    default:
      return null;
  }
}

/**
 * Classifies a reminder relative to `now`:
 * `done` | `overdue` | `today` (within 24h) | `upcoming`.
 */
export function reminderStatus(reminder, now = new Date()) {
  if (reminder.completed) return 'done';
  const due = new Date(reminder.datetime);
  if (isBefore(due, now)) return 'overdue';
  if (isBefore(due, addDays(now, 1))) return 'today';
  return 'upcoming';
}

/** Sorts reminders by due time without mutating the input. */
export function sortReminders(reminders) {
  return [...reminders].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
}

/**
 * Validates reminder form values. Returns an object of field → message;
 * an empty object means the values are valid.
 */
export function validateReminder({ title, datetime }, { isNew = true, now = new Date() } = {}) {
  const errors = {};
  if (!title || !title.trim()) errors.title = 'Give the reminder a short title.';
  else if (title.trim().length > 80) errors.title = 'Keep the title under 80 characters.';

  const date = datetime ? new Date(datetime) : null;
  if (!date || Number.isNaN(date.getTime())) errors.datetime = 'Choose a date and time.';
  else if (isNew && isBefore(date, now)) errors.datetime = 'Choose a time in the future.';
  return errors;
}

/**
 * Finds reminders that are due and have not been notified yet.
 * Returns `{ due, updated }` where `updated` is the new reminder list with
 * due reminders marked as notified and the next occurrence of any repeating
 * reminder appended.
 */
export function collectDueReminders(reminders, now = new Date(), makeId) {
  const due = [];
  const updated = [];
  reminders.forEach((reminder) => {
    const isDue =
      !reminder.completed && !reminder.notified && !isBefore(now, new Date(reminder.datetime));
    if (!isDue) {
      updated.push(reminder);
      return;
    }
    due.push(reminder);
    updated.push({ ...reminder, notified: true });
    const next = nextOccurrence(reminder.datetime, reminder.repeat);
    if (next) {
      updated.push({
        ...reminder,
        id: makeId(),
        datetime: next.toISOString(),
        notified: false,
        completed: false,
      });
    }
  });
  return { due, updated };
}

/** Formats a Date for an `<input type="datetime-local">` value in local time. */
export function toDateTimeLocalValue(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}
