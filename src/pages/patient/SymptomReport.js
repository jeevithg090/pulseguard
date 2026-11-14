import React, { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import CallIcon from '@mui/icons-material/Call';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import EmptyState from '../../components/common/EmptyState';
import TriageChip from '../../components/common/TriageChip';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import { useToast } from '../../state/ToastProvider';
import {
  BODY_REGIONS,
  DURATION_UNITS,
  ENVIRONMENTAL_FACTORS,
  SEVERITY_LABELS,
  SYMPTOMS,
  SYMPTOMS_BY_ID,
  SYMPTOM_PATTERNS,
} from '../../data/symptoms';
import { assessSymptoms, suggestRelatedSymptoms, TRIAGE_META } from '../../utils/triage';
import { formatDateTime } from '../../utils/format';
import { createId } from '../../utils/id';
import config from '../../config';

const STEPS = ['Symptoms', 'Severity & duration', 'Details', 'Review'];
const CATEGORIES = [...new Set(SYMPTOMS.map((s) => s.category))];
const DEFAULT_DETAILS = { severity: 3, duration: 1, unit: 'days' };

const severityColor = (value) => (value >= 8 ? 'error' : value >= 5 ? 'warning' : 'success');

function ToggleChip({ selected, label, onToggle }) {
  return (
    <Chip
      label={label}
      clickable
      onClick={onToggle}
      color={selected ? 'primary' : 'default'}
      variant={selected ? 'filled' : 'outlined'}
      icon={selected ? <CheckIcon /> : undefined}
      aria-pressed={selected}
      sx={{ minHeight: 36, fontSize: '0.9rem' }}
    />
  );
}

const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

export default function SymptomReport() {
  usePageTitle('Report symptoms');
  const { symptomReports, setSymptomReports } = useAppData();
  const showToast = useToast();

  const [activeStep, setActiveStep] = useState(0);
  const [selected, setSelected] = useState([]);
  const [details, setDetails] = useState({});
  const [patterns, setPatterns] = useState([]);
  const [regions, setRegions] = useState([]);
  const [factors, setFactors] = useState([]);
  const [medications, setMedications] = useState([]);
  const [medicationDraft, setMedicationDraft] = useState('');
  const [notes, setNotes] = useState('');
  const [stepError, setStepError] = useState('');
  const [result, setResult] = useState(null);

  const suggestions = useMemo(() => suggestRelatedSymptoms(selected), [selected]);
  const entries = selected.map((id) => ({ id, ...DEFAULT_DETAILS, ...details[id] }));

  const toggleSymptom = (id) => {
    setStepError('');
    setSelected((prev) => toggleIn(prev, id));
    setDetails((prev) => (prev[id] ? prev : { ...prev, [id]: { ...DEFAULT_DETAILS } }));
  };

  const updateDetail = (id, patch) =>
    setDetails((prev) => ({ ...prev, [id]: { ...DEFAULT_DETAILS, ...prev[id], ...patch } }));

  const validateStep = () => {
    if (activeStep === 0 && selected.length === 0) {
      return 'Select at least one symptom to continue.';
    }
    if (activeStep === 1) {
      const invalid = entries.find((e) => !(Number(e.duration) > 0));
      if (invalid)
        return `Enter how long you’ve had ${SYMPTOMS_BY_ID[invalid.id].label.toLowerCase()}.`;
    }
    return '';
  };

  const handleNext = () => {
    const error = validateStep();
    setStepError(error);
    if (!error) setActiveStep((s) => s + 1);
  };

  const addMedication = () => {
    const value = medicationDraft.trim();
    if (!value) return;
    setMedications((prev) => [...prev, value]);
    setMedicationDraft('');
  };

  const handleSubmit = () => {
    const assessment = assessSymptoms(entries);
    const report = {
      id: createId('report'),
      submittedAt: new Date().toISOString(),
      level: assessment.level,
      flagged: assessment.flagged,
      symptoms: entries.map((e) => ({ ...e, label: SYMPTOMS_BY_ID[e.id].label })),
      patterns,
      regions,
      factors,
      medications,
      notes: notes.trim(),
    };
    setSymptomReports((prev) => [report, ...prev].slice(0, 20));
    setResult({ report, assessment });
    showToast('Symptom report submitted to your care team');
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelected([]);
    setDetails({});
    setPatterns([]);
    setRegions([]);
    setFactors([]);
    setMedications([]);
    setNotes('');
    setStepError('');
    setResult(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="Patient portal"
        title="Report your symptoms"
        description="Answer a few questions and we’ll suggest where to get care. This is a demo triage tool, not a diagnosis."
      />

      <Alert severity="error" variant="outlined" role="note" sx={{ mb: 3 }}>
        Severe chest pain, trouble breathing, fainting or signs of a stroke?{' '}
        <strong>
          Call{' '}
          <Link href={`tel:${config.emergencyNumber}`} color="inherit" underline="always">
            {config.emergencyNumber}
          </Link>{' '}
          now.
        </strong>
      </Alert>

      {result ? (
        <TriageResult result={result} onRestart={resetForm} />
      ) : (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ mb: 4, '& .MuiStepLabel-label': { fontSize: { xs: '0.75rem', sm: '0.875rem' } } }}
          >
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="section" aria-labelledby="step-heading">
            <Typography variant="h5" component="h2" id="step-heading" sx={{ mb: 2 }}>
              {
                [
                  'What symptoms do you have?',
                  'How bad is it, and for how long?',
                  'Anything else? (optional)',
                  'Review your report',
                ][activeStep]
              }
            </Typography>

            {activeStep === 0 && (
              <Stack spacing={3}>
                {CATEGORIES.map((category) => (
                  <Box key={category} role="group" aria-label={category}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      {category}
                    </Typography>
                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {SYMPTOMS.filter((s) => s.category === category).map((symptom) => (
                        <ToggleChip
                          key={symptom.id}
                          label={symptom.label}
                          selected={selected.includes(symptom.id)}
                          onToggle={() => toggleSymptom(symptom.id)}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
                {suggestions.length > 0 && (
                  <Alert severity="info" icon={false}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                      Often reported together — do you also have:
                    </Typography>
                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {suggestions.map((id) => (
                        <Chip
                          key={id}
                          label={SYMPTOMS_BY_ID[id].label}
                          icon={<AddIcon />}
                          onClick={() => toggleSymptom(id)}
                          variant="outlined"
                          color="info"
                        />
                      ))}
                    </Stack>
                  </Alert>
                )}
              </Stack>
            )}

            {activeStep === 1 && (
              <Stack spacing={2}>
                {entries.map((entry) => {
                  const def = SYMPTOMS_BY_ID[entry.id];
                  const sliderId = `severity-${entry.id}`;
                  return (
                    <Paper key={entry.id} variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h6" component="h3">
                        {def.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {def.description}
                      </Typography>
                      <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                        <Grid size={{ xs: 12, md: 7 }}>
                          <Typography id={sliderId} variant="body2" sx={{ fontWeight: 600 }}>
                            Severity: {entry.severity}/10 — {SEVERITY_LABELS[entry.severity]}
                          </Typography>
                          <Slider
                            aria-labelledby={sliderId}
                            value={entry.severity}
                            min={1}
                            max={10}
                            step={1}
                            marks={[
                              { value: 1, label: 'Mild' },
                              { value: 5, label: 'Moderate' },
                              { value: 10, label: 'Severe' },
                            ]}
                            valueLabelDisplay="auto"
                            getAriaValueText={(v) => `${v} out of 10, ${SEVERITY_LABELS[v]}`}
                            color={severityColor(entry.severity)}
                            onChange={(_e, value) => updateDetail(entry.id, { severity: value })}
                            sx={{ mx: 1, width: 'calc(100% - 16px)' }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                          <Stack direction="row" spacing={1.5}>
                            <TextField
                              label="Duration"
                              type="number"
                              value={entry.duration}
                              onChange={(e) =>
                                updateDetail(entry.id, {
                                  duration: e.target.value === '' ? '' : Number(e.target.value),
                                })
                              }
                              slotProps={{ htmlInput: { min: 1, max: 999, inputMode: 'numeric' } }}
                              sx={{ width: 120 }}
                            />
                            <FormControl sx={{ minWidth: 120, flexGrow: 1 }}>
                              <InputLabel id={`unit-${entry.id}`}>Unit</InputLabel>
                              <Select
                                labelId={`unit-${entry.id}`}
                                label="Unit"
                                value={entry.unit}
                                onChange={(e) => updateDetail(entry.id, { unit: e.target.value })}
                              >
                                {DURATION_UNITS.map((u) => (
                                  <MenuItem key={u.value} value={u.value}>
                                    {u.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
              </Stack>
            )}

            {activeStep === 2 && (
              <Stack spacing={3}>
                <ChipGroup
                  title="When do symptoms happen?"
                  options={SYMPTOM_PATTERNS}
                  value={patterns}
                  onToggle={(id) => setPatterns((p) => toggleIn(p, id))}
                />
                <ChipGroup
                  title="Where on your body?"
                  options={BODY_REGIONS}
                  value={regions}
                  onToggle={(id) => setRegions((p) => toggleIn(p, id))}
                />
                <ChipGroup
                  title="Possible triggers"
                  options={ENVIRONMENTAL_FACTORS}
                  value={factors}
                  onToggle={(id) => setFactors((p) => toggleIn(p, id))}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Medicines you’ve taken for this
                  </Typography>
                  <Stack
                    component="form"
                    direction="row"
                    spacing={1}
                    onSubmit={(e) => {
                      e.preventDefault();
                      addMedication();
                    }}
                  >
                    <TextField
                      size="small"
                      label="Medicine and dose"
                      placeholder="e.g. Paracetamol 500 mg"
                      value={medicationDraft}
                      onChange={(e) => setMedicationDraft(e.target.value)}
                      sx={{ flexGrow: 1, maxWidth: 420 }}
                    />
                    <Button
                      type="submit"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      disabled={!medicationDraft.trim()}
                    >
                      Add
                    </Button>
                  </Stack>
                  {medications.length > 0 && (
                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                      {medications.map((m, i) => (
                        <Chip
                          key={`${m}-${i}`}
                          label={m}
                          onDelete={() => setMedications((prev) => prev.filter((_, j) => j !== i))}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
                <TextField
                  label="Notes for your doctor"
                  multiline
                  minRows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  slotProps={{ htmlInput: { maxLength: 1000 } }}
                  helperText={`${notes.length}/1000`}
                />
              </Stack>
            )}

            {activeStep === 3 && (
              <ReviewStep
                entries={entries}
                patterns={patterns}
                regions={regions}
                factors={factors}
                medications={medications}
                notes={notes}
              />
            )}
          </Box>

          {stepError && (
            <Alert severity="warning" sx={{ mt: 3 }} role="alert">
              {stepError}
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => {
                setStepError('');
                setActiveStep((s) => s - 1);
              }}
            >
              Back
            </Button>
            {activeStep < STEPS.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                {activeStep === 2 ? 'Review' : 'Continue'}
                {activeStep === 0 && selected.length > 0 ? ` (${selected.length})` : ''}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleSubmit}>
                Submit report
              </Button>
            )}
          </Stack>
        </Paper>
      )}

      <SectionCard
        id="history"
        title="Previous checks"
        icon={<HistoryIcon />}
        sx={{ mt: 3 }}
        action={
          symptomReports.length > 0 && (
            <Button size="small" color="inherit" onClick={() => setSymptomReports([])}>
              Clear history
            </Button>
          )
        }
      >
        {symptomReports.length === 0 ? (
          <EmptyState
            dense
            title="No previous checks"
            description="Submitted reports are saved in this browser."
          />
        ) : (
          <List disablePadding>
            {symptomReports.map((report, i) => (
              <React.Fragment key={report.id}>
                {i > 0 && <Divider component="li" />}
                <ListItem disableGutters sx={{ gap: 2, flexWrap: 'wrap' }}>
                  <ListItemText
                    primary={report.symptoms.map((s) => `${s.label} (${s.severity}/10)`).join(', ')}
                    secondary={formatDateTime(report.submittedAt)}
                    sx={{ minWidth: 200 }}
                  />
                  <TriageChip level={report.level} />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </SectionCard>
    </>
  );
}

function ChipGroup({ title, options, value, onToggle }) {
  return (
    <Box role="group" aria-label={title}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
        {options.map((o) => (
          <ToggleChip
            key={o.id}
            label={o.label}
            selected={value.includes(o.id)}
            onToggle={() => onToggle(o.id)}
          />
        ))}
      </Stack>
    </Box>
  );
}

const labelsFor = (ids, options) =>
  ids.map((id) => options.find((o) => o.id === id)?.label).filter(Boolean);

function ReviewStep({ entries, patterns, regions, factors, medications, notes }) {
  const rows = [
    ['Patterns', labelsFor(patterns, SYMPTOM_PATTERNS)],
    ['Body areas', labelsFor(regions, BODY_REGIONS)],
    ['Triggers', labelsFor(factors, ENVIRONMENTAL_FACTORS)],
    ['Medicines', medications],
  ].filter(([, values]) => values.length > 0);

  return (
    <Stack spacing={2}>
      {entries.map((entry) => (
        <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Box>
              <Typography sx={{ fontWeight: 600 }}>{SYMPTOMS_BY_ID[entry.id].label}</Typography>
              <Typography variant="body2" color="text.secondary">
                For {entry.duration} {entry.unit}
              </Typography>
            </Box>
            <Chip
              label={`${entry.severity}/10 · ${SEVERITY_LABELS[entry.severity]}`}
              color={severityColor(entry.severity)}
            />
          </Stack>
        </Paper>
      ))}
      {rows.map(([label, values]) => (
        <Box key={label}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography>{values.join(', ')}</Typography>
        </Box>
      ))}
      {notes.trim() && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Notes
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{notes}</Typography>
        </Box>
      )}
    </Stack>
  );
}

function TriageResult({ result, onRestart }) {
  const { assessment, report } = result;
  const meta = TRIAGE_META[assessment.level];
  const reasons = [...assessment.reasons, ...assessment.results.flatMap((r) => r.reasons)];
  const isUrgent = assessment.level === 'urgent' || assessment.level === 'emergency';

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }} aria-live="polite">
      <Alert
        severity={meta.color}
        sx={{ mb: 3 }}
        icon={isUrgent ? <ErrorOutlineIcon /> : <CheckCircleOutlineIcon />}
      >
        <AlertTitle sx={{ fontWeight: 700 }}>
          <TriageChip level={assessment.level} sx={{ mr: 1 }} />
          {meta.headline}
        </AlertTitle>
        Your report was saved and shared with the hospital triage queue.
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            What to do next
          </Typography>
          <List dense>
            {meta.advice.map((a) => (
              <ListItem key={a} disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary={a} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Why
          </Typography>
          {reasons.length ? (
            <List dense>
              {[...new Set(reasons)].map((r) => (
                <ListItem key={r} disableGutters>
                  <ListItemText primary={r} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              Your symptoms are mild and recent (
              {report.symptoms.map((s) => s.label.toLowerCase()).join(', ')}).
            </Typography>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        {assessment.level === 'emergency' && (
          <Button
            variant="contained"
            color="error"
            startIcon={<CallIcon />}
            href={`tel:${config.emergencyNumber}`}
          >
            Call {config.emergencyNumber}
          </Button>
        )}
        {isUrgent ? (
          <Button
            component={RouterLink}
            to="/patient/facilities?type=urgent-care"
            variant={assessment.level === 'emergency' ? 'outlined' : 'contained'}
          >
            Find urgent care nearby
          </Button>
        ) : (
          <Button component={RouterLink} to="/patient/book-appointment" variant="contained">
            Book an appointment
          </Button>
        )}
        <Button onClick={onRestart}>Start a new check</Button>
      </Stack>
    </Paper>
  );
}
