import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../test/renderApp';

jest.setTimeout(30000);

jest.mock('../components/map/FacilityMap', () => () => <div data-testid="facility-map" />);

describe('routing', () => {
  it('renders the home page with both portals', async () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: /connected care/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open patient portal/i })).toHaveAttribute(
      'href',
      '/patient',
    );
    expect(screen.getByRole('link', { name: /open hospital portal/i })).toHaveAttribute(
      'href',
      '/hospital',
    );
  });

  it('shows a 404 page for unknown routes', async () => {
    renderApp('/does-not-exist');
    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(document.title).toMatch(/page not found/i);
  });

  it('redirects the legacy care-navigation route to facility search', async () => {
    renderApp('/patient/care-navigation');
    expect(
      await screen.findByRole('heading', { name: /find healthcare near you/i }),
    ).toBeInTheDocument();
  });

  it('toggles dark mode', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }));
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });
});

describe('symptom report', () => {
  it('validates, triages and shares the report with the hospital queue', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp('/patient/symptoms');
    await screen.findByRole('heading', { name: /what symptoms do you have/i });

    await user.click(screen.getByRole('button', { name: /^continue/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/select at least one symptom/i);

    await user.click(screen.getByRole('button', { name: 'Chest pain' }));
    await user.click(screen.getAllByRole('button', { name: 'Shortness of breath' })[0]);
    await user.click(screen.getByRole('button', { name: /^continue/i }));

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    for (const slider of sliders) {
      act(() => slider.focus());
      await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}'); // 3 -> 6
    }
    await user.click(screen.getByRole('button', { name: /^continue/i }));
    await user.click(screen.getByRole('button', { name: /^review/i }));
    await user.click(screen.getByRole('button', { name: /submit report/i }));

    expect(await screen.findByText(/call emergency services/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /call 112/i })).toHaveAttribute('href', 'tel:112');
    unmount();

    renderApp('/hospital');
    const queue = await screen.findByRole('region', { name: /symptom triage queue/i });
    expect(within(queue).getByText(/alex morgan \(demo\)/i)).toBeInTheDocument();
  });
});

describe('reminders', () => {
  it('validates and adds a reminder', async () => {
    const user = userEvent.setup();
    renderApp('/patient/reminders');
    await user.click(await screen.findByRole('button', { name: /add reminder/i }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /add reminder/i }));
    expect(within(dialog).getByText(/give the reminder a short title/i)).toBeInTheDocument();

    await user.type(within(dialog).getByRole('textbox', { name: /title/i }), 'Vitamin D');
    await user.click(within(dialog).getByRole('button', { name: /add reminder/i }));

    expect(await screen.findByRole('heading', { name: 'Vitamin D' })).toBeInTheDocument();
    expect(
      JSON.parse(window.localStorage.getItem('pulseguard.reminders')).map((r) => r.title),
    ).toContain('Vitamin D');
  });
});

describe('appointment booking', () => {
  it('books a slot and shows it on the dashboard', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp('/patient/book-appointment');
    await user.click(await screen.findByRole('button', { name: /confirm booking/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/choose a doctor/i);

    await user.click(screen.getByRole('radio', { name: /dr\. ananya iyer/i }));
    // pick the first day that has availability, then the first slot
    const days = within(screen.getByRole('radiogroup', { name: /^date$/i })).getAllByRole('radio');
    const openDay = days.find((d) => !d.disabled);
    await user.click(openDay);
    const slots = within(screen.getByRole('radiogroup', { name: /available times/i })).getAllByRole(
      'radio',
    );
    await user.click(slots[0]);
    await user.click(screen.getByRole('button', { name: /confirm booking/i }));

    expect(await screen.findByRole('heading', { name: /you’re booked in/i })).toBeInTheDocument();
    unmount();

    renderApp('/patient');
    const upcoming = await screen.findByRole('region', { name: /upcoming appointments/i });
    expect(within(upcoming).getByText('Dr. Ananya Iyer')).toBeInTheDocument();
  });
});
