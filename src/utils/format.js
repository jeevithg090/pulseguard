import { format, formatDistanceToNowStrict, isToday, isTomorrow } from 'date-fns';

/** "Today · 10:00 AM", "Tomorrow · 9:30 AM" or "Tue 18 Nov · 2:00 PM". */
export function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const time = format(date, 'h:mm a');
  if (isToday(date)) return `Today · ${time}`;
  if (isTomorrow(date)) return `Tomorrow · ${time}`;
  return `${format(date, 'EEE d MMM')} · ${time}`;
}

export function formatDate(value, pattern = 'd MMM yyyy') {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : format(date, pattern);
}

/** "5 minutes ago" / "in 2 days". */
export function formatRelative(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const distance = formatDistanceToNowStrict(date);
  return date.getTime() <= Date.now() ? `${distance} ago` : `in ${distance}`;
}

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  return inr.format(amount);
}

/** Two-letter initials for an avatar ("Dr. Sarah Smith" → "SS"). */
export function initials(name = '') {
  return name
    .replace(/^(dr|nurse)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
