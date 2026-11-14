import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SectionCard from '../common/SectionCard';
import { useAppData } from '../../state/AppDataProvider';
import { useToast } from '../../state/ToastProvider';
import { formatCurrency, formatDate } from '../../utils/format';

const FIELDS = [
  { name: 'provider', label: 'Insurance provider', required: true },
  { name: 'planType', label: 'Plan type', required: true },
  { name: 'policyNumber', label: 'Policy number', required: true },
  { name: 'groupNumber', label: 'Group number' },
  { name: 'validUntil', label: 'Valid until', type: 'date', required: true },
  { name: 'contactPhone', label: 'Member services phone', type: 'tel' },
];

function Detail({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="dt">
        {label}
      </Typography>
      <Typography
        variant="body2"
        component="dd"
        sx={{ m: 0, fontWeight: 600, wordBreak: 'break-word' }}
      >
        {value || '—'}
      </Typography>
    </Box>
  );
}

export default function InsuranceCard() {
  const { insurance, setInsurance } = useAppData();
  const showToast = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(insurance);
  const [errors, setErrors] = useState({});

  const openEditor = () => {
    setForm(insurance);
    setErrors({});
    setOpen(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const nextErrors = {};
    FIELDS.forEach((f) => {
      if (f.required && !String(form[f.name] ?? '').trim())
        nextErrors[f.name] = `${f.label} is required.`;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setInsurance({ ...insurance, ...form });
    setOpen(false);
    showToast('Insurance details updated');
  };

  return (
    <SectionCard
      id="insurance"
      title="Health insurance"
      subtitle={`${insurance.provider} · ${insurance.planType}`}
      icon={<CardMembershipOutlinedIcon />}
      sx={{ height: '100%' }}
      action={
        <Button size="small" startIcon={<EditOutlinedIcon />} onClick={openEditor}>
          Edit
        </Button>
      }
    >
      <Box
        component="dl"
        sx={{ m: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}
      >
        <Detail label="Policy number" value={insurance.policyNumber} />
        <Detail label="Valid until" value={formatDate(insurance.validUntil)} />
        <Detail label="Primary care copay" value={formatCurrency(insurance.copay.primaryCare)} />
        <Detail label="Specialist copay" value={formatCurrency(insurance.copay.specialist)} />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSave} noValidate>
          <DialogTitle>Edit insurance details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              {FIELDS.map((field) => (
                <Grid key={field.name} size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    type={field.type ?? 'text'}
                    required={field.required}
                    value={form[field.name] ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name] ?? ' '}
                    slotProps={field.type === 'date' ? { inputLabel: { shrink: true } } : undefined}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Stack direction="row" spacing={1}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save changes
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </Dialog>
    </SectionCard>
  );
}
