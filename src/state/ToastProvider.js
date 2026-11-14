import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';

const ToastContext = createContext(() => {});

/** Returns `showToast(message, { severity, actionLabel, onAction })`. */
export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, options = {}) => {
    setToast({ key: Date.now(), message, severity: 'success', ...options });
  }, []);

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') return;
    setToast(null);
  };

  const value = useMemo(() => showToast, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast?.key}
        open={Boolean(toast)}
        autoHideDuration={toast?.duration ?? 5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert
            onClose={handleClose}
            severity={toast.severity}
            variant="filled"
            sx={{ width: '100%', alignItems: 'center' }}
            action={
              toast.actionLabel ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    toast.onAction?.();
                    setToast(null);
                  }}
                >
                  {toast.actionLabel}
                </Button>
              ) : undefined
            }
          >
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  );
}
