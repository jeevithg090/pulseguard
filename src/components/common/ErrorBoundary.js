import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';

/** Catches render errors in a subtree and shows a recoverable error message. */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error', error, info);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Box sx={{ py: 6, maxWidth: 640, mx: 'auto' }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Reload
            </Button>
          }
        >
          <AlertTitle>Something went wrong</AlertTitle>
          This page failed to load. Reloading usually fixes it — your saved data is kept.
        </Alert>
      </Box>
    );
  }
}
