/** Thin, defensive wrapper around the browser Notification API. */

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission() {
  return notificationsSupported() ? window.Notification.permission : 'unsupported';
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  try {
    return await window.Notification.requestPermission();
  } catch {
    return window.Notification.permission;
  }
}

export function showBrowserNotification(title, options = {}) {
  if (notificationPermission() !== 'granted') return false;
  try {
    // eslint-disable-next-line no-new
    new window.Notification(title, { icon: `${process.env.PUBLIC_URL}/logo192.png`, ...options });
    return true;
  } catch {
    return false;
  }
}
