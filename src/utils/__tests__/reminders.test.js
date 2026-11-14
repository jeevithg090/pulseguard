import {
  collectDueReminders,
  nextOccurrence,
  reminderStatus,
  sortReminders,
  toDateTimeLocalValue,
  validateReminder,
} from '../reminders';

const now = new Date('2026-03-10T12:00:00');
const base = {
  id: 'r1',
  title: 'Pill',
  repeat: 'none',
  notify: true,
  notified: false,
  completed: false,
};

describe('nextOccurrence', () => {
  it('advances repeating reminders', () => {
    const start = '2026-01-31T08:00:00';
    expect(nextOccurrence(start, 'daily').getDate()).toBe(1);
    expect(nextOccurrence(start, 'weekly').getDate()).toBe(7);
    expect(nextOccurrence(start, 'monthly').getMonth()).toBe(1); // clamps to end of February
  });
  it('returns null for non-repeating reminders', () => {
    expect(nextOccurrence('2026-01-01', 'none')).toBeNull();
  });
});

describe('reminderStatus', () => {
  it('classifies reminders relative to now', () => {
    expect(reminderStatus({ ...base, datetime: '2026-03-10T11:00:00' }, now)).toBe('overdue');
    expect(reminderStatus({ ...base, datetime: '2026-03-10T20:00:00' }, now)).toBe('today');
    expect(reminderStatus({ ...base, datetime: '2026-03-15T08:00:00' }, now)).toBe('upcoming');
    expect(reminderStatus({ ...base, completed: true, datetime: '2026-03-01' }, now)).toBe('done');
  });
});

describe('sortReminders', () => {
  it('sorts by date without mutating the input', () => {
    const list = [
      { ...base, id: 'b', datetime: '2026-03-12T08:00:00' },
      { ...base, id: 'a', datetime: '2026-03-11T08:00:00' },
    ];
    expect(sortReminders(list).map((r) => r.id)).toEqual(['a', 'b']);
    expect(list[0].id).toBe('b');
  });
});

describe('validateReminder', () => {
  it('requires a title and a future date for new reminders', () => {
    expect(validateReminder({ title: ' ', datetime: '' }, { now })).toEqual({
      title: expect.any(String),
      datetime: expect.any(String),
    });
    expect(
      validateReminder({ title: 'Pill', datetime: '2026-03-09T08:00' }, { now }).datetime,
    ).toMatch(/future/);
  });
  it('allows past dates when editing an existing reminder', () => {
    expect(
      validateReminder({ title: 'Pill', datetime: '2026-03-09T08:00' }, { isNew: false, now }),
    ).toEqual({});
  });
  it('accepts valid input', () => {
    expect(validateReminder({ title: 'Pill', datetime: '2026-03-11T08:00' }, { now })).toEqual({});
  });
});

describe('collectDueReminders', () => {
  it('marks due reminders as notified and schedules the next repeat', () => {
    const reminders = [
      { ...base, id: 'due', repeat: 'daily', datetime: '2026-03-10T08:00:00' },
      { ...base, id: 'later', datetime: '2026-03-11T08:00:00' },
      { ...base, id: 'done', completed: true, datetime: '2026-03-09T08:00:00' },
    ];
    const { due, updated } = collectDueReminders(reminders, now, () => 'next');
    expect(due.map((r) => r.id)).toEqual(['due']);
    expect(updated.find((r) => r.id === 'due').notified).toBe(true);
    const next = updated.find((r) => r.id === 'next');
    expect(new Date(next.datetime).getDate()).toBe(11);
    expect(next.notified).toBe(false);
    expect(updated).toHaveLength(4);
  });
  it('does not re-notify reminders', () => {
    const { due } = collectDueReminders(
      [{ ...base, notified: true, datetime: '2026-03-10T08:00:00' }],
      now,
      () => 'x',
    );
    expect(due).toHaveLength(0);
  });
});

describe('toDateTimeLocalValue', () => {
  it('formats local date-times for inputs', () => {
    expect(toDateTimeLocalValue(new Date(2026, 0, 5, 9, 7))).toBe('2026-01-05T09:07');
    expect(toDateTimeLocalValue('not a date')).toBe('');
  });
});
