import { bookableDays, countAvailable, generateSlots, hashString } from '../slots';

describe('hashString', () => {
  it('is deterministic', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).not.toBe(hashString('abd'));
  });
});

describe('bookableDays', () => {
  it('skips Sundays', () => {
    const days = bookableDays(7, new Date(2026, 2, 7)); // Saturday
    expect(days).toHaveLength(7);
    expect(days.some((d) => d.getDay() === 0)).toBe(false);
  });
});

describe('generateSlots', () => {
  const monday = new Date(2026, 2, 9);
  const before = new Date(2026, 2, 1);

  it('creates 30-minute weekday slots from 9:00 to 17:00 with lunch blocked', () => {
    const slots = generateSlots({ doctorId: 'd1', date: monday, now: before });
    expect(slots).toHaveLength(16);
    expect(slots.filter((s) => s.time.getHours() === 13).every((s) => !s.available)).toBe(true);
  });

  it('is stable for the same doctor and day', () => {
    const a = generateSlots({ doctorId: 'd1', date: monday, now: before });
    const b = generateSlots({ doctorId: 'd1', date: monday, now: before });
    expect(a.map((s) => s.available)).toEqual(b.map((s) => s.available));
  });

  it('marks past and booked slots as unavailable', () => {
    const all = generateSlots({ doctorId: 'd1', date: monday, now: before });
    const free = all.find((s) => s.available);
    const booked = generateSlots({
      doctorId: 'd1',
      date: monday,
      now: before,
      booked: [{ doctorId: 'd1', datetime: free.time.toISOString() }],
    });
    expect(booked.find((s) => s.id === free.id).available).toBe(false);

    const late = generateSlots({ doctorId: 'd1', date: monday, now: new Date(2026, 2, 9, 23) });
    expect(countAvailable(late)).toBe(0);
  });

  it('only offers mornings on Saturday', () => {
    const slots = generateSlots({ doctorId: 'd1', date: new Date(2026, 2, 14), now: before });
    expect(Math.max(...slots.map((s) => s.time.getHours()))).toBe(12);
  });
});
