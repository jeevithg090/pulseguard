import { addDays, isSameDay, set, startOfDay } from 'date-fns';

/** Small deterministic string hash (FNV-1a) so demo availability is stable between renders. */
export function hashString(value) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

const pad = (n) => String(n).padStart(2, '0');
const dayKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Returns the next `count` bookable days (weekdays plus Saturday) starting today. */
export function bookableDays(count = 10, from = new Date()) {
  const days = [];
  let cursor = startOfDay(from);
  while (days.length < count) {
    if (cursor.getDay() !== 0) days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

/**
 * Generates 30-minute appointment slots for a doctor on a given day.
 * Availability is pseudo-random but deterministic per doctor/day, slots in
 * the past are unavailable, and slots already booked are marked as taken.
 *
 * @returns {Array<{id: string, time: Date, available: boolean}>}
 */
export function generateSlots({
  doctorId,
  date,
  now = new Date(),
  booked = [],
  startHour = 9,
  endHour = 17,
  intervalMinutes = 30,
}) {
  const slots = [];
  const isSaturday = date.getDay() === 6;
  const lastHour = isSaturday ? 13 : endHour;
  for (let hour = startHour; hour < lastHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const time = set(startOfDay(date), { hours: hour, minutes: minute });
      const id = `${doctorId}-${dayKey(date)}-${pad(hour)}${pad(minute)}`;
      const lunch = hour === 13 && !isSaturday;
      const randomlyFree = hashString(id) % 10 >= 3;
      const isBooked = booked.some(
        (b) =>
          String(b.doctorId) === String(doctorId) &&
          new Date(b.datetime).getTime() === time.getTime(),
      );
      slots.push({
        id,
        time,
        available: !lunch && randomlyFree && !isBooked && time > now,
      });
    }
  }
  return slots;
}

export function countAvailable(slots) {
  return slots.filter((s) => s.available).length;
}

export { isSameDay };
