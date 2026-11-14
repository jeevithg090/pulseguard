import { useEffect, useRef } from 'react';
import { useAppData } from '../state/AppDataProvider';
import { useToast } from '../state/ToastProvider';
import { collectDueReminders } from '../utils/reminders';
import { showBrowserNotification } from '../utils/notifications';
import { createId } from '../utils/id';

const CHECK_INTERVAL_MS = 30_000;

/**
 * Checks for due reminders while the app is open, shows an in-app toast and,
 * when permission was granted, a browser notification. Repeating reminders
 * are rescheduled automatically.
 */
export default function useReminderNotifier() {
  const { reminders, setReminders } = useAppData();
  const showToast = useToast();
  const latest = useRef(reminders);
  latest.current = reminders;

  useEffect(() => {
    const check = () => {
      const { due, updated } = collectDueReminders(latest.current, new Date(), () =>
        createId('rem'),
      );
      if (due.length === 0) return;
      setReminders(updated);
      due.forEach((reminder) => {
        if (reminder.notify) {
          showBrowserNotification(reminder.title, {
            body: 'PulseGuard reminder',
            tag: reminder.id,
            requireInteraction: true,
          });
        }
      });
      showToast(
        due.length === 1 ? `Reminder: ${due[0].title}` : `${due.length} reminders are due`,
        { severity: 'info' },
      );
    };
    check();
    const interval = window.setInterval(check, CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [setReminders, showToast]);
}
