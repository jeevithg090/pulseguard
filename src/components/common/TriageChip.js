import React from 'react';
import { Chip } from '@mui/material';
import { TRIAGE_META } from '../../utils/triage';

export default function TriageChip({ level, size = 'small', ...props }) {
  const meta = TRIAGE_META[level] ?? TRIAGE_META['self-care'];
  return <Chip label={meta.label} color={meta.color} size={size} {...props} />;
}
