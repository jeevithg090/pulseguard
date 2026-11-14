import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { buildTheme } from './theme';
import { readStorage, writeStorage } from '../utils/storage';

const STORAGE_KEY = 'colorMode';

const ColorModeContext = createContext({ mode: 'light', toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

/** Provides the MUI theme and a light/dark toggle that follows the OS preference by default. */
export default function ColorModeProvider({ children }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  const [storedMode, setStoredMode] = useState(() => readStorage(STORAGE_KEY, null));
  const mode = storedMode || (prefersDark ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setStoredMode(next);
        writeStorage(STORAGE_KEY, next);
      },
    }),
    [mode],
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
