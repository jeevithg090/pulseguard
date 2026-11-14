import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders, AppRoutes } from '../App';

export function renderApp(route = '/') {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    </AppProviders>,
  );
}
