import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

const fontFamily = [
  'Inter',
  'system-ui',
  '-apple-system',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',');

const palettes = {
  light: {
    primary: { main: '#1565c0', light: '#5e92f3', dark: '#003c8f' },
    secondary: { main: '#7b1fa2', light: '#ae52d4', dark: '#4a0072' },
    success: { main: '#2e7d32' },
    warning: { main: '#b45309' },
    error: { main: '#c62828' },
    info: { main: '#0277bd' },
    background: { default: '#f4f6fb', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
    divider: 'rgba(15, 23, 42, 0.12)',
  },
  dark: {
    primary: { main: '#90caf9', light: '#c3fdff', dark: '#5d99c6' },
    secondary: { main: '#ce93d8', light: '#ffc4ff', dark: '#9c64a6' },
    success: { main: '#81c784' },
    warning: { main: '#ffb74d' },
    error: { main: '#ef9a9a' },
    info: { main: '#81d4fa' },
    background: { default: '#0b1220', paper: '#111a2e' },
    text: { primary: '#e2e8f0', secondary: '#a3b1c6' },
    divider: 'rgba(226, 232, 240, 0.14)',
  },
};

/**
 * Builds the PulseGuard design system for the given colour mode.
 * Spacing uses MUI's 8px scale; radii and elevation are kept deliberately subtle.
 */
export function buildTheme(mode = 'light') {
  const isDark = mode === 'dark';
  const theme = createTheme({
    palette: { mode, contrastThreshold: 4.5, ...palettes[mode] },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily,
      h1: { fontSize: '2.75rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 },
      h2: { fontSize: '2.125rem', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.2 },
      h3: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontSize: '1.25rem', fontWeight: 600 },
      h6: { fontSize: '1.0625rem', fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
      overline: { fontWeight: 700, letterSpacing: '0.08em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { WebkitFontSmoothing: 'antialiased' },
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              animationDuration: '0.01ms !important',
              transitionDuration: '0.01ms !important',
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: 'none' },
          outlined: ({ theme: t }) => ({ borderColor: t.palette.divider }),
        },
      },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: ({ theme: t }) => ({
            borderColor: t.palette.divider,
            transition: t.transitions.create(['box-shadow', 'border-color', 'transform'], {
              duration: t.transitions.duration.shorter,
            }),
          }),
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 10, minHeight: 40, paddingInline: 16 },
          sizeLarge: { minHeight: 48 },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 500 } },
      },
      MuiTextField: { defaultProps: { variant: 'outlined' } },
      MuiTooltip: { defaultProps: { arrow: true } },
      MuiTableCell: {
        styleOverrides: {
          head: ({ theme: t }) => ({
            fontWeight: 600,
            color: t.palette.text.secondary,
            whiteSpace: 'nowrap',
          }),
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
        styleOverrides: {
          root: ({ theme: t }) => ({
            backgroundColor: alpha(t.palette.background.paper, isDark ? 0.85 : 0.9),
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${t.palette.divider}`,
          }),
        },
      },
      MuiLink: { defaultProps: { underline: 'hover' } },
    },
  });

  return responsiveFontSizes(theme);
}
