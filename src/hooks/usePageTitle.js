import { useEffect } from 'react';
import config from '../config';

/** Sets `document.title` to "<title> · PulseGuard" while the page is mounted. */
export default function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${config.appName}` : config.appName;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
