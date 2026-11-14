import React, { useMemo, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatCard from '../../components/common/StatCard';
import ResponsiveTable from '../../components/common/ResponsiveTable';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import { useToast } from '../../state/ToastProvider';
import { BED_STATUSES, BED_TYPES, SHIFTS, STAFF_STATUSES } from '../../data/hospital';
import { summarizeBeds } from '../../utils/hospital';
import { createId } from '../../utils/id';

const BED_STATUS_COLOR = {
  Available: 'success',
  Occupied: 'error',
  Cleaning: 'info',
  Maintenance: 'warning',
};
const STAFF_STATUS_COLOR = { 'On duty': 'success', 'On break': 'warning', 'Off duty': 'default' };

const EMPTY_BED = { number: '', type: 'General', status: 'Available', patient: '' };
const EMPTY_STAFF = { name: '', role: '', shift: 'Morning', status: 'On duty' };

function validateBed(bed, beds) {
  const errors = {};
  if (!bed.number.trim()) errors.number = 'Enter a bed number.';
  else if (beds.some((b) => b.number === bed.number.trim() && b.id !== bed.id))
    errors.number = 'That bed number already exists.';
  if (bed.status === 'Occupied' && !bed.patient.trim())
    errors.patient = 'Occupied beds need a patient reference.';
  return errors;
}

function validateStaff(member) {
  const errors = {};
  if (!member.name.trim()) errors.name = 'Enter a name.';
  if (!member.role.trim()) errors.role = 'Enter a role.';
  return errors;
}

function SelectField({ label, value, options, onChange }) {
  const id = `field-${label.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <FormControl fullWidth>
      <InputLabel id={id}>{label}</InputLabel>
      <Select labelId={id} label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function ResourceAllocation() {
  usePageTitle('Resource allocation');
  const { beds, setBeds, staff, setStaff } = useAppData();
  const showToast = useToast();
  const [editor, setEditor] = useState(null); // { kind: 'bed'|'staff', value, isNew }
  const [errors, setErrors] = useState({});

  const summary = useMemo(() => summarizeBeds(beds), [beds]);
  const icu = summary.byType.ICU ?? { total: 0, occupied: 0, available: 0 };
  const onDuty = staff.filter((s) => s.status === 'On duty').length;

  const open = (kind, value) => {
    setErrors({});
    setEditor({
      kind,
      isNew: !value,
      value: value
        ? { ...value }
        : { id: createId(kind), ...(kind === 'bed' ? EMPTY_BED : EMPTY_STAFF) },
    });
  };

  const update = (patch) => setEditor((e) => ({ ...e, value: { ...e.value, ...patch } }));

  const save = (event) => {
    event.preventDefault();
    const { kind, value, isNew } = editor;
    const nextErrors = kind === 'bed' ? validateBed(value, beds) : validateStaff(value);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const clean =
      kind === 'bed'
        ? {
            ...value,
            number: value.number.trim(),
            patient: value.status === 'Occupied' ? value.patient.trim() : '',
          }
        : { ...value, name: value.name.trim(), role: value.role.trim() };
    const setter = kind === 'bed' ? setBeds : setStaff;
    setter((prev) => (isNew ? [...prev, clean] : prev.map((x) => (x.id === clean.id ? clean : x))));
    showToast(
      `${kind === 'bed' ? `Bed ${clean.number}` : clean.name} ${isNew ? 'added' : 'updated'}`,
    );
    setEditor(null);
  };

  const bedColumns = [
    { key: 'number', label: 'Bed', primary: true, render: (b) => `Bed ${b.number}` },
    { key: 'type', label: 'Ward' },
    {
      key: 'status',
      label: 'Status',
      render: (b) => <Chip size="small" label={b.status} color={BED_STATUS_COLOR[b.status]} />,
    },
    { key: 'patient', label: 'Patient', render: (b) => b.patient || '—' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (b) => (
        <Tooltip title="Edit bed">
          <IconButton aria-label={`Edit bed ${b.number}`} onClick={() => open('bed', b)}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const staffColumns = [
    { key: 'name', label: 'Name', primary: true },
    { key: 'role', label: 'Role' },
    { key: 'shift', label: 'Shift' },
    {
      key: 'status',
      label: 'Status',
      render: (s) => <Chip size="small" label={s.status} color={STAFF_STATUS_COLOR[s.status]} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (s) => (
        <Tooltip title="Edit staff member">
          <IconButton aria-label={`Edit ${s.name}`} onClick={() => open('staff', s)}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const value = editor?.value;

  return (
    <>
      <PageHeader
        eyebrow="Hospital portal"
        title="Resource allocation"
        description="Track bed status and staff rosters. Changes are saved in this browser."
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="ICU beds occupied"
            value={`${icu.occupied}/${icu.total}`}
            progress={icu.total ? (icu.occupied / icu.total) * 100 : 0}
            tone={icu.available <= 1 ? 'error' : 'primary'}
            icon={<MonitorHeartOutlinedIcon />}
            helper={`${icu.available} available`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="All beds occupied"
            value={`${summary.occupied}/${summary.total}`}
            progress={summary.occupancy}
            tone={summary.occupancy >= 85 ? 'error' : 'primary'}
            icon={<BedOutlinedIcon />}
            helper={`${summary.available} ready for admission`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Staff on duty"
            value={`${onDuty}/${staff.length}`}
            progress={staff.length ? (onDuty / staff.length) * 100 : 0}
            tone="success"
            icon={<GroupsOutlinedIcon />}
            helper="Across all departments"
          />
        </Grid>
      </Grid>

      <Stack spacing={3}>
        <SectionCard
          id="beds"
          title="Beds"
          icon={<BedOutlinedIcon />}
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => open('bed')}>
              Add bed
            </Button>
          }
        >
          <ResponsiveTable caption="Beds" columns={bedColumns} rows={beds} />
        </SectionCard>

        <SectionCard
          id="staff"
          title="Staff schedule"
          icon={<GroupsOutlinedIcon />}
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => open('staff')}>
              Add staff
            </Button>
          }
        >
          <ResponsiveTable caption="Staff schedule" columns={staffColumns} rows={staff} />
        </SectionCard>
      </Stack>

      <Dialog
        open={Boolean(editor)}
        onClose={() => setEditor(null)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="resource-dialog-title"
      >
        {editor && (
          <form onSubmit={save} noValidate>
            <DialogTitle id="resource-dialog-title">
              {editor.isNew ? 'Add' : 'Edit'} {editor.kind === 'bed' ? 'bed' : 'staff member'}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                {editor.kind === 'bed' ? (
                  <>
                    <TextField
                      required
                      autoFocus
                      label="Bed number"
                      value={value.number}
                      onChange={(e) => update({ number: e.target.value })}
                      error={Boolean(errors.number)}
                      helperText={errors.number}
                    />
                    <SelectField
                      label="Ward"
                      value={value.type}
                      options={BED_TYPES}
                      onChange={(type) => update({ type })}
                    />
                    <SelectField
                      label="Status"
                      value={value.status}
                      options={BED_STATUSES}
                      onChange={(status) => update({ status })}
                    />
                    {value.status === 'Occupied' && (
                      <TextField
                        required
                        label="Patient reference"
                        placeholder="e.g. Patient #4900"
                        value={value.patient}
                        onChange={(e) => update({ patient: e.target.value })}
                        error={Boolean(errors.patient)}
                        helperText={errors.patient ?? 'Use an ID, not a full name.'}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <TextField
                      required
                      autoFocus
                      label="Name"
                      value={value.name}
                      onChange={(e) => update({ name: e.target.value })}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                    />
                    <TextField
                      required
                      label="Role"
                      value={value.role}
                      onChange={(e) => update({ role: e.target.value })}
                      error={Boolean(errors.role)}
                      helperText={errors.role}
                    />
                    <SelectField
                      label="Shift"
                      value={value.shift}
                      options={SHIFTS}
                      onChange={(shift) => update({ shift })}
                    />
                    <SelectField
                      label="Status"
                      value={value.status}
                      options={STAFF_STATUSES}
                      onChange={(status) => update({ status })}
                    />
                  </>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              {!editor.isNew && (
                <Button
                  color="error"
                  sx={{ mr: 'auto' }}
                  onClick={() => {
                    const setter = editor.kind === 'bed' ? setBeds : setStaff;
                    setter((prev) => prev.filter((x) => x.id !== value.id));
                    showToast('Removed', { severity: 'info' });
                    setEditor(null);
                  }}
                >
                  Remove
                </Button>
              )}
              <Button onClick={() => setEditor(null)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </>
  );
}
