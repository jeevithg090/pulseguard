import React, { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import SectionNav from './SectionNav';
import Footer from './Footer';
import PageLoader from '../common/PageLoader';
import ErrorBoundary from '../common/ErrorBoundary';
import useReminderNotifier from '../../hooks/useReminderNotifier';

export default function AppLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const isFirstRender = useRef(true);
  useReminderNotifier();

  // Move focus to the main region and scroll to top on route change (keyboard & screen-reader friendly).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: 8,
          top: -48,
          zIndex: 2000,
          px: 2,
          py: 1,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          fontWeight: 600,
          '&:focus': { top: 8 },
        }}
      >
        Skip to main content
      </Box>
      <Header />
      <SectionNav />
      <Box
        component="main"
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        sx={{ flexGrow: 1, outline: 'none' }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <ErrorBoundary resetKey={pathname}>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
