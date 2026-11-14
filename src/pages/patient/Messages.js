import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import { useAppData } from '../../state/AppDataProvider';
import { MESSAGE_TYPES, SEED_MESSAGES } from '../../data/patient';
import { formatDate, formatRelative } from '../../utils/format';

export default function Messages() {
  usePageTitle('Messages');
  const [params] = useSearchParams();
  const { readMessages, setReadMessages } = useAppData();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expanded, setExpanded] = useState(params.get('open'));

  const markRead = (id) => setReadMessages((prev) => (prev.includes(id) ? prev : [...prev, id]));

  useEffect(() => {
    const id = params.get('open');
    if (id) markRead(id);
    // run once for deep links from the dashboard
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messages = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEED_MESSAGES.filter(
      (m) =>
        (type === 'all' || m.type === type) &&
        (!q || `${m.title} ${m.body} ${m.from}`.toLowerCase().includes(q)),
    ).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      const diff = new Date(b.date) - new Date(a.date);
      return sortBy === 'oldest' ? -diff : diff;
    });
  }, [query, type, sortBy]);

  const unread = SEED_MESSAGES.filter((m) => !readMessages.includes(m.id)).length;

  return (
    <>
      <PageHeader
        eyebrow="Patient portal"
        title="Messages"
        description={
          unread
            ? `You have ${unread} unread ${unread === 1 ? 'message' : 'messages'}.`
            : 'You’re all caught up.'
        }
        actions={
          <Button
            startIcon={<MarkEmailReadOutlinedIcon />}
            disabled={unread === 0}
            onClick={() => setReadMessages(SEED_MESSAGES.map((m) => m.id))}
          >
            Mark all as read
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }} role="search">
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Search messages"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="msg-type">Type</InputLabel>
            <Select
              labelId="msg-type"
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="all">All types</MenuItem>
              {Object.entries(MESSAGE_TYPES).map(([value, meta]) => (
                <MenuItem key={value} value={value}>
                  {meta.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="msg-sort">Sort by</InputLabel>
            <Select
              labelId="msg-sort"
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest first</MenuItem>
              <MenuItem value="oldest">Oldest first</MenuItem>
              <MenuItem value="title">Title (A–Z)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {messages.length === 0 ? (
        <EmptyState
          icon={<SearchOffIcon />}
          title="No messages found"
          description="Try a different search or filter."
          action={
            <Button
              variant="outlined"
              onClick={() => {
                setQuery('');
                setType('all');
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <Box>
          {messages.map((m) => {
            const isUnread = !readMessages.includes(m.id);
            const meta = MESSAGE_TYPES[m.type];
            return (
              <Accordion
                key={m.id}
                disableGutters
                expanded={expanded === m.id}
                onChange={(_e, isOpen) => {
                  setExpanded(isOpen ? m.id : null);
                  if (isOpen) markRead(m.id);
                }}
                sx={{
                  '&:before': { display: 'none' },
                  border: 1,
                  borderColor: 'divider',
                  mb: 1.5,
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${m.id}-content`}
                  id={`${m.id}-header`}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 0.5, sm: 2 }}
                    sx={{ width: '100%', alignItems: { sm: 'center' }, pr: 1 }}
                  >
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}
                      >
                        {isUnread && (
                          <Box
                            component="span"
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                            }}
                            aria-label="Unread"
                            role="img"
                          />
                        )}
                        <Typography sx={{ fontWeight: isUnread ? 700 : 500 }}>{m.title}</Typography>
                        <Chip
                          size="small"
                          label={meta.label}
                          color={meta.color}
                          variant="outlined"
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {m.from}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ flexShrink: 0 }}
                      title={formatDate(m.date)}
                    >
                      {formatRelative(m.date)}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails id={`${m.id}-content`}>
                  <Typography>{m.body}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    Received {formatDate(m.date, "EEEE d MMMM yyyy 'at' h:mm a")}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </>
  );
}
