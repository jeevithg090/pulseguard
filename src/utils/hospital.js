import { DEMO_PATIENT } from '../data/patient';
import { DOCTORS_BY_ID } from '../data/doctors';
import { triagePriority } from './triage';

/** Bed utilisation summary: totals per type plus overall occupancy %. */
export function summarizeBeds(beds) {
  const byType = {};
  beds.forEach((bed) => {
    byType[bed.type] ??= { total: 0, occupied: 0, available: 0 };
    byType[bed.type].total += 1;
    if (bed.status === 'Occupied') byType[bed.type].occupied += 1;
    if (bed.status === 'Available') byType[bed.type].available += 1;
  });
  const total = beds.length;
  const occupied = beds.filter((b) => b.status === 'Occupied').length;
  const available = beds.filter((b) => b.status === 'Available').length;
  return {
    total,
    occupied,
    available,
    occupancy: total ? Math.round((occupied / total) * 100) : 0,
    byType,
  };
}

/** Combines seeded queue items with reports submitted from the patient portal, most urgent first. */
export function buildTriageQueue(seedQueue, patientReports) {
  const fromPatient = patientReports.map((r) => ({
    id: r.id,
    patient: `${DEMO_PATIENT.firstName} ${DEMO_PATIENT.lastName} (demo)`,
    age: 36,
    symptoms: r.symptoms.map((s) => s.label),
    level: r.level,
    submittedAt: r.submittedAt,
    status: 'New',
    fromPortal: true,
  }));
  return [...fromPatient, ...seedQueue].sort(
    (a, b) =>
      triagePriority(b.level) - triagePriority(a.level) ||
      new Date(b.submittedAt) - new Date(a.submittedAt),
  );
}

/** Maps appointments booked in the patient portal into the hospital schedule shape. */
export function patientAppointmentsForSchedule(appointments) {
  return appointments.map((a) => {
    const doctor = DOCTORS_BY_ID[a.doctorId];
    return {
      id: a.id,
      patientName: `${DEMO_PATIENT.firstName} ${DEMO_PATIENT.lastName} (demo)`,
      type: a.reason === 'follow-up' ? 'Follow-up' : 'Consultation',
      doctor: doctor?.name ?? 'Unknown',
      department: doctor?.specialty ?? '—',
      datetime: a.datetime,
      status: a.status,
      notes: a.notes || (a.mode === 'video' ? 'Video visit' : ''),
      source: 'patient',
    };
  });
}
