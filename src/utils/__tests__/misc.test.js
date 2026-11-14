import { readStorage, writeStorage } from '../storage';
import { initials, formatCurrency } from '../format';
import { buildTriageQueue, summarizeBeds } from '../hospital';
import { activeItemForPath, portalForPath } from '../../components/layout/navigation';

describe('storage', () => {
  it('round-trips JSON with a namespaced key', () => {
    writeStorage('thing', { a: 1 });
    expect(window.localStorage.getItem('pulseguard.thing')).toBe('{"a":1}');
    expect(readStorage('thing', null)).toEqual({ a: 1 });
  });
  it('falls back on missing or corrupt values', () => {
    expect(readStorage('missing', 'fallback')).toBe('fallback');
    window.localStorage.setItem('pulseguard.bad', '{not json');
    expect(readStorage('bad', [])).toEqual([]);
  });
});

describe('format', () => {
  it('builds initials without titles', () => {
    expect(initials('Dr. Sarah Smith')).toBe('SS');
    expect(initials('Nurse Emily Davis')).toBe('ED');
  });
  it('formats rupees', () => {
    expect(formatCurrency(1500)).toMatch(/1,500/);
  });
});

describe('hospital helpers', () => {
  it('summarises bed occupancy', () => {
    const summary = summarizeBeds([
      { type: 'ICU', status: 'Occupied' },
      { type: 'ICU', status: 'Available' },
      { type: 'General', status: 'Cleaning' },
      { type: 'General', status: 'Occupied' },
    ]);
    expect(summary).toMatchObject({ total: 4, occupied: 2, available: 1, occupancy: 50 });
    expect(summary.byType.ICU).toEqual({ total: 2, occupied: 1, available: 1 });
    expect(summarizeBeds([]).occupancy).toBe(0);
  });

  it('merges patient reports into the triage queue, most urgent first', () => {
    const queue = buildTriageQueue(
      [{ id: 's1', level: 'routine', submittedAt: '2026-01-01T10:00:00Z', symptoms: [] }],
      [
        {
          id: 'p1',
          level: 'urgent',
          submittedAt: '2026-01-01T09:00:00Z',
          symptoms: [{ label: 'Fever' }],
        },
      ],
    );
    expect(queue.map((q) => q.id)).toEqual(['p1', 's1']);
    expect(queue[0]).toMatchObject({ fromPortal: true, symptoms: ['Fever'] });
  });
});

describe('navigation', () => {
  it('finds the active portal and item', () => {
    const portal = portalForPath('/patient/reminders');
    expect(portal.id).toBe('patient');
    expect(activeItemForPath(portal, '/patient/reminders').label).toBe('Reminders');
    expect(activeItemForPath(portal, '/patient').label).toBe('Overview');
    expect(portalForPath('/')).toBeNull();
  });
});
